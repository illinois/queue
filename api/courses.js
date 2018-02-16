const router = require('express').Router({
  mergeParams: true,
})

const { check } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')

const {
  Course,
  Queue,
  User,
} = require('../models')
const {
  requireCourse,
  requireUser,
  failIfErrors,
} = require('./util')
const requireAdmin = require('../middleware/requireAdmin')
const requireCourseStaff = require('../middleware/requireCourseStaff')


// Get all courses
router.get('/', (req, res, _next) => {
  Course.findAll().then(courses => res.send(courses))
})


// Get a specific course
router.get('/:courseId', [
  requireCourse,
  failIfErrors,
], async (req, res, _next) => {
  const { id: courseId } = res.locals.course
  const { locals: { userAuthz } } = res

  const includes = [{ model: Queue }]
  // Only include list of course staff for other course staff or admins
  if (userAuthz.isAdmin || userAuthz.staffedCourseIds.indexOf(courseId) !== -1) {
    includes.push({
      model: User,
      as: 'staff',
      attributes: ['id', 'netid', 'name'],
      through: {
        attributes: [],
      },
    })
  }

  const course = await Course.findOne({
    where: { id: courseId },
    include: includes,
  })
  res.send(course)
})


// Create a new course
router.post('/', [
  requireAdmin,
  check('name', 'name must be specified').exists(),
  failIfErrors,
], async (req, res, _next) => {
  const { name } = matchedData(req)
  const course = Course.build({
    name,
  })
  const newCourse = await course.save()
  res.status(201).send(newCourse)
})

// Add someone to course staff
router.post('/:courseId/staff', [
  requireCourseStaff,
  requireCourse,
  check('netid', 'netid must be specified').exists(),
  check('name').optional(),
  failIfErrors,
], async (req, res, _next) => {
  const { netid, name } = matchedData(req)
  const [user] = await User.findOrCreate({ where: { netid } })
  if (name) {
    user.name = name
    await user.save()
  }
  await user.addStaffAssignment(res.locals.course.id)
  res.status(201).send(user)
})

// Remove someone from course staff
router.delete('/:courseId/staff/:userId', [
  requireCourseStaff,
  requireCourse,
  requireUser,
  failIfErrors,
], async (req, res, _next) => {
  const { user, course } = res.locals
  const oldStaffAssignments = await user.getStaffAssignments()
  await user.setStaffAssignments(oldStaffAssignments.filter(c => c.id !== course.id))
  res.status(202).send()
})

module.exports = router

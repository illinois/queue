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


// Get all courses
router.get('/', (req, res, _next) => {
  Course.findAll().then(courses => res.send(courses))
})


// Get a specific course
router.get('/:courseId', [
  requireCourse,
  failIfErrors,
], async (req, res, _next) => {
  const { courseId } = matchedData(req)
  const course = await Course.findOne({
    where: { id: courseId },
    include: [
      { model: Queue },
      {
        model: User,
        as: 'staff',
        attributes: ['id', 'netid', 'name'],
        through: {
          attributes: [],
        },
      },
    ],
  })
  res.send(course)
})


// Create a new course
router.post('/', [
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
  await user.addStaffAssignment(req.course.id)
  res.status(201).send(user)
})

// Remove someone from course staff
router.delete('/:courseId/staff/:userId', [
  requireCourse,
  requireUser,
  failIfErrors,
], async (req, res, _next) => {
  const { user, course } = req
  const oldStaffAssignments = user.getStaffAssignments()
  user.setStaffAssignments(oldStaffAssignments.filter(c => c.id !== course.id))
  await user.save()
  res.status(202).send()
})

module.exports = router

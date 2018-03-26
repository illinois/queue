const router = require('express').Router({
  mergeParams: true,
})

const { check } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')

const { Course, Queue, User } = require('../models')
const { requireCourse, requireUser, failIfErrors } = require('./util')
const requireAdmin = require('../middleware/requireAdmin')
const requireCourseStaff = require('../middleware/requireCourseStaff')
const safeAsync = require('../middleware/safeAsync')

// Get all courses
router.get(
  '/',
  safeAsync(async (req, res, _next) => {
    const courses = Course.findAll()
    res.send(courses)
  })
)

// Get a specific course
router.get(
  '/:courseId',
  [requireCourse, failIfErrors],
  safeAsync(async (req, res, _next) => {
    const { id: courseId } = res.locals.course
    const { locals: { userAuthz } } = res

    const includes = []
    // Only include list of course staff for other course staff or admins
    if (
      userAuthz.isAdmin ||
      userAuthz.staffedCourseIds.indexOf(courseId) !== -1
    ) {
      includes.push({
        model: User,
        as: 'staff',
        attributes: ['id', 'netid', 'name'],
        through: {
          attributes: [],
        },
      })
    }

    const course = (await Course.findOne({
      where: { id: courseId },
      include: includes,
    })).toJSON()

    // It turns out that sequelize can only generate queries that include the
    // question count if we query for queues separately from the course
    const queues = await Queue.scope('questionCount').findAll({
      where: { courseId },
    })

    course.queues = queues.map(q => q.toJSON())
    res.send(course)
  })
)

// Create a new course
router.post(
  '/',
  [
    requireAdmin,
    check('name', 'name must be specified').exists(),
    check('shortcode', 'shortcode must be specified').exists(),
    failIfErrors,
  ],
  safeAsync(async (req, res, _next) => {
    const { name, shortcode } = matchedData(req)
    const course = Course.build({
      name,
      shortcode,
    })
    const newCourse = await course.save()
    res.status(201).send(newCourse)
  })
)

// Add someone to course staff
router.post(
  '/:courseId/staff',
  [
    requireCourseStaff,
    requireCourse,
    check('netid', 'netid must be specified')
      .exists()
      .trim(),
    failIfErrors,
  ],
  safeAsync(async (req, res, _next) => {
    const { netid: originalNetid } = matchedData(req)
    const [netid] = originalNetid.split('@')
    const [user] = await User.findOrCreate({ where: { netid } })
    await user.addStaffAssignment(res.locals.course.id)
    res.status(201).send(user)
  })
)

// Remove someone from course staff
router.delete(
  '/:courseId/staff/:userId',
  [requireCourseStaff, requireCourse, requireUser, failIfErrors],
  safeAsync(async (req, res, _next) => {
    const { user, course } = res.locals
    const oldStaffAssignments = await user.getStaffAssignments()
    await user.setStaffAssignments(
      oldStaffAssignments.filter(c => c.id !== course.id)
    )
    res.status(202).send()
  })
)

module.exports = router

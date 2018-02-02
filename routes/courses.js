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
const { requireCourse, failIfErrors } = require('./util')


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
        attributes: ['id', 'netid', 'displayName'],
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
  failIfErrors,
], async (req, res, _next) => {
  const { netid } = matchedData(req)
  const [user] = await User.findOrCreate({ where: { netid } })
  user.addCourse(req.course)
  const newUser = await user.save()
  res.status(201).send(newUser)
})

module.exports = router

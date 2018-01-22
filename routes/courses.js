const router = require('express').Router({
  mergeParams: true,
})

const { check } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')

const {
  Course,
  Queue,
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
      { model: Queue, recursive: true },
    ],
  })
  res.send(course)
})


// Create a new course
router.post('/', [
  check('name', 'name must be specified'),
  failIfErrors,
], async (req, res, _next) => {
  const { name } = matchedData(req)
  const course = Course.build({
    name,
  })
  const newCourse = await course.save()
  res.status(201).send(newCourse)
})

module.exports = router

const router = require('express').Router({
  mergeParams: true,
})

const { check } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')

const {
  Course,
  Queue,
} = require('../models')
const { failIfErrors } = require('./util')


// Get all courses
router.get('/', (req, res, next) => {
  Course.findAll().then(courses => res.send(courses))
})


// Get a specific course
router.get('/:courseId', [
  check('courseId').toInt(),
  failIfErrors,
], (req, res, next) => {
  const data = matchedData(req)

  Course.findOne({
    where: { id: data.courseId },
    include: [
      { model: Queue, recursive: true },
    ],
  }).then(course => res.send(course))
})


// Create a new course
router.post('/', [
  check('name', 'name must be specified'),
  failIfErrors,
], (req, res, next) => {
  const data = matchedData(req)

  const course = Course.build({
    name: data.name,
  })

  course.save().then(newCourse => res.status(201).send(newCourse))
})

module.exports = router

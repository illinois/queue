const express = require('express')
const router = express.Router()
const validator = require('validator')

const {
  Course,
  Queue
} = require('../models')


// Get all courses
router.get('/', (req, res, next) => {
  Course.findAll().then(courses => res.send(courses))
})


// Get a specific course
router.get('/:courseId', function (req, res, next) {
  var courseId = validator.toInt(req.params.courseId)

  Course.findOne({
    where: { id: courseId },
    include: [
      { model: Queue, recursive: true }
    ]
  }).then(course => res.send(course))
})


// Create a new course
router.post('/', (req, res, next) => {
  if (!req.body.name) {
    res.status(400).send({ success: false, message: 'Course name not specified' })
    return
  }
  const course = Course.build()
  course.name = req.body.name

  console.log(req.body)
  console.log(course)

  course.save().then(course => res.send({ success: true, course }))
})

module.exports = router

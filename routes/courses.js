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

  course.save().then(course => res.send({ success: true, course }))
})


// Create a queue for this course
router.post('/:courseId/queues', (req, res, next) => {
  const courseId = validator.toInt(req.params.courseId)

  const queue = Queue.build({
    name: req.body.name,
    location: req.body.location,
    courseId: req.params.courseId
  })

  queue.save().then(queue => res.send({
    result: 'success',
    resultText: 'Queue created',
    queue
  }))
})

module.exports = router

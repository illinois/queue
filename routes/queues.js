const express = require('express')
const router = express.Router()
const validator = require('validator')

const {
  Queue,
  ActiveStaff,
  Question
} = require('../models')


// Get a list of all queues
router.get('/', (req, res, next) => {
  Queue.findAll().then(queues => res.send(queues))
})


// Creates a new queue
router.post('/', function (req, res, next) {
  var courseId = req.body.courseId

  // TODO: require courseStaff

  var question = Queue.build()
  question.Course.id = courseId
  question.name = req.body.name
  question.startTime = validator.toDate(req.body.startTime)
  question.endTime = validator.toDate(req.body.endTime)
  question.CreatedByUser.id = req.session.user.id

  question.save().then(function (queue) {
    res.send({ success: true, resultText: 'Queue Added', id: queue.id })
  })
})


// Gets a specific queue
router.get('/:queueId', function (req, res, next) {
  var queueId = validator.toInt(req.params.queueId)

  Queue.findOne({
    where: { id: queueId },
    include: [
      { model: ActiveStaff, recursive: true },
      { model: Question, recursive: true },
    ]
  }).then(function (queue) {
    // TODO: Strip private fields
    res.send(queue)
  })
})


// Get all questions for a particular queue
router.get('/:queueId/questions', function (req, res, next) {
  var queueId = validator.toInt(req.params.queueId)

  Question.find({
    where: { queueId }
  }).then((questions) => res.send(questions))
})


// Adds a question to a queue
router.post('/:queueId/questions', function (req, res, next) {
  var queueId = validator.toInt(req.params.queueId)

  var question = Question.build()
  question.name = req.body.name
  question.location = req.body.location
  question.topic = req.body.topic
  question.enqueueTime = new Date()
  question.queueId = queueId
  question.askedById = req.session.user.id

  question.save().then(function (question) {
    res.send({ success: true, resultText: 'Question Added', id: question.id })
  })
})



//
// Deletes the queue
//
router.delete('/:queueId', function (req, res, next) {
  var queueId = validator.toInt(req.params.queueId)

  // TODO: Require courseStaff

  Queue.findOne({
    where: { id: queueId },
  }).then(function (queue) {
    return queue.destroy()
  }).then(function () {
    res.send({ success: true, resultText: 'Queue Deleted' })
  })
})


module.exports = router

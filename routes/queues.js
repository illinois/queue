const router = require('express').Router({
  mergeParams: true,
})
const validator = require('validator')

const { check } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')

const {
  Queue,
  ActiveStaff,
  Question,
} = require('../models')

const { validateCourse, validateQueue, failIfErrors } = require('./util')


// Get a list of all queues
router.get('/', (req, res, next) => {
  Queue.findAll().then(queues => res.send(queues))
})


// Create a queue for a course
router.post('/', [
  validateCourse,
  check('name').isLength({ min: 1 }),
  check('location').optional({ nullable: true }),
  failIfErrors,
], (req, res, next) => {
  const data = matchedData(req)

  const queue = Queue.build({
    name: data.name,
    location: data.location,
    courseId: data.courseId,
  })

  queue.save().then(newQueue => res.status(201).send(newQueue))
})


// Gets a specific queue
router.get('/:queueId', [
  validateQueue,
  failIfErrors
], function (req, res, next) {
  const data = matchedData(req)

  Queue.findOne({
    where: { id: data.queueId },
    include: [
      { model: ActiveStaff, recursive: true },
      { model: Question, recursive: true },
    ]
  }).then(function (queue) {
    // TODO: Strip private fields
    res.send(queue)
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

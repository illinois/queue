const router = require('express').Router({
  mergeParams: true,
})

const { Op } = require('sequelize')
const { check } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')

const {
  Queue,
  ActiveStaff,
  Question,
} = require('../models')

const { requireCourse, requireQueue, failIfErrors } = require('./util')


// Get a list of all queues
router.get('/', async (req, res, _next) => {
  const queues = await Queue.findAll()
  res.send(queues)
})


// Create a queue for a course
router.post('/', [
  requireCourse,
  check('name').isLength({ min: 1 }),
  check('location').optional({ nullable: true }),
  failIfErrors,
], (req, res, _next) => {
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
  requireQueue,
  failIfErrors,
], async (req, res, _next) => {
  const data = matchedData(req)

  const queue = await Queue.findOne({
    where: {
      id: data.queueId,
    },
    include: [
      { model: ActiveStaff, recursive: true },
      {
        model: Question,
        required: false,
        where: {
          dequeueTime: null,
        },
      },
    ],
  })
  res.send(queue)
})


// Deletes the queue
router.delete('/:queueId', [
  requireQueue,
  failIfErrors,
], async (req, res, _next) => {
  await req.queue.destroy()
  res.status(202).send()
})


module.exports = router

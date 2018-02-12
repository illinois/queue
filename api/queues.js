const router = require('express').Router({
  mergeParams: true,
})

const { check } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')

const {
  Queue,
  ActiveStaff,
  Question,
  User,
} = require('../models')

const {
  requireCourse,
  requireQueue,
  requireUser,
  failIfErrors,
} = require('./util')

const requireAdmin = require('../middleware/requireAdmin')
const requireCourseStaffForQueue = require('../middleware/requireCourseStaffForQueue')
const requireCourseStaff = require('../middleware/requireCourseStaff')

// Get a list of all queues
router.get('/', [
  requireAdmin,
], async (req, res, _next) => {
  const queues = await Queue.findAll()
  res.json(queues)
})


// Create a queue for a course
router.post('/', [
  requireCourseStaff,
  requireCourse,
  check('name').isLength({ min: 1 }),
  check('location').optional({ nullable: true }),
  failIfErrors,
], (req, res, _next) => {
  const { id: courseId } = res.locals.course
  const data = matchedData(req)

  const queue = Queue.build({
    name: data.name,
    location: data.location,
    courseId,
    createdByUserId: res.locals.userAuthn.id,
  })

  queue.save().then(newQueue => res.status(201).json(newQueue))
})


// Gets a specific queue
router.get('/:queueId', [
  requireQueue,
  failIfErrors,
], async (req, res, _next) => {
  const { id: queueId } = res.locals.queue

  const queue = await Queue.findOne({
    where: {
      id: queueId,
    },
    include: [
      {
        model: ActiveStaff,
        where: {
          queueId,
          endTime: null,
        },
        required: false,
        include: [User],
      },
      {
        model: Question,
        required: false,
        where: {
          dequeueTime: null,
        },
      },
    ],
    order: [
      [Question, 'id', 'ASC'],
    ],
  })
  res.json(queue)
})


// Gets the on-duty staff list for a specific queue
router.get('/:queueId/staff', [
  requireQueue,
  failIfErrors,
], async (req, res, _next) => {
  const { queue } = res.locals
  const staff = await ActiveStaff.findAll({
    where: {
      endTime: null,
      queueId: queue.id,
    },
    include: [User],
  })
  res.json(staff)
})


// Joins the specified user to the specified queue
router.post('/:queueId/staff/:userId', [
  requireCourseStaffForQueue,
  requireQueue,
  requireUser,
  failIfErrors,
], async (req, res, _next) => {
  const { id: userId } = res.locals.userAuthn
  const { id: queueId } = res.locals.queue
  const [staff, created] = await ActiveStaff.findOrCreate({
    where: {
      userId,
      queueId,
      endTime: null,
    },
    defaults: {
      startTime: new Date(),
    },
    include: [User],
  })
  if (created) {
    // We have to redo the query to load the associted user properly
    const newStaff = await ActiveStaff.findOne({
      where: {
        userId,
        queueId,
        endTime: null,
      },
      include: [User],
    })
    res.status(202).json(newStaff)
  } else {
    res.status(202).json(staff)
  }
})


// Removes the specified user from the specified queue
router.delete('/:queueId/staff/:userId', [
  requireCourseStaffForQueue,
  requireQueue,
  requireUser,
  failIfErrors,
], async (req, res, _next) => {
  const { id: userId } = res.locals.user
  const { id: queueId } = res.locals.queue
  const staff = await ActiveStaff.find({
    where: {
      userId,
      queueId,
      endTime: null,
    },
  })

  if (staff) {
    staff.endTime = new Date()
    await staff.save()
  }

  res.status(202).send()
})


// Deletes the queue
router.delete('/:queueId', [
  requireCourseStaffForQueue,
  requireQueue,
  failIfErrors,
], async (req, res, _next) => {
  await res.locals.queue.destroy()
  res.status(202).send()
})


module.exports = router

const router = require('express').Router({
  mergeParams: true,
})

const { check, oneOf } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')

const { Queue, ActiveStaff, Question, User } = require('../models')
const safeAsync = require('../middleware/safeAsync')

const {
  requireCourse,
  requireQueue,
  requireUser,
  failIfErrors,
} = require('./util')

const requireCourseStaffForQueue = require('../middleware/requireCourseStaffForQueue')
const requireCourseStaff = require('../middleware/requireCourseStaff')

function validateLocation(req, res, next) {
  check('location')
    .optional({ nullable: true })
    .custom(value => {
      if (!res.locals.queue.fixedLocation) return true
      return !!value && value.length > 0
    })(req, res, next)
}

// Get all open queues
router.get(
  '/',
  safeAsync(async (req, res, _next) => {
    const queues = await Queue.scope('questionCount').findAll()
    res.json(queues)
  })
)

// Create a queue for a course
router.post(
  '/',
  [
    requireCourseStaff,
    requireCourse,
    check('name').isLength({ min: 1 }),
    oneOf([
      [
        check('fixedLocation').custom(value => value !== true),
        check('location').optional({ nullable: true }),
      ],
      [
        check('fixedLocation').custom(value => value === true),
        check('location').isLength({ min: 1 }),
      ],
    ]),
    failIfErrors,
  ],
  safeAsync(async (req, res, next) => {
    const { id: courseId } = res.locals.course
    const data = matchedData(req)

    const queue = await Queue.create({
      name: data.name,
      location: data.location,
      fixedLocation: data.fixedLocation === true,
      courseId,
      createdByUserId: res.locals.userAuthn.id,
    })

    Queue.scope('questionCount')
      .findByPk(queue.id)
      .then(newQueue => res.status(201).json(newQueue))
      .catch(next)
  })
)

// Gets a specific queue
router.get(
  '/:queueId',
  [requireQueue, failIfErrors],
  safeAsync(async (req, res, _next) => {
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
      order: [[Question, 'id', 'ASC']],
    })

    res.json(queue)
  })
)

// Modify a queue for a course
router.patch(
  '/:queueId',
  [
    requireCourseStaffForQueue,
    requireQueue,
    check('name')
      .optional({ nullable: true })
      .isLength({ min: 1 }),
    check('open')
      .optional({ nullable: true })
      .isBoolean(),
    check('message').optional({ nullable: true }),
    check('messageEnabled')
      .optional({ nullable: true })
      .isBoolean(),
    validateLocation,
    failIfErrors,
  ],
  safeAsync(async (req, res, _next) => {
    const { queue } = res.locals
    const data = matchedData(req)

    await queue.update({
      name: data.name !== null ? data.name : undefined,
      location: data.location !== null ? data.location : undefined,
      open: data.open !== null ? data.open : undefined,
      message: data.message !== null ? data.message : undefined,
      messageEnabled:
        data.messageEnabled !== null ? data.messageEnabled : undefined,
    })

    const updatedQueue = await Queue.scope('questionCount').findOne({
      where: { id: queue.id },
    })
    res.status(201).send(updatedQueue)
  })
)

// Gets the on-duty staff list for a specific queue
router.get(
  '/:queueId/staff',
  [requireQueue, failIfErrors],
  safeAsync(async (req, res, _next) => {
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
)

// Joins the specified user to the specified queue
router.post(
  '/:queueId/staff/:userId',
  [requireCourseStaffForQueue, requireQueue, requireUser, failIfErrors],
  safeAsync(async (req, res, _next) => {
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
)

// Removes the specified user from the specified queue
router.delete(
  '/:queueId/staff/:userId',
  [requireCourseStaffForQueue, requireQueue, requireUser, failIfErrors],
  safeAsync(async (req, res, _next) => {
    const { id: userId } = res.locals.user
    const { id: queueId } = res.locals.queue
    const staff = await ActiveStaff.findOne({
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
)

// Deletes the queue
router.delete(
  '/:queueId',
  [requireCourseStaffForQueue, requireQueue, failIfErrors],
  safeAsync(async (req, res, _next) => {
    await res.locals.queue.destroy()
    res.status(202).send()
  })
)

module.exports = router

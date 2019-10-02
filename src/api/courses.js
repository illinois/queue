const router = require('express').Router({
  mergeParams: true,
})

const { check } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')

const { Course, Queue, Question, User, Sequelize } = require('../models')
const { requireCourse, requireUser, failIfErrors } = require('./util')
const requireAdmin = require('../middleware/requireAdmin')
const requireCourseStaff = require('../middleware/requireCourseStaff')
const safeAsync = require('../middleware/safeAsync')

// Get all courses
router.get(
  '/',
  safeAsync(async (req, res, _next) => res.send(await Course.findAll()))
)

// Get a specific course
router.get(
  '/:courseId',
  [requireCourse, failIfErrors],
  safeAsync(async (req, res, _next) => {
    const { id: courseId } = res.locals.course
    const {
      locals: { userAuthz },
    } = res

    const includes = []
    const includeStaffList =
      userAuthz.isAdmin || userAuthz.staffedCourseIds.indexOf(courseId) !== -1
    // Only include list of course staff for other course staff or admins
    if (includeStaffList) {
      includes.push({
        model: User,
        as: 'staff',
        attributes: ['id', 'netid', 'name'],
        through: {
          attributes: [],
        },
      })
    }

    const course = (await Course.findOne({
      where: { id: courseId },
      include: includes,
    })).toJSON()

    if (includeStaffList) {
      // This is a workaround to https://github.com/sequelize/sequelize/issues/10552
      // TODO remove this once the issue is fixed in sequelize
      course.staff = course.staff.map(user => {
        return { name: user.preferredName || user.universityName, ...user }
      })
    }

    // It turns out that sequelize can only generate queries that include the
    // question count if we query for queues separately from the course
    const queues = await Queue.scope(
      'defaultScope', // Queues in the course endpoint don't need to include private attributes
      'questionCount'
    ).findAll({
      where: { courseId },
    })

    course.queues = queues.map(q => q.toJSON())
    res.send(course)
  })
)

// Get course queue data
router.get(
  '/:courseId/data',
  [requireCourseStaff, requireCourse, failIfErrors],
  safeAsync(async (req, res, _next) => {
    const { id: courseId } = res.locals.course
    const questionsFind = await Question.findAll({
      include: [
        {
          model: Queue,
          include: [
            {
              model: Course,
              attributes: [['name', 'CourseName']],
              required: true,
              where: { courseId: Sequelize.col('queue.courseId') },
            },
          ],
          attributes: [
            ['id', 'queueId'],
            'courseId',
            ['name', 'QueueName'],
            ['location', 'QueueLocation'],
            [
              Sequelize.fn(
                'datetime',
                Sequelize.col('queue.createdAt'),
                'localtime'
              ),
              'Queue_CreatedAt',
            ],
          ],
          required: true,
          where: { courseId: courseId, id: Sequelize.col('question.queueId') },
        },
        {
          model: User,
          as: 'askedBy',
          attributes: [
            ['netid', 'AskedBy_netid'],
            ['universityName', 'AskedBy_RealName'],
          ],
          required: true,
          where: { id: Sequelize.col('question.askedById') },
        },
        {
          model: User,
          as: 'answeredBy',
          attributes: [
            ['netid', 'AnsweredBy_netid'],
            ['universityName', 'AnsweredBy_RealName'],
          ],
          required: false,
          where: { id: Sequelize.col('question.answeredById') },
        },
      ],
      attributes: [
        'id',
        'topic',
        [
          Sequelize.fn('datetime', Sequelize.col('enqueueTime'), 'localtime'),
          'enqueueTime',
        ],
        [
          Sequelize.fn('datetime', Sequelize.col('dequeueTime'), 'localtime'),
          'dequeueTime',
        ],
        [
          Sequelize.fn(
            'datetime',
            Sequelize.col('answerStartTime'),
            'localtime'
          ),
          'answerStartTime',
        ],
        [
          Sequelize.fn(
            'datetime',
            Sequelize.col('answerFinishTime'),
            'localtime'
          ),
          'answerFinishTime',
        ],
        'comments',
        'preparedness',
        ['location', 'UserLocation'],
      ],
      order: [['enqueueTime', 'DESC']],
    })
    console.log(questionsFind)
    res.send(questionsFind)
  })
)

// Create a new course
router.post(
  '/',
  [
    requireAdmin,
    check('name', 'name must be specified').exists(),
    check('shortcode', 'shortcode must be specified').exists(),
    failIfErrors,
  ],
  safeAsync(async (req, res, _next) => {
    const { name, shortcode } = matchedData(req)
    const course = Course.build({
      name,
      shortcode,
    })
    const newCourse = await course.save()
    res.status(201).send(newCourse)
  })
)

// Add someone to course staff
router.post(
  '/:courseId/staff',
  [
    requireCourseStaff,
    requireCourse,
    check('netid', 'netid must be specified')
      .exists()
      .trim(),
    failIfErrors,
  ],
  safeAsync(async (req, res, _next) => {
    const { netid: originalNetid } = matchedData(req)
    const [netid] = originalNetid.split('@')
    const [user] = await User.findOrCreate({ where: { netid } })
    await user.addStaffAssignment(res.locals.course.id)
    res.status(201).send(user)
  })
)

// Remove someone from course staff
router.delete(
  '/:courseId/staff/:userId',
  [requireCourseStaff, requireCourse, requireUser, failIfErrors],
  safeAsync(async (req, res, _next) => {
    const { user, course } = res.locals
    const oldStaffAssignments = await user.getStaffAssignments()
    await user.setStaffAssignments(
      oldStaffAssignments.filter(c => c.id !== course.id)
    )
    res.status(202).send()
  })
)

module.exports = router

const router = require('express').Router({
  mergeParams: true,
})

const { check } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const moment = require('moment')

const { Course, Queue, Question, User, Sequelize } = require('../models')
const { requireCourse, requireUser, failIfErrors } = require('./util')
const requireAdmin = require('../middleware/requireAdmin')
const requireCourseStaff = require('../middleware/requireCourseStaff')
const safeAsync = require('../middleware/safeAsync')

const getCsv = questions => {
  const columns = new Set([
    'id',
    'topic',
    'enqueueTime',
    'dequeueTime',
    'answerStartTime',
    'answerFinishTime',
    'comments',
    'preparedness',
    'UserLocation',
    'answeredBy.AnsweredBy_uid',
    'answeredBy.AnsweredBy_UniversityName',
    'askedBy.AskedBy_uid',
    'askedBy.AskedBy_UniversityName',
    'queue.queueId',
    'queue.courseId',
    'queue.QueueName',
    'queue.QueueLocation',
    'queue.Queue_CreatedAt',
    'queue.course.CourseName',
  ])
  const timeFields = new Set([
    'queue.Queue_CreatedAt',
    'enqueueTime',
    'dequeueTime',
    'answerStartTime',
    'answerFinishTime',
  ])

  // Taken from https://stackoverflow.com/questions/8847766/how-to-convert-json-to-csv-format-and-store-in-a-variable
  const header = Array.from(columns)
  const replacer = (key, value) => (value === null ? '' : value)
  const csv = questions.map(row =>
    header
      .map(fieldName => {
        if (timeFields.has(fieldName)) {
          const time = row[fieldName]
          const formattedTime =
            time !== null
              ? moment
                  .tz(time, 'YYYY-MM-DD HH:mm:ss.SSS Z', 'US/Central')
                  .format('YYYY-MM-DD HH:mm:ss')
              : ''
          return JSON.stringify(formattedTime, replacer)
        }
        return JSON.stringify(row[fieldName], replacer)
      })
      .join(',')
  )
  const splitHeader = header.map(h => {
    const headerSplit = h.split('.')
    return headerSplit[headerSplit.length - 1]
  })
  csv.unshift(splitHeader.join(','))

  return csv.join('\n')
}

// Get all courses
router.get(
  '/',
  safeAsync(async (req, res, _next) => {
    const {
      locals: { userAuthz },
    } = res

    let courses
    if (userAuthz.isAdmin) {
      courses = await Course.findAll()
    } else {
      const { staffedCourseIds } = userAuthz
      courses = await Course.findAll({
        where: {
          [Sequelize.Op.or]: [{ id: staffedCourseIds }, { isUnlisted: false }],
        },
      })
    }

    res.send(courses)
  })
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
        attributes: ['id', 'uid', 'name'],
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
  '/:courseId/data/questions',
  [requireCourseStaff, requireCourse, failIfErrors],
  safeAsync(async (req, res, _next) => {
    const { id: courseId } = res.locals.course
    const questions = await Question.findAll({
      include: [
        {
          model: Queue,
          include: [
            {
              model: Course,
              attributes: [['name', 'CourseName']],
              required: true,
              where: { id: Sequelize.col('queue.courseId') },
            },
          ],
          attributes: [
            ['id', 'queueId'],
            'courseId',
            ['name', 'QueueName'],
            ['location', 'QueueLocation'],
            ['createdAt', 'Queue_CreatedAt'],
          ],
          required: true,
          where: { courseId, id: Sequelize.col('question.queueId') },
        },
        {
          model: User,
          as: 'askedBy',
          attributes: [
            ['uid', 'AskedBy_uid'],
            ['universityName', 'AskedBy_UniversityName'],
          ],
          required: true,
          where: { id: Sequelize.col('question.askedById') },
        },
        {
          model: User,
          as: 'answeredBy',
          attributes: [
            ['uid', 'AnsweredBy_uid'],
            ['universityName', 'AnsweredBy_UniversityName'],
          ],
          required: false,
          where: { id: Sequelize.col('question.answeredById') },
        },
      ],
      attributes: [
        'id',
        'topic',
        'enqueueTime',
        'dequeueTime',
        'answerStartTime',
        'answerFinishTime',
        'comments',
        'preparedness',
        ['location', 'UserLocation'],
      ],
      order: [['enqueueTime', 'DESC']],
      raw: true,
    })

    res
      .type('text/csv')
      .attachment('courseData.csv')
      .send(getCsv(questions))
  })
)

// Create a new course
router.post(
  '/',
  [
    requireAdmin,
    check('name', 'name must be specified').exists(),
    check('shortcode', 'shortcode must be specified').exists(),
    check('isUnlisted').isBoolean(),
    check('questionFeedback').isBoolean(),
    failIfErrors,
  ],
  safeAsync(async (req, res, _next) => {
    const { name, shortcode } = matchedData(req)
    const { isUnlisted, questionFeedback } = req.body
    const course = Course.build({
      name,
      shortcode,
      isUnlisted,
      questionFeedback,
    })
    const newCourse = await course.save()
    res.status(201).send(newCourse)
  })
)

// Modify a course's metadata
router.patch(
  '/:courseId',
  [
    requireCourseStaff,
    requireCourse,
    check('name').optional({ nullable: true }),
    check('shortcode').optional({ nullable: true }),
    check('isUnlisted').optional({ nullable: true }),
    check('questionFeedback').optional({ nullable: true }),
    failIfErrors,
  ],
  safeAsync(async (req, res, _next) => {
    const courseId = res.locals.course.dataValues.id
    const {
      locals: { userAuthz, course },
    } = res
    const data = matchedData(req)
    const { name, shortcode, isUnlisted, questionFeedback } = course

    if (userAuthz.isAdmin) {
      await course.update({
        name: data.name !== undefined ? data.name : name,
        shortcode: data.shortcode !== undefined ? data.shortcode : shortcode,
        isUnlisted:
          data.isUnlisted !== undefined ? data.isUnlisted : isUnlisted,
        questionFeedback:
          data.questionFeedback !== undefined
            ? data.questionFeedback
            : questionFeedback,
      })
    } else {
      if (data.name !== undefined || data.shortcode !== undefined) {
        if (data.name !== course.name || data.shortcode !== course.shortcode) {
          res.status(403).send({
            error: "don't have permission to change name or shortcode",
          })
          return
        }
      }

      await course.update({
        isUnlisted:
          data.isUnlisted !== undefined ? data.isUnlisted : isUnlisted,
        questionFeedback:
          questionFeedback !== undefined
            ? data.questionFeedback
            : questionFeedback,
      })
    }

    const updatedCourse = await Course.findOne({
      where: { id: courseId },
    })
    res.status(201).send(updatedCourse)
  })
)

// Add someone to course staff
router.put(
  '/:courseId/staff/:userId',
  [requireCourseStaff, requireCourse, requireUser, failIfErrors],
  safeAsync(async (req, res, _next) => {
    const { user } = res.locals
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
    await user.removeStaffAssignment(course)
    res.status(202).send()
  })
)

module.exports = router

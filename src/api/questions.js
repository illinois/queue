const router = require('express').Router({
  mergeParams: true,
})

const { check } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const axios = require('axios')

const constants = require('../constants')
const { Course, Queue, Question, User } = require('../models/')
const {
  requireQueue,
  requireQueueForQuestion,
  requireQuestion,
  failIfErrors,
  isUserStudent,
  filterConfidentialQueueQuestionsForUser,
  ApiError,
} = require('./util')
const requireCourseStaffForQueue = require('../middleware/requireCourseStaffForQueue')
const requireCourseStaffForQueueForQuestion = require('../middleware/requireCourseStaffForQueueForQuestion')
const safeAsync = require('../middleware/safeAsync')

/* eslint-disable no-param-reassign */
function modifyBeingAnswered(question, answering) {
  question.beingAnswered = answering
  if (answering) {
    question.answerStartTime = new Date()
  } else {
    question.answerEndTime = new Date()
  }
}
/* eslint-enable no-param-reassign */

function checkLocation(req, res, next) {
  check('location')
    .custom(value => {
      if (res.locals.queue.fixedLocation) return true
      return (
        !!value &&
        value.length > 0 &&
        value.length <= constants.QUESTION_LOCATION_MAX_LENGTH
      )
    })
    .trim()(req, res, next)
}

// Adds a question to a queue
router.post(
  '/',
  [
    requireQueue,
    check('name')
      .isLength({ min: 1, max: constants.QUESTION_NAME_MAX_LENGTH })
      .trim(),
    check('topic')
      .isLength({ min: 1, max: constants.QUESTION_TOPIC_MAX_LENGTH })
      .trim(),
    check('netid').optional({ nullable: true }),
    checkLocation,
    failIfErrors,
  ],
  safeAsync(async (req, res, next) => {
    const data = matchedData(req)
    const {
      userAuthz,
      queue: { id: queueId, courseId },
    } = res.locals
    // make sure queue is open
    if (!res.locals.queue.open) {
      next(new ApiError(422, 'This queue is closed'))
      return
    }

    // First, let's check if the request is coming from course staff and
    // includes a specific netid
    let askerUser = res.locals.userAuthn
    let askerId = res.locals.userAuthn.id
    if (data.netid) {
      if (userAuthz.isAdmin || userAuthz.staffedCourseIds.includes(courseId)) {
        // The user is allowed to do this!
        const [netid] = data.netid.split('@')
        const [user] = await User.findOrCreate({ where: { netid } })
        askerUser = user
        askerId = user.id
      } else {
        next(new ApiError(403, "You don't have authoriation to set a netid"))
        return
      }
    }

    // Let's check if the user already has a question for this queue
    const existingQuestion = await Question.findOne({
      where: {
        queueId,
        askedById: askerId,
        dequeueTime: null,
      },
    })
    if (existingQuestion) {
      next(new ApiError(422, 'You already have a question on this queue'))
      return
    }

    // If this queue has an admission control policy, let's query it to see
    // if this question will be allowed
    if (res.locals.queue.admissionControlEnabled) {
      let questionAllowed = true
      let questionAllowedReason = null
      try {
        const allowedResponse = await axios.post(
          res.locals.queue.admissionControlUrl,
          {
            name: data.name,
            location: data.location,
            topic: data.topic,
            askedBy: askerUser,
          },
          {
            // Don't allow receivers to keep requests open indefinitely
            timeout: 10000,
          }
        )
        questionAllowed = allowedResponse.data.allowed
        questionAllowedReason =
          allowedResponse.data.reason ||
          'No reason was given by the course admission control policy'
      } catch (e) {
        // TODO log or something?
        questionAllowed = false
        questionAllowedReason = 'Error querying admission control API'
      }

      if (!questionAllowed) {
        next(new ApiError(422, questionAllowedReason))
        return
      }
    }

    const question = await Question.create(
      {
        name: data.name,
        // Questions in fixed-location queues should never have a location
        location: res.locals.queue.fixedLocation ? '' : data.location,
        topic: data.topic,
        enqueueTime: new Date(),
        queueId,
        askedById: askerId,
      },
      {
        include: [{ model: User, as: 'askedBy' }],
      }
    )

    await question.reload()
    res.status(201).send(question)
  })
)

// Get all questions for a particular queue
router.get(
  '/',
  [requireQueue, failIfErrors],
  safeAsync(async (req, res, _next) => {
    const { id: queueId, courseId, isConfidential } = res.locals.queue
    const questionsResult = await Question.findAll({
      where: {
        queueId,
        dequeueTime: null,
      },
      order: [['id', 'ASC']],
    })

    // Convert questions to array of plain objects that we can filter and manipulate
    let questions = questionsResult.map(question =>
      question.get({ plain: true })
    )
    if (isConfidential) {
      const { userAuthz } = res.locals
      if (isUserStudent(userAuthz, courseId)) {
        const { id: userId } = res.locals.userAuthn
        questions = filterConfidentialQueueQuestionsForUser(userId, questions)
      }
    }

    res.send(questions)
  })
)

router.get(
  '/:questionId',
  [requireQuestion, requireQueueForQuestion, failIfErrors],
  (req, res, _next) => {
    const { courseId, isConfidential } = res.locals.queue
    if (isConfidential) {
      const { id: userId } = res.locals.userAuthn
      const { userAuthz } = res.locals
      if (isUserStudent(userAuthz, courseId)) {
        if (res.locals.question.askedById !== userId) {
          res.status(403).send('You are not authorized to access that question')
          return
        }
      }
    }
    res.send(res.locals.question)
  }
)

// Delete all questions for a particular queue
router.delete(
  '/',
  [requireQueue, requireCourseStaffForQueue, failIfErrors],
  safeAsync(async (req, res, _next) => {
    const { id: queueId } = res.locals.queue
    await Question.update(
      {
        dequeueTime: new Date(),
      },
      {
        where: {
          queueId,
          dequeueTime: null,
        },
      }
    )

    res.status(204).send()
  })
)

// Mark a question as being answered
router.post(
  '/:questionId/answering',
  [
    requireCourseStaffForQueueForQuestion,
    requireQuestion,
    requireQueueForQuestion,
    failIfErrors,
  ],
  safeAsync(async (req, res, next) => {
    const { queue, question } = res.locals

    if (question.beingAnswered) {
      // Forbid someone else from taking over this question
      next(new ApiError(403, 'Another user is already answering this question'))
      return
    }

    // Verify that this user isn't currently answering another question
    const otherQuestions = await Question.findOne({
      where: {
        answeredById: res.locals.userAuthn.id,
        dequeueTime: null,
        queueId: queue.id,
      },
    })

    if (otherQuestions !== null) {
      next(
        new ApiError(
          403,
          'You are already answering another question on this queue'
        )
      )
      return
    }

    modifyBeingAnswered(question, true)
    question.answeredById = res.locals.userAuthn.id
    await question.save()
    await question.reload()

    const questionData = question.toJSON()
    // This is a workaround to https://github.com/sequelize/sequelize/issues/10552
    // TODO remove this once the issue is fixed in sequelize
    if (questionData.beingAnswered) {
      const { answeredBy } = questionData
      answeredBy.name = answeredBy.preferredName || answeredBy.universityName
      questionData.answeredBy = answeredBy
    }
    res.send(questionData)
  })
)

// Mark a question as no longer being answered
router.delete(
  '/:questionId/answering',
  [requireCourseStaffForQueueForQuestion, requireQuestion, failIfErrors],
  safeAsync(async (req, res, _next) => {
    const { question } = res.locals
    modifyBeingAnswered(question, false)
    question.answeredById = null
    await question.save()
    res.send(question)
  })
)

// Mark the question as answered
router.post(
  '/:questionId/answered',
  [
    requireCourseStaffForQueueForQuestion,
    requireQuestion,
    check('preparedness').isIn(['bad', 'average', 'good']),
    check('comments')
      .optional({ nullable: true })
      .trim(),
    failIfErrors,
  ],
  safeAsync(async (req, res, _next) => {
    const data = matchedData(req)

    // Temporary, easy fix to avoid having to rename enums
    // TODO Fix this garbage
    let mappedPreparedness = data.preparedness
    switch (data.preparedness) {
      case 'bad':
        mappedPreparedness = 'not'
        break
      case 'good':
        mappedPreparedness = 'well'
        break
      default:
        break
    }

    const { question } = res.locals
    question.answerFinishTime = new Date()
    question.dequeueTime = new Date()
    question.preparedness = mappedPreparedness
    question.comments = data.comments
    question.answeredById = res.locals.userAuthn.id

    const updatedQuestion = await question.save()
    res.send(updatedQuestion)
  })
)

// Updates a question's information
router.patch(
  '/:questionId',
  [
    requireQuestion,
    requireQueueForQuestion,
    check('topic')
      .isLength({ min: 1, max: constants.QUESTION_TOPIC_MAX_LENGTH })
      .trim(),
    checkLocation,
    failIfErrors,
  ],
  safeAsync(async (req, res, next) => {
    const { userAuthn, question, queue } = res.locals
    const data = matchedData(req)

    if (question.askedById === userAuthn.id) {
      await question.update({
        location: queue.fixedLocation ? '' : data.location,
        topic: data.topic,
      })
      res.status(201).send(question)
    } else {
      next(
        new ApiError(
          403,
          "You don't have authorization to update this question"
        )
      )
    }
  })
)

// Deletes a question from a queue, without marking
// it as answered; can only be done by the person
// asking the question or course staff
router.delete(
  '/:questionId',
  [requireQuestion, failIfErrors],
  safeAsync(async (req, res, next) => {
    const { userAuthn, userAuthz, question } = res.locals
    const { queueId } = question

    const course = await Course.findOne({
      attributes: ['id'],
      include: [
        {
          model: Queue,
          attributes: [],
          where: { id: queueId },
        },
      ],
      raw: true,
    })

    if (
      question.askedById === userAuthn.id ||
      userAuthz.staffedCourseIds.includes(course.id)
    ) {
      await question.update({
        dequeueTime: new Date(),
      })
      res.status(204).send()
    } else {
      next(
        new ApiError(
          403,
          "You don't have authorization to delete this question"
        )
      )
    }
  })
)

module.exports = router

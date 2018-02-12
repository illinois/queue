const router = require('express').Router({
  mergeParams: true,
})

const { check } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')

const { Course, Queue, Question } = require('../models/')
const { requireQueue, requireQuestion, failIfErrors } = require('./util')
const requireCourseStaffForQueue = require('../middleware/requireCourseStaffForQueue')


async function modifyBeingAnswered(questionId, answering) {
  const question = await Question.findOne({ where: { id: questionId } })
  question.beingAnswered = answering
  if (answering) {
    question.answerStartTime = new Date()
  } else {
    question.answerEndTime = new Date()
  }

  return question.save()
}

// Adds a question to a queue
router.post('/', [
  requireQueue,
  check('name').isLength({ min: 1 }).trim(),
  check('location').isLength({ min: 1 }).trim(),
  check('topic').isLength({ min: 1 }).trim(),
  failIfErrors,
], (req, res, _next) => {
  const data = matchedData(req)
  const { id: queueId } = res.locals.queue

  const question = Question.build({
    name: data.name,
    location: data.location,
    topic: data.topic,
    enqueueTime: new Date(),
    queueId,
    askedById: res.locals.userAuthn.id,
  })

  question.save().then((newQuestion) => {
    res.status(201).send(newQuestion)
  })
})

// Get all questions for a particular queue
router.get('/', [
  requireQueue,
  failIfErrors,
], async (req, res, _next) => {
  const { id: queueId } = res.locals.queue
  const questions = await Question.findAll({
    where: {
      queueId,
      dequeueTime: null,
    },
    order: [
      ['id', 'ASC'],
    ],
  })
  res.send(questions)
})

router.get('/:questionId', [
  requireQuestion,
  failIfErrors,
], (req, res, _next) => {
  res.send(res.locals.question)
})


// Mark a question as being answered
router.post('/:questionId/answering', [
  requireCourseStaffForQueue,
  requireQuestion,
  failIfErrors,
], async (req, res, _next) => {
  const { id: questionId } = res.locals.question
  const question = await modifyBeingAnswered(questionId, true)
  res.send(question)
})


// Mark a question as no longer being answered
router.delete('/:questionId/answering', [
  requireCourseStaffForQueue,
  requireQuestion,
  failIfErrors,
], async (req, res, _next) => {
  const { id: questionId } = res.locals.question
  const question = await modifyBeingAnswered(questionId, false)
  res.send(question)
})


// Mark the question as answered
router.post('/:questionId/answered', [
  requireCourseStaffForQueue,
  requireQuestion,
  check('preparedness').isIn(['bad', 'average', 'well']),
  check('comments').optional({ nullable: true }).trim(),
  failIfErrors,
], async (req, res, _next) => {
  const data = matchedData(req)

  const { question } = res.locals
  question.answerFinishTime = new Date()
  question.dequeueTime = new Date()
  question.preparedness = data.preparedness
  question.comments = data.comments
  question.answeredById = res.locals.user.id

  const updatedQuestion = await question.save()
  res.send(updatedQuestion)
})


// Deletes a question from a queue, without marking
// it as answered; can only be done by the person
// asking the question or course staff
router.delete('/:questionId', [
  requireQuestion,
  failIfErrors,
], async (req, res, _next) => {
  const { userAuthn, userAuthz, question } = res.locals
  const { queueId } = question

  const course = await Course.findOne({
    attributes: ['id'],
    include: [{
      model: Queue,
      attributes: [],
      where: { id: queueId },
    }],
    raw: true,
  })

  if (question.askedById === userAuthn.id || userAuthz.staffedCourseIds.indexOf(course.id) !== -1) {
    await question.update({
      dequeueTime: new Date(),
      deletedAt: new Date(),
    })
    res.status(204).send()
  } else {
    res.status(403).send()
  }
})

module.exports = router

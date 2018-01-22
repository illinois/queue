const router = require('express').Router({
  mergeParams: true,
})

const { check } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const jsonpatch = require('json-patch')

const { Question } = require('../models/')
const { requireQueue, requireQuestion, failIfErrors } = require('./util')


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

  const question = Question.build({
    name: data.name,
    location: data.location,
    topic: data.topic,
    enqueueTime: new Date(),
    queueId: data.queueId,
    askedById: req.session.user.id,
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
  const data = matchedData(req)
  const questions = await Question.findAll({ where: { id: data.queueId } })
  res.send(questions)
})


// Update a particular question
router.patch('/:questionId', [
  requireQuestion,
  failIfErrors,
], async (req, res, _next) => {
  const { question } = req
  await jsonpatch.apply(question, req.body).save()
  res.status(204).send()
})


// Mark a question as being answered
router.post('/:questionId/answering', [
  requireQuestion,
  failIfErrors,
], async (req, res, _next) => {
  const { questionId } = matchedData(req)
  const question = await modifyBeingAnswered(questionId, true)
  res.send(question)
})


// Mark a question as no longer being answered
router.delete('/:questionId/answering', [
  requireQuestion,
  failIfErrors,
], async (req, res, _next) => {
  const { questionId } = matchedData(req)
  const question = await modifyBeingAnswered(questionId, true)
  res.send(question)
})


// Mark the question as answered
router.post('/:questionId/answered', [
  requireQuestion,
  failIfErrors,
], async (req, res, _next) => {
  const { question } = req
  question.answerFinishTime = new Date()
  question.dequeueTime = new Date()
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
  const { question } = req
  await question.destroy()
  res.status(202).send()
})

module.exports = router

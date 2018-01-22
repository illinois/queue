const router = require('express').Router({
  mergeParams: true,
})

const { check } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')

const { Question } = require('../models/')
const { validateQueue, failIfErrors } = require('./util')


function modifyBeingAnsering(questionId, answering) {
  return Question.findOne({
    where: {
      id: questionId,
    }
  }).then((question) => {
    question.beingAnswered = answering;
    if (answering) { question.answerStartTime = new Date(); }

    return question.save();
  });
}

// Adds a question to a queue
router.post('/', [
  validateQueue,
  check('name').isLength({ min: 1 }).trim(),
  check('location').isLength({ min: 1 }).trim(),
  check('topic').isLength({ min: 1 }).trim(),
  failIfErrors,
], (req, res, next) => {
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
  validateQueue,
  failIfErrors,
], (req, res, next) => {
  const data = matchedData(req)

  Question.findAll({
    where: { id: data.queueId },
  }).then(questions => res.send(questions))
})

//
// Mark a question as being answered
//
router.post("/:questionId/answering", function (req, res, next) {
  // TODO: Require courseStaff
  var questionId = validator.toInt(questionId);

  modifyBeingAnsering(questionId, true).then(() => {
    res.send({ success: true, resultText: "Being Answered" })
  });
});

//
// Mark a question as no longer being answered
//
router.delete("/:questionId/answering", function (req, res, next) {
  // TODO: Require courseStaff
  var questionId = validator.toInt(questionId);

  modifyBeingAnsering(questionId, false).then(() => {
    res.send({ success: true, resultText: "No Longer Being Answered" })
  });
});





//
// Mark the question as answered
//
router.post("/:questionId/answered", (req, res, next) => {
  Question.findOne({
    where: {
      id: questionId,
    }
  }).then(function (question) {
    question.answerFinishTime = new Date();
    question.dequeueTime = new Date();
    return question.destroy();
  }).then(function () {
    res.send({ success: true, resultText: "Question Answered" })
  });
});






//
// Deletes a question from a queue, without marking
// it as answered; can only be done by the person
// asking the question or course staff
//
router.delete("/:questionId", (req, res, next) => {
  var questionId = validator.toInt(questionId);
  // TODO: Course staff

  Question.findOne({
    where: {
      id: questionId,
      inlclude: [
        { model: User, as: "askedBy", where: { id: user.session.id } }
      ]
    }
  }).then(function (question) {
    question.dequeueTime = new Date();
    return question.destroy();
  }).then(function () {
    res.send({ success: true, resultText: "Question Deleted" })
  });
});

module.exports = router;

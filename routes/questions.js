var express = require('express');
var router = express.Router();
var validator = require("validator");

var models = require("../models/");



function modifyBeingAnsering(questionId, answering) {
  return models.Question.findOne({
    where: {
      id: questionId,
    }
  }).then(function (question) {
    question.beingAnswered = answering;
    if (answering) { question.answerStartTime = new Date(); }

    return question.save();
  });
}

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
router.post("/:questionId/answered", function (req, res, next) {
  models.Question.findOne({
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
router.delete("/:questionId", function (req, res, next) {
  var questionId = validator.toInt(questionId);
  // TODO: Course staff

  models.Question.findOne({
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

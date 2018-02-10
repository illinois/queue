const { check } = require('express-validator/check')
const { validationResult } = require('express-validator/check')

const {
  Course,
  Queue,
  Question,
  User,
} = require('../models')

const requireModel = (model, modelName) => (requestId, { req }) =>
  model.findOne({ where: { id: requestId } }).then((entity) => {
    if (entity === null) {
      throw new Error(`${modelName} with ID ${requestId} does not exist`)
    }
    req[modelName] = entity
    return true
  })

module.exports = {
  failIfErrors(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.mapped() })
      next('route')
      return
    }
    next()
  },

  requireCourse: check('courseId').toInt().custom(requireModel(Course, 'course')),
  requireQueue: check('queueId').toInt().custom(requireModel(Queue, 'queue')),
  requireQuestion: check('questionId').toInt().custom(requireModel(Question, 'question')),
  requireUser: check('userId').toInt().custom(requireModel(User, 'user')),
}

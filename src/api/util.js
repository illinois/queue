const { validationResult } = require('express-validator/check')

const { Course, Queue, Question, User } = require('../models')

const findPropertyInRequest = (req, property) => {
  const locations = ['params', 'body']
  const location = locations.find(loc => req[loc][property] !== undefined)
  return location !== undefined ? req[location][property] : null
}

const requireModel = (model, modelName, propertyName) => async (
  req,
  res,
  next
) => {
  const rawModelId = findPropertyInRequest(req, propertyName)
  if (rawModelId) {
    const parsedModelId = Number.parseInt(rawModelId, 10)
    if (!Number.isNaN(parsedModelId)) {
      const entity = await model.findOne({ where: { id: parsedModelId } })
      if (entity === null) {
        res
          .status(404)
          .send(`${modelName} with ID ${parsedModelId} does not exist`)
      } else {
        res.locals[modelName] = entity
        next()
      }
    } else {
      res.status(400).send(`${rawModelId} could not be parsed as an id`)
    }
  } else {
    res.status(422).send(`${propertyName} was not present in the request`)
  }
}

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

  requireCourse: requireModel(Course, 'course', 'courseId'),
  requireQueue: requireModel(Queue, 'queue', 'queueId'),
  requireQuestion: requireModel(Question, 'question', 'questionId'),
  requireUser: requireModel(User, 'user', 'userId'),

  // These have to be exported for testing
  findPropertyInRequest,
  requireModel,
}

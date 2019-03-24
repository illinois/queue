const { validationResult } = require('express-validator/check')

const { Course, Queue, Question, User } = require('../models')

class ApiError extends Error {
  constructor(httpStatusCode, message) {
    super(message)
    this.httpStatusCode = httpStatusCode
  }
}

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
  if (!rawModelId) {
    next(new ApiError(422, `${propertyName} was not present in the request`))
    return
  }
  const parsedModelId = Number.parseInt(rawModelId, 10)
  if (Number.isNaN(parsedModelId)) {
    next(new ApiError(400, `${rawModelId} could not be parsed as an id`))
    return
  }
  const entity = await model.findOne({ where: { id: parsedModelId } })
  if (entity === null) {
    next(
      new ApiError(404, `${modelName} with ID ${parsedModelId} does not exist`)
    )
    return
  }
  res.locals[modelName] = entity
  next()
}

const requireModelForModel = (
  model,
  modelName,
  forModelName,
  forPropertyName
) => async (req, res, next) => {
  if (!(forModelName in res.locals)) {
    res.status(500).send(`${forModelName} was not in locals`)
    return
  }
  if (!(forPropertyName in res.locals[forModelName])) {
    res.status(500).send(`${forPropertyName} was not in ${forModelName}`)
    return
  }
  const id = res.locals[forModelName][forPropertyName]
  const entity = await model.findOne({ where: { id } })
  if (entity === null) {
    next(new ApiError(404, `${modelName} with ID ${id} does not exist`))
    return
  }
  res.locals[modelName] = entity
  next()
}

const isUserStudent = (userAuthz, courseId) => {
  const { isAdmin, staffedCourseIds } = userAuthz
  const staffsQueue = staffedCourseIds.findIndex(id => id === courseId) !== -1
  return !isAdmin && !staffsQueue
}

/**
 * Removes any sensitive user information from all questions not asked by the
 * user making this request.
 *
 * @param {Response} res The response containing user info on res.locals
 * @param {Questions[]} questions The list of questions to remove sensitive info from
 */
const filterConfidentialQueueQuestionsForUser = (userId, questions) => {
  return questions.map(question => {
    if (question.askedById === userId) {
      return question
    }
    return { id: question.id }
  })
}

module.exports = {
  ApiError,
  failIfErrors(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.mapped() })
      return
    }
    next()
  },

  requireCourse: requireModel(Course, 'course', 'courseId'),
  requireQueue: requireModel(Queue, 'queue', 'queueId'),
  requireQueueForQuestion: requireModelForModel(
    Queue,
    'queue',
    'question',
    'queueId'
  ),
  requireQuestion: requireModel(Question, 'question', 'questionId'),
  requireUser: requireModel(User, 'user', 'userId'),

  // These have to be exported for testing
  findPropertyInRequest,
  requireModel,

  // Stuff for confidential queues
  isUserStudent,
  filterConfidentialQueueQuestionsForUser,
}

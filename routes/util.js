const { check } = require('express-validator/check')
const { validationResult } = require('express-validator/check')

const {
  Course,
  Queue,
} = require('../models')

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

  validateCourse: check('courseId').custom((courseId) => {
    return Course.findOne({
      where: {
        id: courseId,
      },
    }).then((course) => {
      if (course === null) {
        throw new Error(`course ${courseId} does not exist`)
      }
      return true
    })
  }),

  validateQueue: check('queueId').custom((queueId) => {
    return Queue.findOne({
      where: {
        id: queueId,
      },
    }).then((queue) => {
      if (queue === null) {
        throw new Error(`queue ${queueId} does not exist`)
      }
      return true
    })
  }),
}

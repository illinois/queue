const { Course, Queue, Question } = require('../models')
const { ApiError } = require('../api/util')

module.exports = async (req, res, next) => {
  if (!req.params.questionId) {
    next(new ApiError(400, 'Invalid question ID'))
    return
  }

  const questionId = Number.parseInt(req.params.questionId, 10)
  if (Number.isNaN(questionId)) {
    next(new ApiError(400, 'Invalid question ID'))
    return
  }

  const question = await Question.findByPk(questionId)
  if (!question) {
    next(new ApiError(404, 'Question does not exist'))
    return
  }

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

  if (!course) {
    next(new ApiError(404, 'Course does not exist'))
  } else if (res.locals.userAuthz.isAdmin) {
    // Admins can do anything course staff can!
    next()
  } else if (res.locals.userAuthz.staffedCourseIds.indexOf(course.id) === -1) {
    next(new ApiError(403, "You don't have authorization to do that"))
  } else {
    next()
  }
}

const { Course, Queue, Question } = require('../models')

module.exports = async (req, res, next) => {
  if (!req.params.questionId) {
    res.status(500).send()
  } else {
    const questionId = Number.parseInt(req.params.questionId, 10)
    if (Number.isNaN(questionId)) {
      res.status(500).send()
      return
    }

    const question = await Question.findById(questionId)
    if (!question) {
      res.status(404).send()
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
      res.status(404).send()
    } else if (res.locals.userAuthz.isAdmin) {
      // Admins can do anything course staff can!
      next()
    } else if (
      res.locals.userAuthz.staffedCourseIds.indexOf(course.id) === -1
    ) {
      res.status(403).send()
    } else {
      next()
    }
  }
}

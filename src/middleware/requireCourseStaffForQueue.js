const { Course, Queue } = require('../models')
const { ApiError } = require('../api/util')

module.exports = async (req, res, next) => {
  if (res.locals.userAuthz.isAdmin) {
    // Admins can do anything course staff can!
    next()
    return
  }

  if (!req.params.queueId) {
    next(new ApiError(400, 'Invalid queue ID'))
    return
  }

  const queueId = Number.parseInt(req.params.queueId, 10)
  if (Number.isNaN(queueId)) {
    next(new ApiError(400, 'Invalid queue ID'))
    return
  }

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
    // Let's 404?
    next(new ApiError(404, 'Course does not exist'))
  } else if (res.locals.userAuthz.isAdmin) {
    next()
  } else if (res.locals.userAuthz.staffedCourseIds.indexOf(course.id) === -1) {
    next(new ApiError(403, "You don't have authorization to do that"))
  } else {
    next()
  }
}

const { ApiError } = require('../api/util')

module.exports = (req, res, next) => {
  if (!req.params.courseId) {
    // Missing courseId in request
    next(new ApiError(400, 'Invalid course ID'))
  } else if (res.locals.userAuthz.isAdmin) {
    // Admins can do anything!
    next()
  } else {
    const courseId = Number.parseInt(req.params.courseId, 10)
    if (Number.isNaN(courseId)) {
      next(new ApiError(400, 'Invalid course ID'))
    } else if (res.locals.userAuthz.staffedCourseIds.indexOf(courseId) === -1) {
      next(new ApiError(403, "You don't have authorization to do that"))
    } else {
      next()
    }
  }
}

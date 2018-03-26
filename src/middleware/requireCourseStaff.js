module.exports = (req, res, next) => {
  if (!req.params.courseId) {
    // Missing courseId in request
    res.status(500).send()
  } else if (res.locals.userAuthz.isAdmin) {
    // Admins can do anything!
    next()
  } else {
    const courseId = Number.parseInt(req.params.courseId, 10)
    if (Number.isNaN(courseId)) {
      res.status(500).send()
    } else if (res.locals.userAuthz.staffedCourseIds.indexOf(courseId) === -1) {
      res.status(403).send()
    } else {
      next()
    }
  }
}

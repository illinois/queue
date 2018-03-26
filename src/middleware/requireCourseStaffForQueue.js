const { Course, Queue } = require('../models')

module.exports = async (req, res, next) => {
  if (res.locals.userAuthz.isAdmin) {
    // Admins can do anything course staff can!
    next()
  } else if (!req.params.queueId) {
    res.status(500).send()
  } else {
    const queueId = Number.parseInt(req.params.queueId, 10)
    if (Number.isNaN(queueId)) {
      res.status(500).send()
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
      res.status(404).send()
    } else if (res.locals.userAuthz.isAdmin) {
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

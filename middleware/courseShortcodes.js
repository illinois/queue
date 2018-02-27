const { baseUrl } = require('../util')
const { Course, Queue } = require('../models')

module.exports = async (req, res, next) => {
  const { courseCode: shortcode } = req.params
  const course = await Course.findOne({
    where: {
      shortcode,
    },
  })
  if (!course) {
    next()
    return
  }

  // Find the most recent open queue for this course
  const queue = await Queue.findAll({
    where: {
      courseId: course.id,
    },
    order: [
      ['id', 'DESC'],
    ],
  })

  if (queue.length === 1) {
    res.redirect(`${baseUrl}/queue/${queue[0].id}`)
  } else {
    res.redirect(`${baseUrl}/course/${course.id}`)
  }
}

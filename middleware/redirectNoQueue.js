const { baseUrl } = require('../util')
const { Queue } = require('../models')

module.exports = async (req, res, next) => {
  const { queueId: qid } = req.params
  const firstQueue = await Queue.findOne({
    where: {
      id: qid,
    },
    paranoid: false,
  })

  // Cannot Find Queue In Deleted or Non Deleted
  if (!firstQueue) {
    res.redirect(`${baseUrl}/`)
  }

  // Deleted Queue
  if (firstQueue.dataValues.deletedAt) {
    // Find the most recent open queue for this course
    const sameCourseQueues = await Queue.findAll({
      where: {
        courseId: firstQueue.dataValues.courseId,
      },
    })

    // Redirect to Queue from the same Course
    if (sameCourseQueues.length === 1) {
      res.redirect(`${baseUrl}/queue/${sameCourseQueues[0].id}`)
    } else {
      // Redirect to the Course the Queue was fron
      res.redirect(`${baseUrl}/course/${firstQueue.dataValues.courseId}`)
    }
  } else {
    next()
  }
}

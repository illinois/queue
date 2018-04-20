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
    return
  }

  // Deleted Queue
  if (firstQueue.deletedAt) {
    // Find the most recent open queue for this course
    const sameCourseQueues = await Queue.findAll({
      where: {
        courseId: firstQueue.courseId,
      },
    })

    // Redirect to Queue from the same Course
    if (sameCourseQueues.length === 1) {
      res.redirect(`${baseUrl}/queue/${sameCourseQueues[0].id}`)
    } else {
      // Redirect to the Course the Queue was fron
      res.redirect(`${baseUrl}/course/${firstQueue.courseId}`)
    }
    return
  }
  next()
}

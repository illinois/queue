const { baseUrl } = require('../util')
const { Course, Queue } = require('../models')

module.exports = async (req, res, next) => {
  const { queueId: qid } = req.params
  const firstQueue = await Queue.findOne({
    where: {
      id: qid
    },
    paranoid: false
  })
  console.log(firstQueue)
  
  //Cannot Find Queue In Deleted or Non Deleted
  if(!firstQueue){
    res.redirect(`${baseUrl}/`)
  }

  //Deleted Queue
  if (firstQueue.dataValues.deletedAt) {
    // Find the most recent open queue for this course
    const sameCourseQueues = await Queue.findAll({
      where: {
        courseId: firstQueue.dataValues.courseId,
      },
      order: [['id', 'DESC']],
    })

    if (sameCourseQueues.length === 1) {
      console.log("TO SAME COURSE QUEUE")
      res.redirect(`${baseUrl}/queue/${sameCourseQueues[0].id}`)
    } else {
      console.log("TO THE COURSE")
      res.redirect(`${baseUrl}/course/${firstQueue.dataValues.courseId}`)
    }
  }
  else {
    next()
  }
}
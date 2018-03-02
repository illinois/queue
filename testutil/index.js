const models = require('../models')

module.exports.resetDb = async () => {
  const promises = []
  Object.keys(models.models).forEach((key) => {
    promises.push(models.models[key].destroy({
      truncate: true,
      force: true,
      cascade: true,
    }))
  })
  await Promise.all(promises)
  await models.sequelize.query("DELETE FROM sqlite_sequence")
}

module.exports.resetAndPopulateDb = async () => {
  await module.exports.resetDb()
  await module.exports.populateDb()
}

module.exports.createDb = async () => {
  await models.sequelize.sync({ force: true })
}

module.exports.destroyDb = async () => {
  await models.sequelize.drop()
}

module.exports.createTestUsers = async () => {
  await models.User.bulkCreate([
    { netid: 'dev', isAdmin: true },
    { netid: 'admin', isAdmin: true },
    { netid: '225staff', isAdmin: false },
    { netid: '241staff', isAdmin: false },
    { netid: 'student', isAdmin: false },
    { netid: 'otherstudent', isAdmin: false },
  ])
}

module.exports.createTestCourses = async () => {
  await models.Course.bulkCreate([{ name: 'CS225' }, { name: 'CS241' }])
}

module.exports.createTestQueues = async () => {
  await models.Queue.bulkCreate([
    { name: 'CS225 Queue', location: 'Here', courseId: 1 },
    { name: 'CS241 Queue', location: 'There', courseId: 2 },
  ])
}

module.exports.createTestQuestions = async () => {
  await models.Question.bulkCreate([
    {
      queueId: 1,
      name: 'Nathan',
      location: 'Siebel',
      topic: 'Queue',
      askedById: 2,
    },
    {
      queueId: 1,
      name: 'Jordi',
      location: 'ECEB',
      topic: 'Canada',
      askedById: 5,
    },
  ])
}

module.exports.populateDb = async () => {
  await module.exports.createTestUsers()
  await module.exports.createTestCourses()

  const staff225 = await models.User.findOne({ where: { netid: '225staff' } })
  await staff225.addStaffAssignment(1)

  const staff241 = await models.User.findOne({ where: { netid: '241staff' } })
  await staff241.addStaffAssignment(2)

  await module.exports.createTestQueues()
  await module.exports.createTestQuestions()
}

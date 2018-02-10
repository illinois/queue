const models = require('../models')

module.exports.setupTestDb = async () => {
  await models.sequelize.sync()
}

module.exports.destroyTestDb = async () => {
  await models.sequelize.drop()
}

module.exports.clearTestDbTables = async () => {
  const deletionTasks = []
  Object.keys(models.models).forEach(async (model) => {
    deletionTasks.push(models[model].destroy({
      where: {},
      truncate: false,
    }))
  })
  await Promise.all(deletionTasks)
}

module.exports.createTestUsers = async () => {
  await models.User.bulkCreate([
    { netid: 'admin', isAdmin: true },
    { netid: '225staff', isAdmin: false },
    { netid: '241staff', isAdmin: false },
    { netid: 'student', isAdmin: false },
  ])
}

module.exports.createTestCourses = async () => {
  await models.Course.bulkCreate([
    { name: 'CS225' },
    { name: 'CS241' },
  ])
}

module.exports.createTestQueues = async () => {
  await models.Queue.bulkCreate([
    { name: 'CS225 Queue', location: 'Here', courseId: 1 },
    { name: 'CS241 Queue', location: 'There', courseId: 2 },
  ])
}

module.exports.populateTestDb = async () => {
  await module.exports.createTestUsers()
  await module.exports.createTestCourses()

  const staff225 = await models.User.findOne({ where: { netid: '225staff' } })
  await staff225.addStaffAssignment(1)

  const staff241 = await models.User.findOne({ where: { netid: '241staff' } })
  await staff241.addStaffAssignment(2)

  await module.exports.createTestQueues()
}

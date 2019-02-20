const session = require('supertest-session')
const models = require('../src/models')

module.exports.setupTestDb = async () => {
  await models.sequelize.sync()
}

module.exports.destroyTestDb = async () => {
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
    {
      name: 'CS225 Fixed Location',
      fixedLocation: true,
      location: 'Everywhere',
      courseId: 1,
    },
    {
      name: 'CS225 Closed',
      open: false,
      location: 'Everywhere',
      courseId: 1,
    },
    {
      name: 'CS225 Confidential Queue',
      fixedLocation: false,
      location: 'Everywhere',
      isConfidential: true,
      messageEnabled: true,
      courseId: 1,
    },
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
    {
      queueId: 3,
      name: 'Arman',
      location: '',
      topic: 'Sauce',
      askedById: 2,
    },
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
  await module.exports.createTestQuestions()
}

module.exports.requestAsUser = async (app, user) => {
  const testSession = session(app)
  await testSession.post('/login/dev').send({ netid: user })
  return testSession
}

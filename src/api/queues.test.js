/* eslint-env jest */
const app = require('../app')
const testutil = require('../test/util')
const { requestAsUser } = require('../test/util')

beforeEach(async () => {
  await testutil.setupTestDb()
  await testutil.populateTestDb()
})

afterEach(() => testutil.destroyTestDb())

const expectErrorMessage = res => {
  expect(Object.keys(res.body)).toEqual(['message'])
}

const includesPrivateAttributes = queue => {
  expect(queue.admissionControlEnabled).toBeDefined()
  expect(queue.admissionControlUrl).toBeDefined()
}

const excludesPrivateAttributes = queue => {
  expect(queue.admissionControlEnabled).toBeUndefined()
  expect(queue.admissionControlUrl).toBeUndefined()
}

describe('Queues API', () => {
  describe('GET /api/queues', () => {
    const doGetTest = async user => {
      const request = await requestAsUser(app, user)
      const res = await request.get(`/api/queues`)
      expect(res.statusCode).toBe(200)
      expect(res.body.length).toEqual(5)
      expect(res.body[0].name).toBe('CS225 Queue')
      expect(res.body[1].name).toBe('CS241 Queue')
      expect(res.body[0].location).toBe('Here')
      expect(res.body[1].location).toBe('There')
      expect(res.body[0].id).toBe(1)
      expect(res.body[1].id).toBe(2)

      res.body.forEach(queue => {
        // This endpoint shouldn't include private attributes
        excludesPrivateAttributes(queue)
      })
    }
    test('succeeds for admin', async () => {
      await doGetTest('admin@illinois.edu')
    })
    test('succeeds for non admin', async () => {
      await doGetTest('student@illinois.edu')
    })
  })

  describe('GET /api/queues/2', () => {
    const testForUser = async (username, isAdmin) => {
      const request = await requestAsUser(app, username)
      const staffRequest = await requestAsUser(app, '241staff@illinois.edu')
      const res = await request.get('/api/queues/2')
      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBe(2)
      expect(res.body.name).toBe('CS241 Queue')
      expect(res.body.location).toBe('There')
      expect(res.body.courseId).toBe(2)
      expect(res.body).toHaveProperty('questions')
      expect(res.body.questions).toHaveLength(0)
      expect(res.body).toHaveProperty('activeStaff')
      expect(res.body.activeStaff).toHaveLength(0)
      if (isAdmin) {
        includesPrivateAttributes(res.body)
      } else {
        excludesPrivateAttributes(res.body)
      }

      // Have 241 staff member join the queue staff
      const res2 = await staffRequest.post('/api/queues/2/staff/3')
      const activeStaffId = res2.body.id

      // Add a question
      const question = { name: 'a', location: 'b', topic: 'c' }
      const res3 = await request.post('/api/queues/2/questions').send(question)
      expect(res3.body.askedBy.uid).toBe(username)
      const questionId = res3.body.id

      // Answer the question
      const res4 = await staffRequest.post(
        `/api/queues/2/questions/${questionId}/answering`
      )
      expect(res4.body.answeredBy.name).toBe('241 Staff')

      const res5 = await request.get('/api/queues/2')
      expect(res5.body).toHaveProperty('questions')
      expect(res5.body.questions).toHaveLength(1)
      expect(res5.body.questions[0]).toHaveProperty('askedBy')
      expect(res5.body.questions[0].askedBy.uid).toBe(username)
      expect(res5.body.questions[0]).toHaveProperty('answeredBy')
      expect(res5.body.questions[0].answeredBy.name).toBe('241 Staff')
      expect(res5.body.questions[0].location).toBe('b')
      expect(res5.body.questions[0].topic).toBe('c')
      expect(res5.body).toHaveProperty('activeStaff')
      expect(res5.body.activeStaff).toHaveLength(1)
      expect(res5.body.activeStaff[0]).toHaveProperty('id')
      expect(res5.body.activeStaff[0].id).toEqual(activeStaffId)
      expect(res5.body.activeStaff[0].user.uid).toEqual('241staff@illinois.edu')
      expect(res5.body.activeStaff[0].user.name).toEqual('241 Staff')
      if (isAdmin) {
        includesPrivateAttributes(res5.body)
      } else {
        excludesPrivateAttributes(res5.body)
      }
    }

    test('succeeds for admin', async () => {
      await testForUser('admin@illinois.edu', true)
    })

    test('succeeds for student', async () => {
      await testForUser('student@illinois.edu', false)
    })
  })

  describe('GET /api/queues/5 (confidential queue)', () => {
    const includesDataForUser = async user => {
      const request = await requestAsUser(app, user)
      const res = await request.get('/api/queues/5')

      expect(Array.isArray(res.body.questions)).toBeTruthy()
      expect(res.body.questions).toHaveLength(2)
      const [question1, question2] = res.body.questions
      expect(question1).toHaveProperty('askedById', 5)
      expect(question1).toHaveProperty('askedBy.uid', 'student@illinois.edu')
      expect(question2).toHaveProperty('askedById', 6)
      expect(question2).toHaveProperty(
        'askedBy.uid',
        'otherstudent@illinois.edu'
      )
      includesPrivateAttributes(res.body)
    }

    test('includes all question data for admin', async () => {
      await includesDataForUser('admin@illinois.edu')
    })

    test('includes all question data for course staff', async () => {
      await includesDataForUser('225staff@illinois.edu')
    })

    const excludesDataForUser = async user => {
      const request = await requestAsUser(app, user)
      const res = await request.get('/api/queues/5')

      // We expect all questions not asked by 'student' (user 5) to have no
      // information besides question ID
      expect(Array.isArray(res.body.questions)).toBeTruthy()
      expect(res.body.questions).toHaveLength(2)
      res.body.questions.forEach(question => {
        if (Object.keys(question).length > 1) {
          expect(question.askedById).toEqual(5)
        } else {
          expect(Object.keys(question)).toEqual(['id'])
        }
      })
      excludesPrivateAttributes(res.body)
    }

    test('excludes question data for other course staff on confidential queue', async () => {
      await excludesDataForUser('241staff@illinois.edu')
    })

    test('excludes question data for students on confidential queue', async () => {
      await excludesDataForUser('student@illinois.eduk')
    })
  })

  describe('GET /api/queues/2/staff', () => {
    test('succeeds for admin', async () => {
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.get('/api/queues/2/staff')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveLength(0)
    })
  })

  describe('POST /api/queues', () => {
    test('succeeds for admin', async () => {
      const queue = {
        name: 'CS225 Queue 2',
        location: 'Where',
        isConfidential: false,
      }
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.post('/api/courses/1/queues').send(queue)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('CS225 Queue 2')
      expect(res.body.location).toBe('Where')
      expect(res.body.questionCount).toBe(0)
      expect(res.body.isConfidential).toBe(false)
      expect(res.body.admissionControlEnabled).toBe(false)
      expect(res.body.admissionControlUrl).toBe(null)
    })

    test('succeeds for course staff', async () => {
      const queue = {
        name: 'CS225 Queue 2',
        location: 'Where',
        isConfidential: false,
      }
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.post('/api/courses/1/queues').send(queue)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('CS225 Queue 2')
      expect(res.body.location).toBe('Where')
      expect(res.body.questionCount).toBe(0)
      expect(res.body.isConfidential).toBe(false)
      expect(res.body.admissionControlEnabled).toBe(false)
      expect(res.body.admissionControlUrl).toBe(null)
    })

    test('succeeds for confidential queue', async () => {
      const queue = {
        name: 'CS225 Confidential Queue',
        location: 'Where',
        isConfidential: true,
      }
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.post('/api/courses/1/queues').send(queue)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('CS225 Confidential Queue')
      expect(res.body.location).toBe('Where')
      expect(res.body.questionCount).toBe(0)
      expect(res.body.isConfidential).toBe(true)
      expect(res.body.admissionControlEnabled).toBe(false)
      expect(res.body.admissionControlUrl).toBe(null)
    })

    test('fails if name is missing', async () => {
      const queue = { location: 'Where', isConfidential: false }
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.post('/api/courses/1/queues').send(queue)
      expect(res.statusCode).toBe(422)
    })

    test('fails if location is missing and queue is fixed-location', async () => {
      const queue = {
        name: 'CS225 Queue 2',
        fixedLocation: true,
        isConfidential: false,
      }
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.post('/api/courses/1/queues').send(queue)
      expect(res.statusCode).toBe(422)
    })

    test('fails for student', async () => {
      const queue = {
        name: 'CS225 Queue 2',
        location: 'Where',
        isConfidential: false,
      }
      const request = await requestAsUser(app, 'student@illinois.edu')
      const res = await request.post('/api/courses/1/queues').send(queue)
      expect(res.statusCode).toBe(403)
      expectErrorMessage(res)
    })

    test('fails for course staff of different course', async () => {
      const queue = {
        name: 'CS225 Queue 2',
        location: 'Where',
        isConfidential: false,
      }
      const request = await requestAsUser(app, '241staff@illinois.edu')
      const res = await request.post('/api/courses/1/queues').send(queue)
      expect(res.statusCode).toBe(403)
      expectErrorMessage(res)
    })
  })

  describe('POST /api/queues/1/staff/:userId', () => {
    test('succeeds for course staff to add self', async () => {
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.post('/api/queues/1/staff/2')
      expect(res.statusCode).toBe(202)
      const request2 = await requestAsUser(app, 'admin@illinois.edu')
      const res2 = await request2.get('/api/queues/1/staff')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(1)
      expect(res2.body[0].user.uid).toBe('225staff@illinois.edu')
    })

    test('succeeds if user is already active course staff', async () => {
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.post('/api/queues/1/staff/2')
      expect(res.statusCode).toBe(202)
      const res2 = await request.post('/api/queues/1/staff/2')
      expect(res2.statusCode).toBe(202)
      const request2 = await requestAsUser(app, 'admin@illinois.edu')
      const res3 = await request2.get('/api/queues/1/staff')
      expect(res3.statusCode).toBe(200)
      expect(res3.body).toHaveLength(1)
      expect(res3.body[0].user.uid).toBe('225staff@illinois.edu')
    })

    test('succeeds for admin to add admin', async () => {
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.post('/api/courses/1/queues/1/staff/1')
      expect(res.statusCode).toBe(202)
      const res2 = await request.get('/api/queues/1/staff')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(1)
      expect(res2.body[0].user.uid).toBe('admin@illinois.edu')
    })

    test('fails for student to add student', async () => {
      const request = await requestAsUser(app, 'student@illinois.edu')
      const res = await request.post('/api/courses/1/queues/1/staff/4')
      expect(res.statusCode).toBe(403)
      expectErrorMessage(res)
      const request2 = await requestAsUser(app, 'admin@illinois.edu')
      const res2 = await request2.get('/api/queues/1/staff')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(0)
    })

    test('fails for student to add admin', async () => {
      const request = await requestAsUser(app, 'student@illinois.edu')
      const res = await request.post('/api/courses/1/queues/1/staff/1')
      expect(res.statusCode).toBe(403)
      expectErrorMessage(res)
      const res2 = await request.get('/api/queues/1/staff')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(0)
    })

    test('fails for course staff of different course', async () => {
      const request = await requestAsUser(app, '241staff@illinois.edu')
      const res = await request.post('/api/courses/1/queues/1/staff/3')
      expect(res.statusCode).toBe(403)
      expectErrorMessage(res)
      const res2 = await request.get('/api/queues/1/staff')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(0)
    })
  })

  describe('PATCH /api/queues/:queueId', () => {
    test('succeeds for course staff with well-formed request no location', async () => {
      const attributes = { name: 'CS 225 Queue 1 Alter', location: '' }
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('CS 225 Queue 1 Alter')
      expect(res.body.id).toBe(1)
      expect(res.body.location).toBe('')
      expect(res.body.admissionControlEnabled).toBe(false)
      expect(res.body.admissionControlUrl).toBe(null)
    })

    test('succeeds for course staff with well-formed request with location', async () => {
      const attributes = { name: 'CS 225 Queue 1 Alter', location: 'Where' }
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('CS 225 Queue 1 Alter')
      expect(res.body.id).toBe(1)
      expect(res.body.location).toBe('Where')
      expect(res.body.admissionControlEnabled).toBe(false)
      expect(res.body.admissionControlUrl).toBe(null)
    })

    test('succeeds for admin with well-formed request no location', async () => {
      const attributes = { name: 'CS 225 Queue 1 Alter', location: '' }
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('CS 225 Queue 1 Alter')
      expect(res.body.id).toBe(1)
      expect(res.body.location).toBe('')
      expect(res.body.admissionControlEnabled).toBe(false)
      expect(res.body.admissionControlUrl).toBe(null)
    })

    test('succeeds for admin with well-formed request with location', async () => {
      const attributes = { name: 'CS 225 Queue 1 Alter', location: 'Where' }
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('CS 225 Queue 1 Alter')
      expect(res.body.id).toBe(1)
      expect(res.body.location).toBe('Where')
      expect(res.body.admissionControlEnabled).toBe(false)
      expect(res.body.admissionControlUrl).toBe(null)
    })

    test('succeeds for course staff with well-formed request with admissionControlUrl', async () => {
      const attributes = { admissionControlUrl: 'http://localhost:3000' }
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('CS225 Queue')
      expect(res.body.id).toBe(1)
      expect(res.body.location).toBe('Here')
      expect(res.body.admissionControlEnabled).toBe(false)
      expect(res.body.admissionControlUrl).toBe('http://localhost:3000')
    })

    test('succeeds for course staff with well-formed request with admissionControlEnabled', async () => {
      const attributes = { admissionControlEnabled: true }
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('CS225 Queue')
      expect(res.body.id).toBe(1)
      expect(res.body.location).toBe('Here')
      expect(res.body.admissionControlEnabled).toBe(true)
      expect(res.body.admissionControlUrl).toBe(null)
    })

    test('fails for course staff with ill-formed request no location', async () => {
      const attributes = { name: '', location: '' }
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(422)
    })

    test('fails for course staff with ill-formed request with location', async () => {
      const attributes = { name: '', location: 'Where' }
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(422)
    })

    test('fails for admin with ill-formed request no location', async () => {
      const attributes = { name: '', location: '' }
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(422)
    })

    test('fails for admin with ill-formed request with location', async () => {
      const attributes = { name: '', location: 'Where' }
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(422)
    })

    test('fails for student with well-formed request no location', async () => {
      const attributes = { name: 'CS 225 Queue 1 Alter', location: '' }
      const request = await requestAsUser(app, 'student@illinois.edu')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(403)
      expectErrorMessage(res)
    })

    test('fails for student with well-formed request with location', async () => {
      const attributes = { name: 'CS 225 Queue 1 Alter', location: 'Where' }
      const request = await requestAsUser(app, 'student@illinois.edu')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(403)
      expectErrorMessage(res)
    })

    test('fails for course staff of different course with well-formed request no location', async () => {
      const attributes = { name: 'CS 225 Queue 1 Alter', location: '' }
      const request = await requestAsUser(app, '241staff@illinois.edu')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(403)
      expectErrorMessage(res)
    })

    test('fails for course staff of different course with well-formed request with location', async () => {
      const attributes = { name: 'CS 225 Queue 1 Alter', location: 'Where' }
      const request = await requestAsUser(app, '241staff@illinois.edu')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(403)
      expectErrorMessage(res)
    })

    test('fails for course staff with request to fixed location queue but no location', async () => {
      const attributes = { name: 'CS225 Fixed Location Alter', location: '' }
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.patch('/api/queues/3').send(attributes)
      expect(res.statusCode).toBe(422)
    })

    test('fails for admin with request to fixed location queue but no location', async () => {
      const attributes = { name: 'CS225 Fixed Location Alter', location: '' }
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.patch('/api/queues/3').send(attributes)
      expect(res.statusCode).toBe(422)
    })

    test('succeeds for course staff to close queue', async () => {
      const attributes = { open: false }
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(201)
      expect(res.body.open).toBe(false)
    })

    test('succeeds for admin to close queue', async () => {
      const attributes = { open: false }
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(201)
      expect(res.body.open).toBe(false)
    })

    test('fails for non course staff to close queue', async () => {
      const attributes = { open: false }
      const request = await requestAsUser(app, 'student@illinois.edu')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(403)
      const res2 = await request.get('/api/queues/1')
      expect(res2.statusCode).toBe(200)
      expect(res2.body.open).toBe(true)
    })

    test('fails for course staff to change queue status with non boolean (empty string)', async () => {
      const attributes = { open: '' }
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(422)
      const request2 = await requestAsUser(app, 'student@illinois.edu')
      const res2 = await request2.get('/api/queues/1')
      expect(res2.statusCode).toBe(200)
      expect(res2.body.open).toBe(true)
    })

    test('fails for course staff to change queue status with non boolean (non-empty string)', async () => {
      const attributes = { open: 'hello' }
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(422)
      const request2 = await requestAsUser(app, 'student@illinois.edu')
      const res2 = await request2.get('/api/queues/1')
      expect(res2.statusCode).toBe(200)
      expect(res2.body.open).toBe(true)
    })

    test('fails for course staff to change queue status with non boolean (integer)', async () => {
      const attributes = { open: 1234 }
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(422)
      const request2 = await requestAsUser(app, 'student@illinois.edu')
      const res2 = await request2.get('/api/queues/1')
      expect(res2.statusCode).toBe(200)
      expect(res2.body.open).toBe(true)
    })

    test('succeeds for confidential queue not changing when closing queue', async () => {
      const attributes = { messageEnabled: false }
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.patch('/api/queues/5').send(attributes)
      expect(res.statusCode).toBe(201)
      expect(res.body.isConfidential).toBe(true)
    })

    test('succeeds for confidential queue not changing when closing message', async () => {
      const attributes = { open: false }
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.patch('/api/queues/5').send(attributes)
      expect(res.statusCode).toBe(201)
      expect(res.body.isConfidential).toBe(true)
    })

    test('wont allow properties to be set to null', async () => {
      const attributes = {
        open: false,
        name: 'CS 225 Queue 1 Alter',
        location: 'Where',
      }
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(201)
      expect(res.body.open).toBe(false)
      expect(res.body.name).toBe('CS 225 Queue 1 Alter')
      expect(res.body.location).toBe('Where')

      const attributes2 = { open: null, name: null, location: null }
      const res2 = await request.patch('/api/queues/1').send(attributes2)
      expect(res2.statusCode).toBe(201)
      expect(res2.body.open).toBe(false)
      expect(res2.body.name).toBe('CS 225 Queue 1 Alter')
      expect(res2.body.location).toBe('Where')

      const attributes3 = { open: null, name: null }
      const res3 = await request.patch('/api/queues/1').send(attributes3)
      expect(res3.statusCode).toBe(201)
      expect(res3.body.open).toBe(false)
      expect(res3.body.name).toBe('CS 225 Queue 1 Alter')
      expect(res3.body.location).toBe('Where')
    })
  })

  describe('DELETE /api/queues/1', () => {
    test('succeeds for course staff', async () => {
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.delete('/api/queues/1')
      expect(res.statusCode).toBe(202)
      const request2 = await requestAsUser(app, 'admin@illinois.edu')
      const res2 = await request2.get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(4)
      expect(res2.body[0].id).toBe(2)
    })

    test('succeeds for admin', async () => {
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.delete('/api/queues/1')
      expect(res.statusCode).toBe(202)
      const request2 = await requestAsUser(app, 'admin@illinois.edu')
      const res2 = await request2.get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(4)
      expect(res2.body[0].id).toBe(2)
    })

    test('fails for course staff of different course', async () => {
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.delete('/api/queues/2')
      expect(res.statusCode).toBe(403)
      expectErrorMessage(res)
      const request2 = await requestAsUser(app, 'admin@illinois.edu')
      const res2 = await request2.get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(5)
      expect(res2.body[0].id).toBe(1)
      expect(res2.body[1].id).toBe(2)
    })

    test('fails for student', async () => {
      const request = await requestAsUser(app, 'student@illinois.edu')
      const res = await request.delete('/api/queues/1')
      expect(res.statusCode).toBe(403)
      expectErrorMessage(res)
      const request2 = await requestAsUser(app, 'admin@illinois.edu')
      const res2 = await request2.get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(5)
      expect(res2.body[0].id).toBe(1)
      expect(res2.body[1].id).toBe(2)
    })
  })

  describe('DELETE /api/queues/:queueId/staff/:userId', () => {
    test('succeeds for course staff to delete self', async () => {
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.post('/api/queues/1/staff/3')
      expect(res.statusCode).toBe(202)
      const res2 = await request.delete('/api/queues/1/staff/3')
      expect(res2.statusCode).toBe(202)
      const request3 = await requestAsUser(app, 'admin@illinois.edu')
      const res3 = await request3.get('/api/queues/1/staff')
      expect(res3.statusCode).toBe(200)
      expect(res3.body).toHaveLength(0)
    })

    test('succeeds for admin to delete staff', async () => {
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.post('/api/queues/1/staff/3')
      expect(res.statusCode).toBe(202)
      const request2 = await requestAsUser(app, 'admin@illinois.edu')
      const res2 = await request2.delete('/api/queues/1/staff/3')
      expect(res2.statusCode).toBe(202)
      const res3 = await request2.get('/api/queues/1/staff')
      expect(res3.statusCode).toBe(200)
      expect(res3.body).toHaveLength(0)
    })

    test('fails for course staff of different course to delete staff', async () => {
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.post('/api/queues/1/staff/3')
      expect(res.statusCode).toBe(202)
      const request2 = await requestAsUser(app, '241staff@illinois.edu')
      const res2 = await request2.delete('/api/queues/1/staff/3')
      expect(res2.statusCode).toBe(403)
      expectErrorMessage(res2)
      const request3 = await requestAsUser(app, 'admin@illinois.edu')
      const res3 = await request3.get('/api/queues/1/staff')
      expect(res3.statusCode).toBe(200)
      expect(res3.body).toHaveLength(1)
      expect(res3.body[0].user.uid).toBe('225staff@illinois.edu')
    })

    test('fails for student to delete staff', async () => {
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.post('/api/queues/1/staff/3')
      expect(res.statusCode).toBe(202)
      const request2 = await requestAsUser(app, 'student@illinois.edu')
      const res2 = await request2.delete('/api/queues/1/staff/3')
      expect(res2.statusCode).toBe(403)
      expectErrorMessage(res2)
      const request3 = await requestAsUser(app, 'admin@illinois.edu')
      const res3 = await request3.get('/api/queues/1/staff')
      expect(res3.statusCode).toBe(200)
      expect(res3.body).toHaveLength(1)
      expect(res3.body[0].user.uid).toBe('225staff@illinois.edu')
    })
  })

  describe('DELETE /api/queues/1', () => {
    test('succeeds for course staff', async () => {
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.delete('/api/queues/1')
      expect(res.statusCode).toBe(202)
      const request2 = await requestAsUser(app, 'admin@illinois.edu')
      const res2 = await request2.get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(4)
    })

    test('succeeds for admin', async () => {
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.delete('/api/queues/1')
      expect(res.statusCode).toBe(202)
      const res2 = await request.get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(4)
    })

    test('fails for course staff of different course', async () => {
      const request = await requestAsUser(app, '241staff@illinois.edu')
      const res = await request.delete('/api/queues/1')
      expect(res.statusCode).toBe(403)
      expectErrorMessage(res)
      const request2 = await requestAsUser(app, 'admin@illinois.edu')
      const res2 = await request2.get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(5)
    })

    test('fails for student', async () => {
      const request = await requestAsUser(app, 'student@illinois.edu')
      const res = await request.delete('/api/queues/1')
      expect(res.statusCode).toBe(403)
      expectErrorMessage(res)
      const request2 = await requestAsUser(app, 'admin@illinois.edu')
      const res2 = await request2.get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(5)
    })
  })
})

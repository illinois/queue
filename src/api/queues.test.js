/* eslint-env jest */
// const request = require('supertest')
const app = require('../app')
const testutil = require('../../test/util')
const { requestAsUser } = require('../../test/util')

beforeEach(async () => {
  await testutil.setupTestDb()
  await testutil.populateTestDb()
})

afterEach(() => testutil.destroyTestDb())

describe('Queues API', () => {
  describe('GET /api/queues', () => {
    const doGetTest = async user => {
      const request = await requestAsUser(app, user)
      const res = await request.get(`/api/queues`)
      expect(res.statusCode).toBe(200)
      expect(res.body.length).toEqual(4)
      expect(res.body[0].name).toBe('CS225 Queue')
      expect(res.body[1].name).toBe('CS241 Queue')
      expect(res.body[0].location).toBe('Here')
      expect(res.body[1].location).toBe('There')
      expect(res.body[0].id).toBe(1)
      expect(res.body[1].id).toBe(2)
    }
    test('succeeds for admin', async () => {
      await doGetTest('admin')
    })
    test('succeeds for non admin', async () => {
      await doGetTest('student')
    })
  })

  describe('GET /api/queues/2', () => {
    test('succeeds for admin', async () => {
      const request = await requestAsUser(app, 'admin')
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

      const question = { name: 'a', location: 'b', topic: 'c' }
      const res2 = await request.post('/api/queues/2/questions').send(question)
      expect(res2.body.askedBy.netid).toBe('admin')

      const res3 = await request.get('/api/queues/2')
      expect(res3.body).toHaveProperty('questions')
      expect(res3.body.questions).toHaveLength(1)
      expect(res3.body.questions[0]).toHaveProperty('askedBy')
      expect(res3.body.questions[0].askedBy.netid).toBe('admin')
    })

    test('succeeds for non-admin', async () => {
      const request = await requestAsUser(app, 'student')
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

      const question = { name: 'a', location: 'b', topic: 'c' }
      const request2 = await requestAsUser(app, 'admin')
      const res2 = await request2.post('/api/queues/2/questions').send(question)
      expect(res2.body.askedBy.netid).toBe('admin')

      const res3 = await request.get('/api/queues/2')
      expect(res3.body).toHaveProperty('questions')
      expect(res3.body.questions).toHaveLength(1)
      expect(res3.body.questions[0]).toHaveProperty('askedBy')
      expect(res3.body.questions[0].askedBy.netid).toBe('admin')
    })
  })

  describe('GET /api/queues/2/staff', () => {
    test('succeeds for admin', async () => {
      const request = await requestAsUser(app, 'admin')
      const res = await request.get('/api/queues/2/staff')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveLength(0)
    })
  })

  describe('POST /api/queues', () => {
    test('succeeds for admin', async () => {
      const queue = { name: 'CS225 Queue 2', location: 'Where' }
      const request = await requestAsUser(app, 'admin')
      const res = await request.post('/api/courses/1/queues').send(queue)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('CS225 Queue 2')
      expect(res.body.location).toBe('Where')
      expect(res.body.questionCount).toBe(0)
    })

    test('succeeds for course staff', async () => {
      const queue = { name: 'CS225 Queue 2', location: 'Where' }
      const request = await requestAsUser(app, '225staff')
      const res = await request.post('/api/courses/1/queues').send(queue)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('CS225 Queue 2')
      expect(res.body.location).toBe('Where')
      expect(res.body.questionCount).toBe(0)
    })

    test('fails if name is missing', async () => {
      const queue = { location: 'Where' }
      const request = await requestAsUser(app, '225staff')
      const res = await request.post('/api/courses/1/queues').send(queue)
      expect(res.statusCode).toBe(422)
    })

    test('fails if location is missing and queue is fixed-location', async () => {
      const queue = { name: 'CS225 Queue 2', fixedLocation: true }
      const request = await requestAsUser(app, '225staff')
      const res = await request.post('/api/courses/1/queues').send(queue)
      expect(res.statusCode).toBe(422)
    })

    test('fails for student', async () => {
      const queue = { name: 'CS225 Queue 2', location: 'Where' }
      const request = await requestAsUser(app, 'student')
      const res = await request.post('/api/courses/1/queues').send(queue)
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
    })

    test('fails for course staff of different course', async () => {
      const queue = { name: 'CS225 Queue 2', location: 'Where' }
      const request = await requestAsUser(app, '241staff')
      const res = await request.post('/api/courses/1/queues').send(queue)
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
    })
  })

  describe('POST /api/queues/1/staff/:userId', () => {
    test('succeeds for course staff to add self', async () => {
      const request = await requestAsUser(app, '225staff')
      const res = await request.post('/api/queues/1/staff/2')
      expect(res.statusCode).toBe(202)
      const request2 = await requestAsUser(app, 'admin')
      const res2 = await request2.get('/api/queues/1/staff')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(1)
      expect(res2.body[0].user.netid).toBe('225staff')
    })

    test('succeeds if user is already active course staff', async () => {
      const request = await requestAsUser(app, '225staff')
      const res = await request.post('/api/queues/1/staff/2')
      expect(res.statusCode).toBe(202)
      const res2 = await request.post('/api/queues/1/staff/2')
      expect(res2.statusCode).toBe(202)
      const request2 = await requestAsUser(app, 'admin')
      const res3 = await request2.get('/api/queues/1/staff')
      expect(res3.statusCode).toBe(200)
      expect(res3.body).toHaveLength(1)
      expect(res3.body[0].user.netid).toBe('225staff')
    })

    test('succeeds for admin to add admin', async () => {
      const request = await requestAsUser(app, 'admin')
      const res = await request.post('/api/courses/1/queues/1/staff/1')
      expect(res.statusCode).toBe(202)
      const res2 = await request.get('/api/queues/1/staff')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(1)
      expect(res2.body[0].user.netid).toBe('admin')
    })

    test('fails for student to add student', async () => {
      const request = await requestAsUser(app, 'student')
      const res = await request.post('/api/courses/1/queues/1/staff/4')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
      const request2 = await requestAsUser(app, 'admin')
      const res2 = await request2.get('/api/queues/1/staff')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(0)
    })

    test('fails for student to add admin', async () => {
      const request = await requestAsUser(app, 'student')
      const res = await request.post('/api/courses/1/queues/1/staff/1')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
      const res2 = await request.get('/api/queues/1/staff')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(0)
    })

    test('fails for course staff of different course', async () => {
      const request = await requestAsUser(app, '241staff')
      const res = await request.post('/api/courses/1/queues/1/staff/3')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
      const res2 = await request.get('/api/queues/1/staff')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(0)
    })
  })

  describe('PATCH /api/queues/:queueId', () => {
    test('succeeds for course staff with well-formed request no location', async () => {
      const attributes = { name: 'CS 225 Queue 1 Alter', location: '' }
      const request = await requestAsUser(app, '225staff')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('CS 225 Queue 1 Alter')
      expect(res.body.id).toBe(1)
      expect(res.body.location).toBe('')
    })

    test('succeeds for course staff with well-formed request with location', async () => {
      const attributes = { name: 'CS 225 Queue 1 Alter', location: 'Where' }
      const request = await requestAsUser(app, '225staff')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('CS 225 Queue 1 Alter')
      expect(res.body.id).toBe(1)
      expect(res.body.location).toBe('Where')
    })

    test('succeeds for admin with well-formed request no location', async () => {
      const attributes = { name: 'CS 225 Queue 1 Alter', location: '' }
      const request = await requestAsUser(app, 'admin')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('CS 225 Queue 1 Alter')
      expect(res.body.id).toBe(1)
      expect(res.body.location).toBe('')
    })

    test('succeeds for admin with well-formed request with location', async () => {
      const attributes = { name: 'CS 225 Queue 1 Alter', location: 'Where' }
      const request = await requestAsUser(app, 'admin')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('CS 225 Queue 1 Alter')
      expect(res.body.id).toBe(1)
      expect(res.body.location).toBe('Where')
    })

    test('fails for course staff with ill-formed request no location', async () => {
      const attributes = { name: '', location: '' }
      const request = await requestAsUser(app, '225staff')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(422)
    })

    test('fails for course staff with ill-formed request with location', async () => {
      const attributes = { name: '', location: 'Where' }
      const request = await requestAsUser(app, '225staff')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(422)
    })

    test('fails for admin with ill-formed request no location', async () => {
      const attributes = { name: '', location: '' }
      const request = await requestAsUser(app, 'admin')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(422)
    })

    test('fails for admin with ill-formed request with location', async () => {
      const attributes = { name: '', location: 'Where' }
      const request = await requestAsUser(app, 'admin')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(422)
    })

    test('fails for student with well-formed request no location', async () => {
      const attributes = { name: 'CS 225 Queue 1 Alter', location: '' }
      const request = await requestAsUser(app, 'student')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
    })

    test('fails for student with well-formed request with location', async () => {
      const attributes = { name: 'CS 225 Queue 1 Alter', location: 'Where' }
      const request = await requestAsUser(app, 'student')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
    })

    test('fails for course staff of different course with well-formed request no location', async () => {
      const attributes = { name: 'CS 225 Queue 1 Alter', location: '' }
      const request = await requestAsUser(app, '241staff')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
    })

    test('fails for course staff of different course with well-formed request with location', async () => {
      const attributes = { name: 'CS 225 Queue 1 Alter', location: 'Where' }
      const request = await requestAsUser(app, '241staff')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
    })

    test('fails for course staff with request to fixed location queue but no location', async () => {
      const attributes = { name: 'CS225 Fixed Location Alter', location: '' }
      const request = await requestAsUser(app, '225staff')
      const res = await request.patch('/api/queues/3').send(attributes)
      expect(res.statusCode).toBe(422)
    })

    test('fails for admin with request to fixed location queue but no location', async () => {
      const attributes = { name: 'CS225 Fixed Location Alter', location: '' }
      const request = await requestAsUser(app, 'admin')
      const res = await request.patch('/api/queues/3').send(attributes)
      expect(res.statusCode).toBe(422)
    })

    test('succeeds for course staff to close queue', async () => {
      const attributes = { open: false }
      const request = await requestAsUser(app, '225staff')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(201)
      expect(res.body.open).toBe(false)
    })

    test('succeeds for admin to close queue', async () => {
      const attributes = { open: false }
      const request = await requestAsUser(app, 'admin')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(201)
      expect(res.body.open).toBe(false)
    })

    test('fails for non course staff to close queue', async () => {
      const attributes = { open: false }
      const request = await requestAsUser(app, 'student')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(403)
      const res2 = await request.get('/api/queues/1')
      expect(res2.statusCode).toBe(200)
      expect(res2.body.open).toBe(true)
    })

    test('fails for course staff to change queue status with non boolean (empty string)', async () => {
      const attributes = { open: '' }
      const request = await requestAsUser(app, '225staff')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(422)
      const request2 = await requestAsUser(app, 'student')
      const res2 = await request2.get('/api/queues/1')
      expect(res2.statusCode).toBe(200)
      expect(res2.body.open).toBe(true)
    })

    test('fails for course staff to change queue status with non boolean (non-empty string)', async () => {
      const attributes = { open: 'hello' }
      const request = await requestAsUser(app, '225staff')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(422)
      const request2 = await requestAsUser(app, 'student')
      const res2 = await request2.get('/api/queues/1')
      expect(res2.statusCode).toBe(200)
      expect(res2.body.open).toBe(true)
    })

    test('fails for course staff to change queue status with non boolean (integer)', async () => {
      const attributes = { open: 1234 }
      const request = await requestAsUser(app, '225staff')
      const res = await request.patch('/api/queues/1').send(attributes)
      expect(res.statusCode).toBe(422)
      const request2 = await requestAsUser(app, 'student')
      const res2 = await request2.get('/api/queues/1')
      expect(res2.statusCode).toBe(200)
      expect(res2.body.open).toBe(true)
    })

    test('wont allow properties to be set to null', async () => {
      const attributes = {
        open: false,
        name: 'CS 225 Queue 1 Alter',
        location: 'Where',
      }
      const request = await requestAsUser(app, '225staff')
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
      const request = await requestAsUser(app, '225staff')
      const res = await request.delete('/api/queues/1')
      expect(res.statusCode).toBe(202)
      const request2 = await requestAsUser(app, 'admin')
      const res2 = await request2.get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(3)
      expect(res2.body[0].id).toBe(2)
    })

    test('succeeds for admin', async () => {
      const request = await requestAsUser(app, 'admin')
      const res = await request.delete('/api/queues/1')
      expect(res.statusCode).toBe(202)
      const request2 = await requestAsUser(app, 'admin')
      const res2 = await request2.get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(3)
      expect(res2.body[0].id).toBe(2)
    })

    test('fails for course staff of different course', async () => {
      const request = await requestAsUser(app, '225staff')
      const res = await request.delete('/api/queues/2')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
      const request2 = await requestAsUser(app, 'admin')
      const res2 = await request2.get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(4)
      expect(res2.body[0].id).toBe(1)
      expect(res2.body[1].id).toBe(2)
    })

    test('fails for student', async () => {
      const request = await requestAsUser(app, 'student')
      const res = await request.delete('/api/queues/1')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
      const request2 = await requestAsUser(app, 'admin')
      const res2 = await request2.get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(4)
      expect(res2.body[0].id).toBe(1)
      expect(res2.body[1].id).toBe(2)
    })
  })

  describe('DELETE /api/queues/:queueId/staff/:userId', () => {
    test('succeeds for course staff to delete self', async () => {
      const request = await requestAsUser(app, '225staff')
      const res = await request.post('/api/queues/1/staff/3')
      expect(res.statusCode).toBe(202)
      const res2 = await request.delete('/api/queues/1/staff/3')
      expect(res2.statusCode).toBe(202)
      const request3 = await requestAsUser(app, 'admin')
      const res3 = await request3.get('/api/queues/1/staff')
      expect(res3.statusCode).toBe(200)
      expect(res3.body).toHaveLength(0)
    })

    test('succeeds for admin to delete staff', async () => {
      const request = await requestAsUser(app, '225staff')
      const res = await request.post('/api/queues/1/staff/3')
      expect(res.statusCode).toBe(202)
      const request2 = await requestAsUser(app, 'admin')
      const res2 = await request2.delete('/api/queues/1/staff/3')
      expect(res2.statusCode).toBe(202)
      const res3 = await request2.get('/api/queues/1/staff')
      expect(res3.statusCode).toBe(200)
      expect(res3.body).toHaveLength(0)
    })

    test('fails for course staff of different course to delete staff', async () => {
      const request = await requestAsUser(app, '225staff')
      const res = await request.post('/api/queues/1/staff/3')
      expect(res.statusCode).toBe(202)
      const request2 = await requestAsUser(app, '241staff')
      const res2 = await request2.delete('/api/queues/1/staff/3')
      expect(res2.statusCode).toBe(403)
      expect(res2.body).toEqual({})
      const request3 = await requestAsUser(app, 'admin')
      const res3 = await request3.get('/api/queues/1/staff')
      expect(res3.statusCode).toBe(200)
      expect(res3.body).toHaveLength(1)
      expect(res3.body[0].user.netid).toBe('225staff')
    })

    test('fails for student to delete staff', async () => {
      const request = await requestAsUser(app, '225staff')
      const res = await request.post('/api/queues/1/staff/3')
      expect(res.statusCode).toBe(202)
      const request2 = await requestAsUser(app, 'student')
      const res2 = await request2.delete('/api/queues/1/staff/3')
      expect(res2.statusCode).toBe(403)
      expect(res2.body).toEqual({})
      const request3 = await requestAsUser(app, 'admin')
      const res3 = await request3.get('/api/queues/1/staff')
      expect(res3.statusCode).toBe(200)
      expect(res3.body).toHaveLength(1)
      expect(res3.body[0].user.netid).toBe('225staff')
    })
  })

  describe('DELETE /api/queues/1', () => {
    test('succeeds for course staff', async () => {
      const request = await requestAsUser(app, '225staff')
      const res = await request.delete('/api/queues/1')
      expect(res.statusCode).toBe(202)
      const request2 = await requestAsUser(app, 'admin')
      const res2 = await request2.get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(3)
    })

    test('succeeds for admin', async () => {
      const request = await requestAsUser(app, 'admin')
      const res = await request.delete('/api/queues/1')
      expect(res.statusCode).toBe(202)
      const res2 = await request.get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(3)
    })

    test('fails for course staff of different course', async () => {
      const request = await requestAsUser(app, '241staff')
      const res = await request.delete('/api/queues/1')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
      const request2 = await requestAsUser(app, 'admin')
      const res2 = await request2.get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(4)
    })

    test('fails for student', async () => {
      const request = await requestAsUser(app, 'student')
      const res = await request.delete('/api/queues/1')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
      const request2 = await requestAsUser(app, 'admin')
      const res2 = await request2.get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(4)
    })
  })
})

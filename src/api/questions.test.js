/* eslint-env jest */
const request = require('supertest')
const app = require('../app')
const testutil = require('../../test/util')
const constants = require('../constants')
const { Question } = require('../models')

beforeEach(async () => {
  await testutil.setupTestDb()
  await testutil.populateTestDb()
})

afterEach(() => testutil.destroyTestDb())

describe('Questions API', () => {
  describe('POST /api/queues/:queueId/questions', () => {
    test('succeeds for student with well-formed request', async () => {
      const question = { name: 'a', location: 'b', topic: 'c' }
      const res = await request(app)
        .post('/api/queues/1/questions?forceuser=otherstudent')
        .send(question)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('a')
      expect(res.body.location).toBe('b')
      expect(res.body.topic).toBe('c')
      expect(res.body).toHaveProperty('askedBy')
      expect(res.body.askedBy.netid).toBe('otherstudent')
    })

    test('succeeds for course staff with specific netid', async () => {
      const question = {
        name: 'a',
        location: 'b',
        topic: 'c',
        netid: 'otherstudent',
      }
      const res = await request(app)
        .post('/api/queues/1/questions?forceuser=225staff')
        .send(question)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('a')
      expect(res.body.location).toBe('b')
      expect(res.body.topic).toBe('c')
      expect(res.body).toHaveProperty('askedBy')
      expect(res.body.askedBy.netid).toBe('otherstudent')
    })

    test('succeeds for admin with specific netid', async () => {
      const question = {
        name: 'a',
        location: 'b',
        topic: 'c',
        netid: 'otherstudent',
      }
      const res = await request(app)
        .post('/api/queues/1/questions?forceuser=admin')
        .send(question)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('a')
      expect(res.body.location).toBe('b')
      expect(res.body.topic).toBe('c')
      expect(res.body).toHaveProperty('askedBy')
      expect(res.body.askedBy.netid).toBe('otherstudent')
    })

    test('fails for student with well-formed request but the queue is closed', async () => {
      const question = { name: 'a', location: 'b', topic: 'c' }
      const res = await request(app)
        .post('/api/queues/4/questions?forceuser=otherstudent')
        .send(question)
      expect(res.statusCode).toBe(422)
    })

    test('fails for student with specific netid', async () => {
      const question = {
        name: 'a',
        location: 'b',
        topic: 'c',
        netid: 'otherstudent',
      }
      const res = await request(app)
        .post('/api/queues/1/questions?forceuser=student')
        .send(question)
      expect(res.statusCode).toBe(403)
    })

    test('removes location for fixed-location queue', async () => {
      const question = { name: 'a', location: 'testing', topic: 'c' }
      const res = await request(app)
        .post('/api/queues/3/questions?forceuser=student')
        .send(question)
      expect(res.statusCode).toBe(201)
      expect(res.body.location).toBe('')
    })

    test('succeeds if location is missing for fixed-location queue', async () => {
      const question = { name: 'a', location: '', topic: 'c' }
      const res = await request(app)
        .post('/api/queues/3/questions?forceuser=student')
        .send(question)
      expect(res.statusCode).toBe(201)
      expect(res.body.location).toBe('')
    })

    test('fails if name is missing', async () => {
      const question = { location: 'a', topic: 'b' }
      const res = await request(app)
        .post('/api/queues/1/questions')
        .send(question)
      expect(res.statusCode).toBe(422)
    })

    test('fails if name is too long', async () => {
      const question = {
        name: 'a'.repeat(constants.QUESTION_NAME_MAX_LENGTH + 1),
        location: 'a',
        topic: 'b',
      }
      const res = await request(app)
        .post('/api/queues/1/questions')
        .send(question)
      expect(res.statusCode).toBe(422)
    })

    test('fails if location is missing', async () => {
      const question = { name: 'a', topic: 'b' }
      const res = await request(app)
        .post('/api/queues/1/questions')
        .send(question)
      expect(res.statusCode).toBe(422)
    })

    test('fails if location is too long', async () => {
      const question = {
        name: 'a',
        location: 'a'.repeat(constants.QUESTION_LOCATION_MAX_LENGTH + 1),
        topic: 'b',
      }
      const res = await request(app)
        .post('/api/queues/1/questions')
        .send(question)
      expect(res.statusCode).toBe(422)
    })

    test('fails if topic is missing', async () => {
      const question = { name: 'a', location: 'b' }
      const res = await request(app)
        .post('/api/queues/1/questions')
        .send(question)
      expect(res.statusCode).toBe(422)
    })

    test('fails if topic is too long', async () => {
      const question = {
        name: 'a',
        location: 'b',
        topic: 'a'.repeat(constants.QUESTION_TOPIC_MAX_LENGTH + 1),
      }
      const res = await request(app)
        .post('/api/queues/1/questions')
        .send(question)
      expect(res.statusCode).toBe(422)
    })

    test('fails if queue does not exist', async () => {
      const question = { name: 'a', location: 'b', topic: 'c' }
      const res = await request(app)
        .post('/api/queues/50/questions')
        .send(question)
      expect(res.statusCode).toBe(404)
    })

    test('fails if user already has a question on the queue', async () => {
      const question = { name: 'a', location: 'b', topic: 'c' }
      const res = await request(app)
        .post('/api/queues/1/questions?forceuser=admin')
        .send(question)
      expect(res.statusCode).toBe(422)
    })
  })

  describe('GET /api/queues/:queueId/questions', () => {
    test('succeeds with valid response', async () => {
      const res = await request(app).get('/api/queues/1/questions')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveLength(2)
      // Ensure the questions are ordered correctly
      expect(res.body[0].id).toBe(1)
      expect(res.body[0]).toHaveProperty('askedBy')
      expect(res.body[0].askedBy.netid).toBe('admin')
      expect(res.body[1]).toHaveProperty('askedBy')
      expect(res.body[1].id).toBe(2)
      expect(res.body[1].askedBy.netid).toBe('student')
    })

    test('fails if queue does not exist', async () => {
      const res = await request(app).get('/api/queues/50/questions')
      expect(res.statusCode).toBe(404)
    })

    test('succeeds with valid response for non admin', async () => {
      const res = await request(app).get(
        '/api/queues/1/questions?forceuser=student'
      )
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveLength(2)
      // Ensure the questions are ordered correctly
      expect(res.body[0].id).toBe(1)
      expect(res.body[0]).toHaveProperty('askedBy')
      expect(res.body[0].askedBy.netid).toBe('admin')
      expect(res.body[1].id).toBe(2)
      expect(res.body[1]).toHaveProperty('askedBy')
      expect(res.body[1].askedBy.netid).toBe('student')
    })
  })

  describe('GET /api/queues/:queueId/questions/:questionId', () => {
    test('succeeds for admin', async () => {
      const res = await request(app).get('/api/queues/1/questions/1')
      expect(res.statusCode).toBe(200)
      expect(res.body.name).toBe('Nathan')
      expect(res.body).toHaveProperty('askedBy')
      expect(res.body.askedBy.netid).toBe('admin')
      expect(res.body.location).toBe('Siebel')
      expect(res.body.topic).toBe('Queue')
      expect(res.body.id).toBe(1)
    })

    test('succeeds for non admin', async () => {
      const res = await request(app).get(
        '/api/queues/1/questions/1?forceuser=student'
      )
      expect(res.statusCode).toBe(200)
      expect(res.body.name).toBe('Nathan')
      expect(res.body).toHaveProperty('askedBy')
      expect(res.body.askedBy.netid).toBe('admin')
      expect(res.body.location).toBe('Siebel')
      expect(res.body.topic).toBe('Queue')
      expect(res.body.id).toBe(1)
    })
  })

  describe('PATCH /api/queues/:queueId/questions/:questionId', () => {
    test('succeeds for student with well-formed request who asked question', async () => {
      const attributes = { location: 'bx', topic: 'cs' }
      const res = await request(app)
        .patch('/api/queues/1/questions/1?forceuser=admin')
        .send(attributes)
      expect(res.statusCode).toBe(201)
      expect(res.body).toHaveProperty('askedBy')
      expect(res.body.askedBy.netid).toBe('admin')
      expect(res.body.location).toBe('bx')
      expect(res.body.topic).toBe('cs')
    })

    test("doesn't update location for fixed-location queue", async () => {
      const attributes = { location: 'bx', topic: 'cs' }
      const res = await request(app)
        .patch('/api/queues/3/questions/3?forceuser=admin')
        .send(attributes)
      expect(res.statusCode).toBe(201)
      expect(res.body).toHaveProperty('askedBy')
      expect(res.body.askedBy.netid).toBe('admin')
      expect(res.body.location).toBe('')
      expect(res.body.topic).toBe('cs')
    })

    test('fails for student with well-formed request who didnt ask question', async () => {
      const attributes = { location: 'bx', topic: 'cs' }
      const res = await request(app)
        .patch('/api/queues/1/questions/1?forceuser=student')
        .send(attributes)
      expect(res.statusCode).toBe(403)
    })

    test('fails for student with ill-formed request who asked question (no topic)', async () => {
      const attributes = { location: 'bx', topic: '' }
      const res = await request(app)
        .patch('/api/queues/1/questions/1?forceuser=student')
        .send(attributes)
      expect(res.statusCode).toBe(422)
    })

    test('fails for student with ill-formed request who asked question (no location)', async () => {
      const attributes = { location: '', topic: 'cs' }
      const res = await request(app)
        .patch('/api/queues/1/questions/1?forceuser=student')
        .send(attributes)
      expect(res.statusCode).toBe(422)
    })
  })

  describe('POST /api/queues/:queueId/questions/:questionId/answering', () => {
    test('succeeds for admin', async () => {
      const res = await request(app).post(
        '/api/queues/1/questions/1/answering?forceuser=admin'
      )
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('askedBy')
      expect(res.body.askedBy.netid).toBe('admin')
      expect(res.body.beingAnswered).toBe(true)
    })

    test('succeeds for course staff', async () => {
      const res = await request(app).post(
        '/api/queues/1/questions/1/answering?forceuser=225staff'
      )
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('askedBy')
      expect(res.body.askedBy.netid).toBe('admin')
      expect(res.body.beingAnswered).toBe(true)
    })

    test('succeeds if user is answering a question on another queue', async () => {
      // Mark question as being answered by admin
      const res = await request(app).post(
        '/api/queues/1/questions/1/answering?forceuser=admin'
      )
      expect(res.statusCode).toBe(200)
      // Attempt to answer as another user
      const res2 = await request(app).post(
        '/api/queues/3/questions/3/answering?forceuser=admin'
      )
      expect(res2.statusCode).toBe(200)
      const question = await Question.findById(3)
      expect(question.answeredById).toBe(2)
    })

    test('fails if another user is already answering the question', async () => {
      // Mark question as being answered by admin
      const res = await request(app).post(
        '/api/queues/1/questions/1/answering?forceuser=admin'
      )
      expect(res.statusCode).toBe(200)
      // Attempt to answer as another user
      const res2 = await request(app).post(
        '/api/queues/1/questions/1/answering?forceuser=225staff'
      )
      expect(res2.statusCode).toBe(403)
      const question = await Question.findById(1)
      expect(question.answeredById).toBe(2)
    })

    test('fails if user is currently answering another question', async () => {
      const res = await request(app).post(
        '/api/queues/1/questions/1/answering?forceuser=admin'
      )
      expect(res.statusCode).toBe(200)
      const res2 = await request(app).post(
        '/api/queues/1/questions/2/answering?forceuser=admin'
      )
      expect(res2.statusCode).toBe(403)
      const question = await Question.findById(2)
      expect(question.beingAnswered).toBe(false)
    })

    test('fails for student', async () => {
      const res = await request(app).post(
        '/api/queues/1/questions/1/answering?forceuser=student'
      )
      expect(res.statusCode).toBe(403)
    })
  })

  describe('DELETE /api/queues/:queueId/questions/:questionId/answering', () => {
    test('succeeds for admin', async () => {
      const res = await request(app).delete(
        '/api/queues/1/questions/1/answering?forceuser=admin'
      )
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('askedBy')
      expect(res.body.askedBy.netid).toBe('admin')
      expect(res.body.beingAnswered).toBe(false)
    })

    test('succeeds for course staff', async () => {
      const res = await request(app).delete(
        '/api/queues/1/questions/1/answering?forceuser=225staff'
      )
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('askedBy')
      expect(res.body.askedBy.netid).toBe('admin')
      expect(res.body.beingAnswered).toBe(false)
    })

    test('fails for student', async () => {
      const res = await request(app).delete(
        '/api/queues/1/questions/1/answering?forceuser=student'
      )
      expect(res.statusCode).toBe(403)
    })
  })

  describe('POST /api/queues/:queueId/questions/:questionId/answered', () => {
    test('succeeds for admin', async () => {
      const feedback = {
        preparedness: 'good',
        comments: 'Nice Good Job A+',
      }
      const res = await request(app)
        .post('/api/queues/1/questions/1/answered?forceuser=admin')
        .send(feedback)
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('askedBy')
      expect(res.body.askedBy.netid).toBe('admin')
      expect(res.body.beingAnswered).toBe(false)
      expect(res.body.answeredById).toBe(2)
    })

    test('succeeds for course staff', async () => {
      const feedback = {
        preparedness: 'bad',
        comments: 'Nice Good Job A+',
      }
      const res = await request(app)
        .post('/api/queues/1/questions/1/answered?forceuser=225staff')
        .send(feedback)
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('askedBy')
      expect(res.body.askedBy.netid).toBe('admin')
      expect(res.body.beingAnswered).toBe(false)
      expect(res.body.answeredById).toBe(3)
    })

    test('fails if preparedness is missing', async () => {
      const feedback = {
        comments: 'Nice Good Job A+',
      }
      const res = await request(app)
        .post('/api/queues/1/questions/1/answered')
        .send(feedback)
      expect(res.statusCode).toBe(422)
    })

    test('fails if preparedness is invalid', async () => {
      const feedback = {
        preparedness: 'idk bruh',
        comments: 'Nice Good Job A+',
      }
      const res = await request(app)
        .post('/api/queues/1/questions/1/answered')
        .send(feedback)
      expect(res.statusCode).toBe(422)
    })

    test('fails for course staff of different course', async () => {
      const res = await request(app).post(
        '/api/queues/1/questions/1/answered?forceuser=241staff'
      )
      expect(res.statusCode).toBe(403)
    })

    test('fails for student', async () => {
      const res = await request(app).post(
        '/api/queues/1/questions/1/answered?forceuser=student'
      )
      expect(res.statusCode).toBe(403)
    })
  })

  describe('DELETE /api/queues/:queueId/questions/:questionId', () => {
    test('succeeds for course staff', async () => {
      const res = await request(app).delete(
        '/api/queues/2/questions/2?forceuser=225staff'
      )
      expect(res.statusCode).toBe(204)
    })

    test('succeeds for the student that asked the question', async () => {
      const res = await request(app).delete(
        '/api/queues/2/questions/2?forceuser=student'
      )
      expect(res.statusCode).toBe(204)
    })

    test('fails for course staff of different course', async () => {
      const res = await request(app).delete(
        '/api/queues/2/questions/2?forceuser=241staff'
      )
      expect(res.statusCode).toBe(403)
    })

    test('fails for random student', async () => {
      const res = await request(app).delete(
        '/api/queues/2/questions/2?forceuser=otherstudent'
      )
      expect(res.statusCode).toBe(403)
    })
  })
})

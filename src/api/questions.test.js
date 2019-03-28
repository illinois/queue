/* eslint-env jest */
// const request = require('supertest')
const app = require('../app')
const testutil = require('../../test/util')
const { requestAsUser } = require('../../test/util')
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
      const request = await requestAsUser(app, 'otherstudent')
      const res = await request.post('/api/queues/1/questions').send(question)
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
      const request = await requestAsUser(app, '225staff')
      const res = await request.post('/api/queues/1/questions').send(question)
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
      const request = await requestAsUser(app, 'admin')
      const res = await request.post('/api/queues/1/questions').send(question)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('a')
      expect(res.body.location).toBe('b')
      expect(res.body.topic).toBe('c')
      expect(res.body).toHaveProperty('askedBy')
      expect(res.body.askedBy.netid).toBe('otherstudent')
    })

    test('fails for student with well-formed request but the queue is closed', async () => {
      const question = { name: 'a', location: 'b', topic: 'c' }
      const request = await requestAsUser(app, 'otherstudent')
      const res = await request.post('/api/queues/4/questions').send(question)
      expect(res.statusCode).toBe(422)
    })

    test('fails for student with specific netid', async () => {
      const question = {
        name: 'a',
        location: 'b',
        topic: 'c',
        netid: 'otherstudent',
      }
      const request = await requestAsUser(app, 'student')
      const res = await request.post('/api/queues/1/questions').send(question)
      expect(res.statusCode).toBe(403)
    })

    test('removes location for fixed-location queue', async () => {
      const question = { name: 'a', location: 'testing', topic: 'c' }
      const request = await requestAsUser(app, 'student')
      const res = await request.post('/api/queues/3/questions').send(question)
      expect(res.statusCode).toBe(201)
      expect(res.body.location).toBe('')
    })

    test('succeeds if location is missing for fixed-location queue', async () => {
      const question = { name: 'a', location: '', topic: 'c' }
      const request = await requestAsUser(app, 'student')
      const res = await request.post('/api/queues/3/questions').send(question)
      expect(res.statusCode).toBe(201)
      expect(res.body.location).toBe('')
    })

    test('fails if name is missing', async () => {
      const question = { location: 'a', topic: 'b' }
      const request = await requestAsUser(app, 'admin')
      const res = await request.post('/api/queues/1/questions').send(question)
      expect(res.statusCode).toBe(422)
    })

    test('fails if name is too long', async () => {
      const question = {
        name: 'a'.repeat(constants.QUESTION_NAME_MAX_LENGTH + 1),
        location: 'a',
        topic: 'b',
      }
      const request = await requestAsUser(app, 'admin')
      const res = await request.post('/api/queues/1/questions').send(question)
      expect(res.statusCode).toBe(422)
    })

    test('fails if location is missing', async () => {
      const question = { name: 'a', topic: 'b' }
      const request = await requestAsUser(app, 'admin')
      const res = await request.post('/api/queues/1/questions').send(question)
      expect(res.statusCode).toBe(422)
    })

    test('fails if location is too long', async () => {
      const question = {
        name: 'a',
        location: 'a'.repeat(constants.QUESTION_LOCATION_MAX_LENGTH + 1),
        topic: 'b',
      }
      const request = await requestAsUser(app, 'admin')
      const res = await request.post('/api/queues/1/questions').send(question)
      expect(res.statusCode).toBe(422)
    })

    test('fails if topic is missing', async () => {
      const question = { name: 'a', location: 'b' }
      const request = await requestAsUser(app, 'admin')
      const res = await request.post('/api/queues/1/questions').send(question)
      expect(res.statusCode).toBe(422)
    })

    test('fails if topic is too long', async () => {
      const question = {
        name: 'a',
        location: 'b',
        topic: 'a'.repeat(constants.QUESTION_TOPIC_MAX_LENGTH + 1),
      }
      const request = await requestAsUser(app, 'admin')
      const res = await request.post('/api/queues/1/questions').send(question)
      expect(res.statusCode).toBe(422)
    })

    test('fails if queue does not exist', async () => {
      const question = { name: 'a', location: 'b', topic: 'c' }
      const request = await requestAsUser(app, 'admin')
      const res = await request.post('/api/queues/50/questions').send(question)
      expect(res.statusCode).toBe(404)
    })

    test('fails if user already has a question on the queue', async () => {
      const question = { name: 'a', location: 'b', topic: 'c' }
      const request = await requestAsUser(app, 'admin')
      const res = await request.post('/api/queues/1/questions').send(question)
      expect(res.statusCode).toBe(422)
    })
  })

  describe('GET /api/queues/:queueId/questions', () => {
    const checkValidResponseForUser = async user => {
      const request = await requestAsUser(app, user)
      const res = await request.get('/api/queues/1/questions')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveLength(2)
      // Ensure the questions are ordered correctly
      expect(res.body[0].id).toBe(1)
      expect(res.body[0]).toHaveProperty('askedBy')
      expect(res.body[0].askedBy.netid).toBe('admin')
      expect(res.body[1]).toHaveProperty('askedBy')
      expect(res.body[1].id).toBe(2)
      expect(res.body[1].askedBy.netid).toBe('student')
    }

    test('succeeds with valid response for admin', async () => {
      await checkValidResponseForUser('admin')
    })

    test('succeeds with valid response for student', async () => {
      await checkValidResponseForUser('student')
    })

    const checkValidResponseForUserOnConfidentialQueue = async user => {
      const request = await requestAsUser(app, user)
      const res = await request.get('/api/queues/5/questions')
      expect(res.statusCode).toBe(200)
      expect(Array.isArray(res.body)).toBeTruthy()
      expect(res.body).toHaveLength(2)
      const [question1, question2] = res.body
      expect(question1).toHaveProperty('askedById', 5)
      expect(question1).toHaveProperty('askedBy.netid', 'student')
      expect(question2).toHaveProperty('askedById', 6)
      expect(question2).toHaveProperty('askedBy.netid', 'otherstudent')
    }

    test('includes data for admin on confidential queue', async () => {
      await checkValidResponseForUserOnConfidentialQueue('admin')
    })

    test('includes data for course staff on confidential queue', async () => {
      await checkValidResponseForUserOnConfidentialQueue('225staff')
    })

    test('fails if queue does not exist', async () => {
      const request = await requestAsUser(app, 'admin')
      const res = await request.get('/api/queues/50/questions')
      expect(res.statusCode).toBe(404)
    })

    const excludesDataForUser = async user => {
      const request = await requestAsUser(app, user)
      const res = await request.get('/api/queues/5/questions')
      expect(res.statusCode).toBe(200)
      expect(Array.isArray(res.body)).toBeTruthy()
      expect(res.body).toHaveLength(2)
      // We expect all questions not asked by 'student' (user 5) to have no
      // information besides question ID
      res.body.forEach(question => {
        if (Object.keys(question).length > 1) {
          expect(question.askedById).toEqual(5)
        } else {
          expect(Object.keys(question)).toEqual(['id'])
        }
      })
    }

    test('excludes question information for other staff on a confidential queue', async () => {
      await excludesDataForUser('241staff')
    })

    test('excludes question information for students on a confidential queue', async () => {
      await excludesDataForUser('student')
    })
  })

  describe('GET /api/queues/:queueId/questions/:questionId', () => {
    test('succeeds for admin', async () => {
      const request = await requestAsUser(app, 'admin')
      const res = await request.get('/api/queues/1/questions/1')
      expect(res.statusCode).toBe(200)
      expect(res.body.name).toBe('Nathan')
      expect(res.body).toHaveProperty('askedBy')
      expect(res.body.askedBy.netid).toBe('admin')
      expect(res.body.location).toBe('Siebel')
      expect(res.body.topic).toBe('Queue')
      expect(res.body.id).toBe(1)
    })

    test('succeeds for non admin', async () => {
      const request = await requestAsUser(app, 'student')
      const res = await request.get('/api/queues/1/questions/1')
      expect(res.statusCode).toBe(200)
      expect(res.body.name).toBe('Nathan')
      expect(res.body).toHaveProperty('askedBy')
      expect(res.body.askedBy.netid).toBe('admin')
      expect(res.body.location).toBe('Siebel')
      expect(res.body.topic).toBe('Queue')
      expect(res.body.id).toBe(1)
    })

    test('succeeds for course staff of confidential queue', async () => {
      const request = await requestAsUser(app, '225staff')
      const res = await request.get('/api/queues/5/questions/4')
      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBe(4)
      expect(res.body.name).toBe('Student')
      expect(res.body).toHaveProperty('askedBy.netid', 'student')
    })

    test('succeeds for student who asked question on confidential queue', async () => {
      const request = await requestAsUser(app, 'student')
      const res = await request.get('/api/queues/5/questions/4')
      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBe(4)
      expect(res.body.name).toBe('Student')
      expect(res.body).toHaveProperty('askedBy.netid', 'student')
    })

    test('fails for other course staff on confidential queue', async () => {
      const request = await requestAsUser(app, '241staff')
      const res = await request.get('/api/queues/5/questions/4')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
    })

    test('fails for student on confidential queue', async () => {
      const request = await requestAsUser(app, 'otherstudent')
      const res = await request.get('/api/queues/5/questions/4')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
    })
  })

  describe('PATCH /api/queues/:queueId/questions/:questionId', () => {
    test('succeeds for student with well-formed request who asked question', async () => {
      const attributes = { location: 'bx', topic: 'cs' }
      const request = await requestAsUser(app, 'admin')
      const res = await request
        .patch('/api/queues/1/questions/1')
        .send(attributes)
      expect(res.statusCode).toBe(201)
      expect(res.body).toHaveProperty('askedBy')
      expect(res.body.askedBy.netid).toBe('admin')
      expect(res.body.location).toBe('bx')
      expect(res.body.topic).toBe('cs')
    })

    test("doesn't update location for fixed-location queue", async () => {
      const attributes = { location: 'bx', topic: 'cs' }
      const request = await requestAsUser(app, 'admin')
      const res = await request
        .patch('/api/queues/3/questions/3')
        .send(attributes)
      expect(res.statusCode).toBe(201)
      expect(res.body).toHaveProperty('askedBy')
      expect(res.body.askedBy.netid).toBe('admin')
      expect(res.body.location).toBe('')
      expect(res.body.topic).toBe('cs')
    })

    test('fails for student with well-formed request who didnt ask question', async () => {
      const attributes = { location: 'bx', topic: 'cs' }
      const request = await requestAsUser(app, 'student')
      const res = await request
        .patch('/api/queues/1/questions/1')
        .send(attributes)
      expect(res.statusCode).toBe(403)
    })

    test('fails for student with ill-formed request who asked question (no topic)', async () => {
      const attributes = { location: 'bx', topic: '' }
      const request = await requestAsUser(app, 'student')
      const res = await request
        .patch('/api/queues/1/questions/1')
        .send(attributes)
      expect(res.statusCode).toBe(422)
    })

    test('fails for student with ill-formed request who asked question (no location)', async () => {
      const attributes = { location: '', topic: 'cs' }
      const request = await requestAsUser(app, 'student')
      const res = await request
        .patch('/api/queues/1/questions/1')
        .send(attributes)
      expect(res.statusCode).toBe(422)
    })
  })

  describe('POST /api/queues/:queueId/questions/:questionId/answering', () => {
    test('succeeds for admin', async () => {
      const request = await requestAsUser(app, 'admin')
      const res = await request.post('/api/queues/1/questions/1/answering')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('askedBy')
      expect(res.body.askedBy.netid).toBe('admin')
      expect(res.body.answeredBy.name).toBe('Admin')
      expect(res.body.beingAnswered).toBe(true)
    })

    test('succeeds for course staff', async () => {
      const request = await requestAsUser(app, '225staff')
      const res = await request.post('/api/queues/1/questions/1/answering')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('askedBy')
      expect(res.body.askedBy.netid).toBe('admin')
      expect(res.body.answeredBy.name).toBe('225 Staff')
      expect(res.body.beingAnswered).toBe(true)
    })

    test('succeeds if user is answering a question on another queue', async () => {
      // Mark question as being answered by admin
      const request = await requestAsUser(app, 'admin')
      const res = await request.post('/api/queues/1/questions/1/answering')
      expect(res.statusCode).toBe(200)
      // Attempt to answer as another user
      const request2 = await requestAsUser(app, 'admin')
      const res2 = await request2.post('/api/queues/3/questions/3/answering')
      expect(res2.statusCode).toBe(200)
      const question = await Question.findByPk(3)
      expect(question.answeredById).toBe(2)
    })

    test('fails if another user is already answering the question', async () => {
      // Mark question as being answered by admin
      const request = await requestAsUser(app, 'admin')
      const res = await request.post('/api/queues/1/questions/1/answering')
      expect(res.statusCode).toBe(200)
      // Attempt to answer as another user
      const request2 = await requestAsUser(app, '225staff')
      const res2 = await request2.post('/api/queues/1/questions/1/answering')
      expect(res2.statusCode).toBe(403)
      const question = await Question.findByPk(1)
      expect(question.answeredById).toBe(2)
    })

    test('fails if user is currently answering another question', async () => {
      const request = await requestAsUser(app, 'admin')
      const res = await request.post('/api/queues/1/questions/1/answering')
      expect(res.statusCode).toBe(200)
      const request2 = await requestAsUser(app, 'admin')
      const res2 = await request2.post('/api/queues/1/questions/2/answering')
      expect(res2.statusCode).toBe(403)
      const question = await Question.findByPk(2)
      expect(question.beingAnswered).toBe(false)
    })

    test('fails for student', async () => {
      const request = await requestAsUser(app, 'student')
      const res = await request.post('/api/queues/1/questions/1/answering')
      expect(res.statusCode).toBe(403)
    })
  })

  describe('DELETE /api/queues/:queueId/questions/:questionId/answering', () => {
    test('succeeds for admin', async () => {
      const request = await requestAsUser(app, 'admin')
      const res = await request.delete('/api/queues/1/questions/1/answering')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('askedBy')
      expect(res.body.askedBy.netid).toBe('admin')
      expect(res.body.beingAnswered).toBe(false)
    })

    test('succeeds for course staff', async () => {
      const request = await requestAsUser(app, '225staff')
      const res = await request.delete('/api/queues/1/questions/1/answering')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('askedBy')
      expect(res.body.askedBy.netid).toBe('admin')
      expect(res.body.beingAnswered).toBe(false)
    })

    test('fails for student', async () => {
      const request = await requestAsUser(app, 'student')
      const res = await request.delete('/api/queues/1/questions/1/answering')
      expect(res.statusCode).toBe(403)
    })
  })

  describe('POST /api/queues/:queueId/questions/:questionId/answered', () => {
    test('succeeds for admin', async () => {
      const feedback = {
        preparedness: 'good',
        comments: 'Nice Good Job A+',
      }
      const request = await requestAsUser(app, 'admin')
      const res = await request
        .post('/api/queues/1/questions/1/answered')
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
      const request = await requestAsUser(app, '225staff')
      const res = await request
        .post('/api/queues/1/questions/1/answered')
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
      const request = await requestAsUser(app, 'admin')
      const res = await request
        .post('/api/queues/1/questions/1/answered')
        .send(feedback)
      expect(res.statusCode).toBe(422)
    })

    test('fails if preparedness is invalid', async () => {
      const feedback = {
        preparedness: 'idk bruh',
        comments: 'Nice Good Job A+',
      }
      const request = await requestAsUser(app, 'admin')
      const res = await request
        .post('/api/queues/1/questions/1/answered')
        .send(feedback)
      expect(res.statusCode).toBe(422)
    })

    test('fails for course staff of different course', async () => {
      const request = await requestAsUser(app, '241staff')
      const res = await request.post('/api/queues/1/questions/1/answered')
      expect(res.statusCode).toBe(403)
    })

    test('fails for student', async () => {
      const request = await requestAsUser(app, 'student')
      const res = await request.post('/api/queues/1/questions/1/answered')
      expect(res.statusCode).toBe(403)
    })
  })

  describe('DELETE /api/queues/:queueId/questions/:questionId', () => {
    test('succeeds for course staff', async () => {
      const request = await requestAsUser(app, '225staff')
      const res = await request.delete('/api/queues/2/questions/2')
      expect(res.statusCode).toBe(204)
    })

    test('succeeds for the student that asked the question', async () => {
      const request = await requestAsUser(app, 'student')
      const res = await request.delete('/api/queues/2/questions/2')
      expect(res.statusCode).toBe(204)
    })

    test('fails for course staff of different course', async () => {
      const request = await requestAsUser(app, '241staff')
      const res = await request.delete('/api/queues/2/questions/2')
      expect(res.statusCode).toBe(403)
    })

    test('fails for random student', async () => {
      const request = await requestAsUser(app, 'otherstudent')
      const res = await request.delete('/api/queues/2/questions/2')
      expect(res.statusCode).toBe(403)
    })
  })

  describe('DELETE /api/queues/:queueId/questions', () => {
    test('succeeds for course staff', async () => {
      const request = await requestAsUser(app, '225staff')
      const res = await request.delete('/api/queues/1/questions')
      expect(res.statusCode).toBe(204)
    })

    test('fails for course staff of different course', async () => {
      const request = await requestAsUser(app, '241staff')
      const res = await request.delete('/api/queues/1/questions')
      expect(res.statusCode).toBe(403)
    })

    test('fails for random student', async () => {
      const request = await requestAsUser(app, 'otherstudent')
      const res = await request.delete('/api/queues/1/questions')
      expect(res.statusCode).toBe(403)
    })
  })
})

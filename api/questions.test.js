const request = require('supertest')
const app = require('../app')
const testutil = require('../testutil')

beforeEach(async () => {
  await testutil.setupTestDb()
  await testutil.populateTestDb()
})
afterEach(() => testutil.destroyTestDb())

describe('Questions API', () => {
  // Adds a question to a queue
  describe('POST /api/questions', () => {
    test('should succeed for admin', async () => {
      const question_data = { name: 'test student', location: 'Where', topic: 'question'}
      const res = await request(app).post('/api/queues/1/questions').send(question_data)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('test student')
      expect(res.body.location).toBe('Where')
      expect(res.body.topic).toBe('question')
      expect(res.body.id).toBe(3)

    })
    test('should succeed for non admin', async () => {
      const question_data = { name: 'test student', location: 'Where', topic: 'question'}
      const res = await request(app).post('/api/queues/1/questions?forceuser=student').send(question_data)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('test student')
      expect(res.body.location).toBe('Where')
      expect(res.body.topic).toBe('question')
      expect(res.body.id).toBe(3)

    })
  })

  // get all questions for a particular queue
  describe('GET /api/questions', () => {
    test('should succeed for admin', async () => {
      const res = await request(app).get('/api/queues/1/questions')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveLength(1)

    })
    test('should succeed for non admin', async () => {
      const res = await request(app).get('/api/queues/1/questions?forceuser=student')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveLength(1)

    })
  })

  //get a particular question
  describe('GET /api/questions/1', () => {
    test('should succeed for admin', async () => {
      const res = await request(app).get('/api/queues/1/questions/1')
      expect(res.statusCode).toBe(200)
      expect(res.body.name).toBe('225 test student')
      expect(res.body.location).toBe('Here')
      expect(res.body.topic).toBe('question')
      expect(res.body.id).toBe(1)
    })
    test('should succeed for non admin', async () => {
      const res = await request(app).get('/api/queues/1/questions/1?forceuser=student')
      expect(res.statusCode).toBe(200)
      expect(res.body.name).toBe('225 test student')
      expect(res.body.location).toBe('Here')
      expect(res.body.topic).toBe('question')
      expect(res.body.id).toBe(1)

    })
  })

  //TODO: update a particular question
  /*describe('PATCH /api/questions/1', () => {
    test('should succeed for admin', async () => {
      const res = await request(app).patch('/api/queues/1/questions')
      expect(res.statusCode).toBe(200)
      console.log(res.body)
    })
    test('should succeed for non admin', async () => {
      const res = await request(app).patch('/api/queues/1/questions?forceuser=student')
      expect(res.statusCode).toBe(200)
    })
})*/

   // mark a question as being answered
  describe('POST /api/questions/1/answering', () => {
    test('should succeed for admin', async () => {
      const res = await request(app).post('/api/queues/1/questions/1/answering?forceuser=admin')
      expect(res.statusCode).toBe(200)
      expect(res.body.beingAnswered).toBe(true)
    })
    test('should succeed for course staff', async () => {
      const res = await request(app).post('/api/queues/1/questions/1/answering?forceuser=225staff')
      expect(res.statusCode).toBe(200)
      expect(res.body.beingAnswered).toBe(true)
    })
    test('should not succeed for course staff of different course', async () => {
      const res = await request(app).post('/api/queues/1/questions/1/answering?forceuser=241staff')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
    })
    test('should not succeed for student', async () => {
      const res = await request(app).post('/api/queues/1/questions/1/answering?forceuser=student')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
    })
  })

  // mark a question as no longer being answered
  describe('DELETE /api/questions/1/answering', () => {
    test('should succeed for admin', async () => {
      const res = await request(app).delete('/api/queues/1/questions/1/answering?forceuser=admin')
      expect(res.statusCode).toBe(200)
      expect(res.body.beingAnswered).toBe(false)
    })
    test('should succeed for course staff', async () => {
      const res = await request(app).delete('/api/queues/1/questions/1/answering?forceuser=225staff')
      expect(res.statusCode).toBe(200)
      expect(res.body.beingAnswered).toBe(false)
    })
    test('should not succeed for course staff of different course', async () => {
      const res = await request(app).delete('/api/queues/1/questions/1/answering?forceuser=241staff')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
    })
    test('should not succeed for student', async () => {
      const res = await request(app).delete('/api/queues/1/questions/1/answering?forceuser=student')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
    })
  })

  // mark the question as answered
  describe('POST /api/questions/1/answered', () => {
    test('should succeed for admin', async () => {
      const question_data = { preparedness: 'well'}
      const res = await request(app).post('/api/queues/1/questions/1/answered?forceuser=admin').send(question_data)
      expect(res.statusCode).toBe(200)
      expect(res.body.beingAnswered).toBe(false)
      expect(res.body.answeredById).toBe(1)
    })
    test('should succeed for course staff', async () => {
      const question_data = { preparedness: 'well'}
      const res = await request(app).post('/api/queues/1/questions/1/answered?forceuser=225staff').send(question_data)
      expect(res.statusCode).toBe(200)
      expect(res.body.beingAnswered).toBe(false)
      expect(res.body.answeredById).toBe(2)
    })
    test('should not succeed for course staff of different course', async () => {
      const question_data = { preparedness: 'well'}
      const res = await request(app).post('/api/queues/1/questions/1/answered?forceuser=241staff').send(question_data)
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
    })
    test('should not succeed for student', async () => {
      const question_data = { preparedness: 'well'}
      const res = await request(app).post('/api/queues/1/questions/1/answered?forceuser=student').send(question_data)
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
    })
  })

  // Deletes a question from a queue, without marking
  // it as answered; can only be done by the person
  // asking the question or course staff
  describe('DELETE /api/questions/1', () => {
    test('should succeed for admin', async () => {
      const res = await request(app).delete('/api/queues/1/questions/1?forceuser=admin')
      expect(res.statusCode).toBe(202)
      expect(res.body).toEqual({})
    })
    test('should succeed for course staff', async () => {
      const res = await request(app).delete('/api/queues/1/questions/1?forceuser=225staff')
      expect(res.statusCode).toBe(202)
      expect(res.body).toEqual({})
    })
    test('should not succeed for course staff of different course (didnt ask question)', async () => {
      const res = await request(app).delete('/api/queues/1/questions/1?forceuser=241staff')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
    })
    test('should succeed for student who asked question', async () => {
      const res = await request(app).delete('/api/queues/1/questions/1?forceuser=student')
      expect(res.statusCode).toBe(202)
    })
  })

})

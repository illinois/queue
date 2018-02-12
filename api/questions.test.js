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
      expect(res.body.id).toBe(1)

    })
    test('should succeed for non admin', async () => {
      const question_data = { name: 'test student', location: 'Where', topic: 'question'}
      const res = await request(app).post('/api/queues/1/questions?forceuser=student').send(question_data)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('test student')
      expect(res.body.location).toBe('Where')
      expect(res.body.topic).toBe('question')
      expect(res.body.id).toBe(1)

    })
  })

  // get all questions for a particular queue
  describe('GET /api/questions', () => {
    test('should succeed for admin', async () => {
      const res = await request(app).get('/api/queues/1/questions')
      expect(res.statusCode).toBe(200)

    })
    test('should succeed for non admin', async () => {
      const res = await request(app).get('/api/queues/1/questions?forceuser=student')
      expect(res.statusCode).toBe(200)

    })
  })

  //get a particular question
  describe('GET /api/questions', () => {
    test('should succeed for admin', async () => {
      const res = await request(app).get('/api/queues/1/questions')
      expect(res.statusCode).toBe(200)
    })
    test('should succeed for non admin', async () => {
      const res = await request(app).get('/api/queues/1/questions?forceuser=student')
      expect(res.statusCode).toBe(200)
    })
  })

  //update a particular question
  describe('GET /api/questions', () => {
    test('should succeed for admin', async () => {
      const res = await request(app).get('/api/queues/1/questions')
      expect(res.statusCode).toBe(200)
    })
    test('should succeed for non admin', async () => {
      const res = await request(app).get('/api/queues/1/questions?forceuser=student')
      expect(res.statusCode).toBe(200)
    })
  })

   // mark a question as being answered

   // mark a question as no longer being answered

   // mark the question as answered

   // Deletes a question from a queue, without marking
   // it as answered; can only be done by the person
   // asking the question or course staff


  })
})

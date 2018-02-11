/* eslint-env jest */
const request = require('supertest')
const app = require('../app')
const testutil = require('../testutil')

beforeEach(async () => {
  await testutil.setupTestDb()
  await testutil.populateTestDb()
})
afterEach(() => testutil.destroyTestDb())

describe('Queues API', () => {

  describe('GET /api/queues', () => {
    test('GET /api/queues', async () => {
      const res = await request(app).get('/api/queues')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveLength(2)
      expect(res.body[0].name).toBe('CS225 Queue')
      expect(res.body[1].name).toBe('CS241 Queue')
      expect(res.body[0].location).toBe('Here')
      expect(res.body[1].location).toBe('There')
    })

    test('GET /api/queues/2', async () => {
      const res = await request(app).get('/api/queues/2')
      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBe(2)
      expect(res.body.name).toBe('CS241 Queue')
      expect(res.body.location).toBe('There')
      expect(res.body.courseId).toBe(2)

      // TODO verify these properties are populated correctly
      expect(res.body).toHaveProperty('questions')
      expect(res.body).toHaveProperty('activeStaff')
    })
  })

  describe('POST /api/queues', () => {
    test('should succeed for course staff', async () => {
      const queue_data = { name: 'CS225 Queue 2', location: 'Where', courseId: 1 }
      const res = await request(app).post('/api/courses/1/queues?forceuser=225staff').send(queue_data)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('CS225 Queue 2')
      expect(res.body.id).toBe(3)
      expect(res.body.location).toBe('Where')

    })
    test('should succeed for admin', async () => {
      const queue_data = { name: 'CS225 Queue 2', location: 'Where', courseId: 1 }
      const res = await request(app).post('/api/courses/1/queues?forceuser=admin').send(queue_data)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('CS225 Queue 2')
      expect(res.body.id).toBe(3)
      expect(res.body.location).toBe('Where')

    })
    test('should fail for a student', async () => {
      const queue_data = { name: 'CS225 Queue 2', location: 'Where', courseId: 1}
      const res = await request(app).post('/api/courses/1/queues?forceuser=student').send(queue_data)
      expect(res.statusCode).toBe(403)
    })
    test('should fail for a staff of different course', async () => {
      const queue_data = { name: 'CS225 Queue 2', location: 'Where', courseId: 1 }
      const res = await request(app).post('/api/courses/1/queues?forceuser=241staff').send(queue_data)
      expect(res.statusCode).toBe(403)
    })
  })


  describe('DELETE /api/queues/1', () => {
    test('should succeed for course staff', async () => {
      const res = await request(app).delete('/api/queues/1?forceuser=225staff')
      expect(res.statusCode).toBe(202)
      const res2 = await request(app).get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(1)

    })
    test('should succeed for admin', async () => {
      const res = await request(app).delete('/api/queues/1?forceuser=admin')
      expect(res.statusCode).toBe(202)
      const res2 = await request(app).get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(1)

    })
    test('should fail for course staff of different course', async () => {
      const res = await request(app).delete('/api/queues/2?forceuser=225staff')
      expect(res.statusCode).toBe(403)
      const res2 = await request(app).get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(2)

    })
    test('should fail for student', async () => {
      const res = await request(app).delete('/api/queues/1?forceuser=student')
      expect(res.statusCode).toBe(403)
      const res2 = await request(app).get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(2)

    })

  })

  describe('delete /api/queues/1/staff', () => {
    test('should succeed for course staff', async () => {
      //const delete_data = { userId: '225staff', queueId: 1}
      //.send(delete_data)
      const res = await request(app).delete('/api/queues/1/staff/225staff?forceuser=225staff')
      expect(res.statusCode).toBe(202)

      // TODO: check activeStaff length?

    })
    test('should succeed for admin', async () => {
      const res = await request(app).delete('/api/queues/1/staff/225staff?forceuser=admin')
      expect(res.statusCode).toBe(202)

    })
    test('should fail for course staff of different course', async () => {
      const res = await request(app).delete('/api/queues/1/staff/225staff?forceuser=241staff')
      expect(res.statusCode).toBe(403)

    })
    test('should fail for student', async () => {
      const res = await request(app).delete('/api/queues/1/staff/225staff?forceuser=student')
      expect(res.statusCode).toBe(403)

    })

  })

})

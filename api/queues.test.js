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
    test('should succeed for admin', async () => {
      const res = await request(app).get('/api/queues?forceuser=admin')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveLength(2)
      expect(res.body[0].name).toBe('CS225 Queue')
      expect(res.body[1].name).toBe('CS241 Queue')
      expect(res.body[0].location).toBe('Here')
      expect(res.body[1].location).toBe('There')
      expect(res.body[0].id).toBe(1)
      expect(res.body[1].id).toBe(2)
    })
    test('should fail for non admin', async () => {
      const res = await request(app).get('/api/queues?forceuser=student')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
    })
  })
  describe('GET /api/queues/2', () => {
    test('should succeed for admin', async () => {
      const res = await request(app).get('/api/queues/2?forceuser=admin')
      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBe(2)
      expect(res.body.name).toBe('CS241 Queue')
      expect(res.body.location).toBe('There')
      expect(res.body.courseId).toBe(2)

      expect(res.body).toHaveProperty('questions')
      expect(res.body.questions).toHaveLength(0)
      expect(res.body).toHaveProperty('activeStaff')
      expect(res.body.activeStaff).toHaveLength(0)

    })

    test('should succeed for non-admin', async () => {
      const res = await request(app).get('/api/queues/2?forceuser=student')
      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBe(2)
      expect(res.body.name).toBe('CS241 Queue')
      expect(res.body.location).toBe('There')
      expect(res.body.courseId).toBe(2)

      expect(res.body).toHaveProperty('questions')
      expect(res.body.questions).toHaveLength(0)
      expect(res.body).toHaveProperty('activeStaff')
      expect(res.body.activeStaff).toHaveLength(0)
    })

  })

  describe('GET /api/queues/2/staff', () => {
    test('should succeed for admin', async () => {
      const res = await request(app).get('/api/queues/2/staff?forceuser=admin')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveLength(0)
    })

  })

  describe('POST /api/queues', () => {
    test('should succeed for course staff', async () => {
      const queue_data = { name: 'CS225 Queue 2', location: 'Where'}
      const res = await request(app).post('/api/courses/1/queues?forceuser=225staff').send(queue_data)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('CS225 Queue 2')
      expect(res.body.id).toBe(3)
      expect(res.body.location).toBe('Where')

    })
    test('should succeed for admin', async () => {
      const queue_data = { name: 'CS225 Queue 2', location: 'Where'}
      const res = await request(app).post('/api/courses/1/queues?forceuser=admin').send(queue_data)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('CS225 Queue 2')
      expect(res.body.id).toBe(3)
      expect(res.body.location).toBe('Where')

    })
    test('should fail for a student', async () => {
      const queue_data = { name: 'CS225 Queue 2', location: 'Where'}
      const res = await request(app).post('/api/courses/1/queues?forceuser=student').send(queue_data)
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
    })
    test('should fail for a staff of different course', async () => {
      const queue_data = { name: 'CS225 Queue 2', location: 'Where'}
      const res = await request(app).post('/api/courses/1/queues?forceuser=241staff').send(queue_data)
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
    })
  })

  describe('POST /api/queues/1/staff/:userId', () => {
    test('should succeed for course staff to add self', async () => {
      const res = await request(app).post('/api/queues/1/staff/2?forceuser=225staff')
      expect(res.statusCode).toBe(202)
      const res2 = await request(app).get('/api/queues/1/staff')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(1)
      expect(res2.body[0].user.netid).toBe('225staff')

    })
    test('should succeed for admin to add admin', async () => {
      const res = await request(app).post('/api/courses/1/queues/1/staff/1?forceuser=admin')
      expect(res.statusCode).toBe(202)
      const res2 = await request(app).get('/api/queues/1/staff')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(1)
      expect(res2.body[0].user.netid).toBe('admin')

    })
    test('should fail for a student to add student', async () => {
      const res = await request(app).post('/api/courses/1/queues/1/staff/4?forceuser=student')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
      const res2 = await request(app).get('/api/queues/1/staff')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(0)
    })
    test('should fail for a student to add admin', async () => {
      const res = await request(app).post('/api/courses/1/queues/1/staff/1?forceuser=student')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
      const res2 = await request(app).get('/api/queues/1/staff')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(0)
    })
    test('should fail for a staff of different course', async () => {
      const res = await request(app).post('/api/courses/1/queues/1/staff/3?forceuser=241staff')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
      const res2 = await request(app).get('/api/queues/1/staff')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(0)
    })
  })


  describe('DELETE /api/queues/1', () => {
    test('should succeed for course staff', async () => {
      const res = await request(app).delete('/api/queues/1?forceuser=225staff')
      expect(res.statusCode).toBe(202)
      const res2 = await request(app).get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(1)
      expect(res2.body[0].id).toBe(2)

    })
    test('should succeed for admin', async () => {
      const res = await request(app).delete('/api/queues/1?forceuser=admin')
      expect(res.statusCode).toBe(202)
      const res2 = await request(app).get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(1)
      expect(res2.body[0].id).toBe(2)

    })
    test('should fail for course staff of different course', async () => {
      const res = await request(app).delete('/api/queues/2?forceuser=225staff')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
      const res2 = await request(app).get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(2)
      expect(res2.body[0].id).toBe(1)
      expect(res2.body[1].id).toBe(2)

    })
    test('should fail for student', async () => {
      const res = await request(app).delete('/api/queues/1?forceuser=student')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
      const res2 = await request(app).get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(2)
      expect(res2.body[0].id).toBe(1)
      expect(res2.body[1].id).toBe(2)

    })

  })

  describe('DELETE /api/queues/1/staff/:userId', () => {
   test('should succeed for course staff to delete self', async () => {
      const res = await request(app).post('/api/queues/1/staff/2?forceuser=225staff')
      expect(res.statusCode).toBe(202)
      const res1 = await request(app).delete('/api/queues/1/staff/2?forceuser=225staff')
      expect(res1.statusCode).toBe(202)
      const res2 = await request(app).get('/api/queues/1/staff')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(0)

    })
    test('should succeed for admin to delete staff', async () => {
      const res = await request(app).post('/api/queues/1/staff/2?forceuser=225staff')
      expect(res.statusCode).toBe(202)
      const res1 = await request(app).delete('/api/queues/1/staff/2?forceuser=admin')
      expect(res1.statusCode).toBe(202)
      const res2 = await request(app).get('/api/queues/1/staff')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(0)

    })
    test('should fail for course staff of different course to delete staff', async () => {
      const res = await request(app).post('/api/queues/1/staff/2?forceuser=225staff')
      expect(res.statusCode).toBe(202)
      const res1 = await request(app).delete('/api/queues/1/staff/2?forceuser=241staff')
      expect(res1.statusCode).toBe(403)
      expect(res1.body).toEqual({})
      const res2 = await request(app).get('/api/queues/1/staff')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(1)
      expect(res2.body[0].user.netid).toBe('225staff')

    })
    test('should fail for student to delete staff', async () => {
      const res = await request(app).post('/api/queues/1/staff/2?forceuser=225staff')
      expect(res.statusCode).toBe(202)
      const res1 = await request(app).delete('/api/queues/1/staff/2?forceuser=student')
      expect(res1.statusCode).toBe(403)
      expect(res1.body).toEqual({})
      const res2 = await request(app).get('/api/queues/1/staff')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(1)
      expect(res2.body[0].user.netid).toBe('225staff')

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
      const res = await request(app).delete('/api/queues/1?forceuser=241staff')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
      const res2 = await request(app).get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(2)
    })

    test('should fail for student', async () => {
      const res = await request(app).delete('/api/queues/1?forceuser=student')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
      const res2 = await request(app).get('/api/queues')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(2)

    })

  })

})

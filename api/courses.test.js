/* eslint-env jest */
const request = require('supertest')
const app = require('../app')
const testutil = require('../testutil')
const { User } = require('../models')

beforeEach(async () => {
  await testutil.setupTestDb()
  await testutil.populateTestDb()
})
afterEach(() => testutil.destroyTestDb())

describe('Courses API', () => {
  test('GET /api/courses', async () => {
    const res = await request(app).get('/api/courses')
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveLength(2)
    expect(res.body[0].name).toBe('CS225')
    expect(res.body[1].name).toBe('CS241')
  })

  describe('GET /api/courses/:courseId', () => {
    test('succeeds for admin', async () => {
      const res = await request(app).get('/api/courses/2')
      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBe(2)
      expect(res.body.name).toBe('CS241')
      expect(res.body).toHaveProperty('queues')
      expect(res.body.queues).toHaveLength(1)
      expect(res.body.queues[0].id).toBe(2)
      expect(res.body.queues[0].location).toBe('There')
      expect(res.body).toHaveProperty('staff')
      expect(res.body.staff).toHaveLength(1)
      expect(res.body.staff[0].netid).toBe('241staff')
      expect(res.body.staff[0].id).toBe(4)
    })

    test('succeeds for course staff', async () => {
      const res = await request(app).get('/api/courses/2?forceuser=241staff')
      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBe(2)
      expect(res.body.name).toBe('CS241')
      expect(res.body).toHaveProperty('queues')
      expect(res.body.queues).toHaveLength(1)
      expect(res.body.queues[0].id).toBe(2)
      expect(res.body.queues[0].location).toBe('There')
      expect(res.body).toHaveProperty('staff')
      expect(res.body.staff).toHaveLength(1)
      expect(res.body.staff[0].netid).toBe('241staff')
      expect(res.body.staff[0].id).toBe(4)
    })

    test('excludes staff list for student', async () => {
      const res = await request(app).get('/api/courses/2?forceuser=student')
      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBe(2)
      expect(res.body.name).toBe('CS241')
      expect(res.body).toHaveProperty('queues')
      expect(res.body.queues).toHaveLength(1)
      expect(res.body.queues[0].id).toBe(2)
      expect(res.body.queues[0].location).toBe('There')
      expect(res.body).not.toHaveProperty('staff')
    })
  })

  describe('POST /api/courses', () => {
    test('succeeds for admin', async () => {
      const course = { name: 'CS423', shortcode: 'cs423' }
      const res = await request(app).post('/api/courses?forceuser=admin').send(course)
      expect(res.statusCode).toBe(201)
      expect(res.body.id).toBe(3)
      expect(res.body.name).toBe('CS423')
      expect(res.body.shortcode).toBe('cs423')
    })
    test('fails for missing name', async () => {
      const course = { shortcode: 'cs423' }
      const res = await request(app).post('/api/courses?forceuser=admin').send(course)
      expect(res.statusCode).toBe(422)
    })
    test('fails for missing shortcode', async () => {
      const course = { name: 'CS423' }
      const res = await request(app).post('/api/courses?forceuser=admin').send(course)
      expect(res.statusCode).toBe(422)
    })
    test('fails for non-admin', async () => {
      const course = { name: 'CS423' }
      const res = await request(app).post('/api/courses?forceuser=student').send(course)
      expect(res.statusCode).toBe(403)
    })
  })

  describe('POST /api/course/:courseId/staff', async () => {
    test('succeeds for admin', async () => {
      const newUser = { netid: 'newnetid', name: 'New Name' }
      const res = await request(app).post('/api/courses/1/staff').send(newUser)
      expect(res.statusCode).toBe(201)
    })

    test('succeeds for course staff', async () => {
      const newUser = { netid: 'newnetid' }
      const res = await request(app).post('/api/courses/1/staff?forceuser=225staff').send(newUser)
      expect(res.statusCode).toBe(201)
    })

    test('fails if netid is missing', async () => {
      const newUser = { }
      const res = await request(app).post('/api/courses/1/staff').send(newUser)
      expect(res.statusCode).toBe(422)
    })

    test('fails for course staff of different course', async () => {
      const newUser = { netid: 'newnetid' }
      const res = await request(app).post('/api/courses/1/staff?forceuser=241staff').send(newUser)
      expect(res.statusCode).toBe(403)
    })

    test('fails for student', async () => {
      const newUser = { netid: 'newnetid' }
      const res = await request(app).post('/api/courses/1/staff?forceuser=student').send(newUser)
      expect(res.statusCode).toBe(403)
    })

    test('trims "@illinois.edu" from netids', async () => {
      const newUser = { netid: 'newnetid@illinois.edu' }
      const res = await request(app).post('/api/courses/1/staff').send(newUser)
      expect(res.statusCode).toBe(201)
      const user = await User.findOne({ where: { netid: 'newnetid' } })
      expect(user).not.toBe(null)
      expect(user.netid).toBe('newnetid')
    })
  })

  describe('DELETE /api/courses/:courseId/staff/:userId', () => {
    test('succeeds for admin', async () => {
      const res = await request(app).delete('/api/courses/1/staff/3?forceuser=admin')
      expect(res.statusCode).toBe(202)
      const res2 = await request(app).get('/api/courses/1')
      expect(res2.statusCode).toBe(200)
      expect(res2.body.id).toBe(1)
      expect(res2.body.name).toBe('CS225')
      expect(res2.body).toHaveProperty('queues')
      expect(res2.body.queues).toHaveLength(1)
      expect(res2.body.queues[0].id).toBe(1)
      expect(res2.body.queues[0].location).toBe('Here')
      expect(res2.body).toHaveProperty('staff')
      expect(res2.body.staff).toHaveLength(0)
    })
    test('succeeds for course staff', async () => {
      const res = await request(app).delete('/api/courses/1/staff/3?forceuser=225staff')
      expect(res.statusCode).toBe(202)
      const res2 = await request(app).get('/api/courses/1')
      expect(res2.statusCode).toBe(200)
      expect(res2.body.id).toBe(1)
      expect(res2.body.name).toBe('CS225')
      expect(res2.body).toHaveProperty('queues')
      expect(res2.body.queues).toHaveLength(1)
      expect(res2.body.queues[0].id).toBe(1)
      expect(res2.body.queues[0].location).toBe('Here')
      expect(res2.body).toHaveProperty('staff')
      expect(res2.body.staff).toHaveLength(0)
    })
    test('fails for student', async () => {
      const res = await request(app).delete('/api/courses/1/staff/3?forceuser=student')
      expect(res.statusCode).toBe(403)
      const res2 = await request(app).get('/api/courses/1')
      expect(res2.statusCode).toBe(200)
      expect(res2.body.id).toBe(1)
      expect(res2.body.name).toBe('CS225')
      expect(res2.body).toHaveProperty('queues')
      expect(res2.body.queues).toHaveLength(1)
      expect(res2.body.queues[0].id).toBe(1)
      expect(res2.body.queues[0].location).toBe('Here')
      expect(res2.body).toHaveProperty('staff')
      expect(res2.body.staff).toHaveLength(1)
      expect(res2.body.staff[0].netid).toBe('225staff')
      expect(res2.body.staff[0].id).toBe(3)
    })
    test('fails for course staff of different course', async () => {
      const res = await request(app).delete('/api/courses/1/staff/3?forceuser=241staff')
      expect(res.statusCode).toBe(403)
      const res2 = await request(app).get('/api/courses/1')
      expect(res2.statusCode).toBe(200)
      expect(res2.body.id).toBe(1)
      expect(res2.body.name).toBe('CS225')
      expect(res2.body).toHaveProperty('queues')
      expect(res2.body.queues).toHaveLength(1)
      expect(res2.body.queues[0].id).toBe(1)
      expect(res2.body.queues[0].location).toBe('Here')
      expect(res2.body).toHaveProperty('staff')
      expect(res2.body.staff).toHaveLength(1)
      expect(res2.body.staff[0].netid).toBe('225staff')
      expect(res2.body.staff[0].id).toBe(3)
    })
  })
})

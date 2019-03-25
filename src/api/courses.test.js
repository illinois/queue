/* eslint-env jest */
// const request = require('supertest')
const app = require('../app')
const testutil = require('../../test/util')
const { requestAsUser } = require('../../test/util')
const { User } = require('../models')

beforeEach(async () => {
  await testutil.setupTestDb()
  await testutil.populateTestDb()
})
afterEach(() => testutil.destroyTestDb())

describe('Courses API', () => {
  test('GET /api/courses', async () => {
    const request = await requestAsUser(app, 'admin')
    const res = await request.get('/api/courses')
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveLength(2)
    expect(res.body[0].name).toBe('CS225')
    expect(res.body[1].name).toBe('CS241')
  })

  describe('GET /api/courses/:courseId', () => {
    test('succeeds for admin', async () => {
      const request = await requestAsUser(app, 'admin')
      const res = await request.get('/api/courses/2')
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
      const request = await requestAsUser(app, '241staff')
      const res = await request.get('/api/courses/2')
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
      expect(res.body.staff[0].name).toBe('241 Staff')
      expect(res.body.staff[0].id).toBe(4)
    })

    test('excludes staff list for student', async () => {
      const request = await requestAsUser(app, 'student')
      const res = await request.get('/api/courses/2')
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
      const request = await requestAsUser(app, 'admin')
      const res = await request.post('/api/courses').send(course)
      expect(res.statusCode).toBe(201)
      expect(res.body.id).toBe(3)
      expect(res.body.name).toBe('CS423')
      expect(res.body.shortcode).toBe('cs423')
    })
    test('fails for missing name', async () => {
      const course = { shortcode: 'cs423' }
      const request = await requestAsUser(app, 'admin')
      const res = await request.post('/api/courses').send(course)
      expect(res.statusCode).toBe(422)
    })
    test('fails for missing shortcode', async () => {
      const course = { name: 'CS423' }
      const request = await requestAsUser(app, 'admin')
      const res = await request.post('/api/courses').send(course)
      expect(res.statusCode).toBe(422)
    })
    test('fails for non-admin', async () => {
      const course = { name: 'CS423' }
      const request = await requestAsUser(app, 'student')
      const res = await request.post('/api/courses').send(course)
      expect(res.statusCode).toBe(403)
    })
  })

  describe('POST /api/course/:courseId/staff', async () => {
    test('succeeds for admin', async () => {
      const newUser = { netid: 'newnetid' }
      const request = await requestAsUser(app, 'admin')
      const res = await request.post('/api/courses/1/staff').send(newUser)
      expect(res.statusCode).toBe(201)
      expect(res.body.netid).toBe('newnetid')
    })

    test('succeeds for course staff', async () => {
      const newUser = { netid: 'newnetid' }
      const request = await requestAsUser(app, '225staff')
      const res = await request.post('/api/courses/1/staff').send(newUser)
      expect(res.statusCode).toBe(201)
      expect(res.body.netid).toBe('newnetid')
    })

    test('fails if netid is missing', async () => {
      const newUser = {}
      const request = await requestAsUser(app, 'admin')
      const res = await request.post('/api/courses/1/staff').send(newUser)
      expect(res.statusCode).toBe(422)
    })

    test('fails for course staff of different course', async () => {
      const newUser = { netid: 'newnetid' }
      const request = await requestAsUser(app, '241staff')
      const res = await request.post('/api/courses/1/staff').send(newUser)
      expect(res.statusCode).toBe(403)
    })

    test('fails for student', async () => {
      const newUser = { netid: 'newnetid' }
      const request = await requestAsUser(app, 'student')
      const res = await request.post('/api/courses/1/staff').send(newUser)
      expect(res.statusCode).toBe(403)
    })

    test('trims "@illinois.edu" from netids', async () => {
      const newUser = { netid: 'newnetid@illinois.edu' }
      const request = await requestAsUser(app, 'admin')
      const res = await request.post('/api/courses/1/staff').send(newUser)
      expect(res.statusCode).toBe(201)
      const user = await User.findOne({ where: { netid: 'newnetid' } })
      expect(user).not.toBe(null)
      expect(user.netid).toBe('newnetid')
    })

    test('trims whitespace from netid', async () => {
      const newUser = { netid: '  waf     ' }
      const request = await requestAsUser(app, 'admin')
      const res = await request.post('/api/courses/1/staff').send(newUser)
      expect(res.statusCode).toBe(201)
      expect(res.body.netid).toBe('waf')
      const user = await User.findOne({ where: { netid: 'waf' } })
      expect(user).not.toBe(null)
      expect(user.netid).toBe('waf')
    })
  })

  describe('DELETE /api/courses/:courseId/staff/:userId', () => {
    test('succeeds for admin', async () => {
      const request = await requestAsUser(app, 'admin')
      const res = await request.delete('/api/courses/1/staff/3')
      expect(res.statusCode).toBe(202)
      const res2 = await request.get('/api/courses/1')
      expect(res2.statusCode).toBe(200)
      expect(res2.body.id).toBe(1)
      expect(res2.body.name).toBe('CS225')
      expect(res2.body).toHaveProperty('queues')
      expect(res2.body).toHaveProperty('staff')
      expect(res2.body.staff).toHaveLength(0)
    })
    test('succeeds for course staff', async () => {
      const request = await requestAsUser(app, '225staff')
      const res = await request.delete('/api/courses/1/staff/3')
      expect(res.statusCode).toBe(202)
      const request2 = await requestAsUser(app, 'admin')
      const res2 = await request2.get('/api/courses/1')
      expect(res2.statusCode).toBe(200)
      expect(res2.body.id).toBe(1)
      expect(res2.body.name).toBe('CS225')
      expect(res2.body).toHaveProperty('queues')
      expect(res2.body).toHaveProperty('staff')
      expect(res2.body.staff).toHaveLength(0)
    })
    test('fails for student', async () => {
      const request = await requestAsUser(app, 'student')
      const res = await request.delete('/api/courses/1/staff/3')
      expect(res.statusCode).toBe(403)
      const request2 = await requestAsUser(app, 'admin')
      const res2 = await request2.get('/api/courses/1')
      expect(res2.statusCode).toBe(200)
      expect(res2.body.id).toBe(1)
      expect(res2.body.name).toBe('CS225')
      expect(res2.body).toHaveProperty('queues')
      expect(res2.body).toHaveProperty('staff')
      expect(res2.body.staff).toHaveLength(1)
      expect(res2.body.staff[0].netid).toBe('225staff')
      expect(res2.body.staff[0].id).toBe(3)
    })
    test('fails for course staff of different course', async () => {
      const request = await requestAsUser(app, '241staff')
      const res = await request.delete('/api/courses/1/staff/3')
      expect(res.statusCode).toBe(403)
      const request2 = await requestAsUser(app, 'admin')
      const res2 = await request2.get('/api/courses/1')
      expect(res2.statusCode).toBe(200)
      expect(res2.body.id).toBe(1)
      expect(res2.body.name).toBe('CS225')
      expect(res2.body).toHaveProperty('queues')
      expect(res2.body).toHaveProperty('staff')
      expect(res2.body.staff).toHaveLength(1)
      expect(res2.body.staff[0].netid).toBe('225staff')
      expect(res2.body.staff[0].id).toBe(3)
    })
  })
})

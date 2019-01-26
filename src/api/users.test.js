/* eslint-env jest */
// const request = require('supertest')
const app = require('../app')
const testutil = require('../../test/util')
const { requestAsUser } = require('../../test/util')

beforeAll(async () => {
  await testutil.setupTestDb()
  await testutil.populateTestDb()
})

afterAll(async () => {
  await testutil.destroyTestDb()
})

describe('Users API', () => {
  describe('GET /api/users/me', () => {
    test('returns correct user for admin', async () => {
      const request = await requestAsUser(app, 'admin')
      const res = await request.get('/api/users/me')
      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBe(2)
      expect(res.body.netid).toBe('admin')
      expect(res.body).toHaveProperty('staffAssignments')
      expect(res.body.staffAssignments).toEqual([])
    })

    test('returns correct user for 225staff user', async () => {
      const request = await requestAsUser(app, '225staff')
      const res = await request.get('/api/users/me')
      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBe(3)
      expect(res.body.netid).toBe('225staff')
      expect(res.body).toHaveProperty('staffAssignments')
      expect(res.body.staffAssignments).toHaveLength(1)
      expect(res.body.staffAssignments[0].id).toBe(1)
      expect(res.body.staffAssignments[0].name).toBe('CS225')
    })
  })

  describe('GET /api/users', () => {
    test('returns all users for admin', async () => {
      const request = await requestAsUser(app, 'admin')
      const res = await request.get('/api/users')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveLength(6)
    })

    test('returns 403 for 225staff', async () => {
      const request = await requestAsUser(app, '225staff')
      const res = await request.get('/api/users')
      expect(res.statusCode).toBe(403)
    })

    test('returns 403 for student', async () => {
      const request = await requestAsUser(app, 'student')
      const res = await request.get('/api/users')
      expect(res.statusCode).toBe(403)
    })
  })

  describe('GET /api/users/:userId', () => {
    test('succeeds for admin', async () => {
      const request = await requestAsUser(app, 'admin')
      const res = await request.get('/api/users/5')
      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBe(5)
      expect(res.body.netid).toBe('student')
    })

    test('fails for 225staff', async () => {
      const request = await requestAsUser(app, '225staff')
      const res = await request.get('/api/users/4')
      expect(res.statusCode).toBe(403)
    })

    test('fails for student', async () => {
      const request = await requestAsUser(app, 'student')
      const res = await request.get('/api/users/4')
      expect(res.statusCode).toBe(403)
    })
  })
})

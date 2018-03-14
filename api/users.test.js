/* eslint-env jest */
const request = require('supertest')
const app = require('../app')
const testutil = require('../testutil')

beforeAll(testutil.createDb)
afterAll(testutil.destroyDb)
beforeEach(testutil.resetAndPopulateDb)

describe('Users API', () => {
  describe('GET /api/users/me', () => {
    test('returns correct user for admin', async () => {
      const res = await request(app).get('/api/users/me?forceuser=admin')
      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBe(2)
      expect(res.body.netid).toBe('admin')
      expect(res.body).toHaveProperty('staffAssignments')
      expect(res.body.staffAssignments).toEqual([])
    })

    test('returns correct user for 225staff user', async () => {
      const res = await request(app).get('/api/users/me?forceuser=225staff')
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
      const res = await request(app).get('/api/users?forceuser=admin')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveLength(6)
    })

    test('returns 403 for 225staff', async () => {
      const res = await request(app).get('/api/users?forceuser=225staff')
      expect(res.statusCode).toBe(403)
    })

    test('returns 403 for student', async () => {
      const res = await request(app).get('/api/users?forceuser=student')
      expect(res.statusCode).toBe(403)
    })
  })

  describe('GET /api/users/:userId', () => {
    test('succeeds for admin', async () => {
      const res = await request(app).get('/api/users/5?forceuser=admin')
      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBe(5)
      expect(res.body.netid).toBe('student')
    })

    test('fails for 225staff', async () => {
      const res = await request(app).get('/api/users/4?forceuser=225staff')
      expect(res.statusCode).toBe(403)
    })

    test('fails for student', async () => {
      const res = await request(app).get('/api/users/4?forceuser=student')
      expect(res.statusCode).toBe(403)
    })
  })
})

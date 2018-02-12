const request = require('supertest')
const app = require('../app')
const testutil = require('../testutil')

beforeEach(async () => {
  await testutil.setupTestDb()
  await testutil.populateTestDb()
})
afterEach(() => testutil.destroyTestDb())

describe('Users API', () => {

  // Get list of all users
  describe('GET /api/users', () => {
    test('should succeed for admin', async () => {
      const res = await request(app).get('/api/users?forceuser=admin')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveLength(4)
    })

    test('should not succeed for non admin', async () => {
      const res = await request(app).get('/api/users?forceuser=student')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
    })
  })

  // Get the currently authenticated user
  describe('GET /api/users/me', () => {
    test('should succeed for admin', async () => {
      const res = await request(app).get('/api/users/me?forceuser=admin')
      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBe(1)
    })
    test('should succeed for non admin', async () => {
      const res = await request(app).get('/api/users/me?forceuser=student')
      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBe(4)
    })
  })

  // Get a specific user
  describe('GET /api/users/1', () => {
    test('should succeed for admin', async () => {
      const res = await request(app).get('/api/users/1?forceuser=admin')
      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBe(1)
    })
    test('should not succeed for non admin 1', async () => {
      const res = await request(app).get('/api/users/1?forceuser=student')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
    })
    test('should not succeed for non admin 2', async () => {
      const res = await request(app).get('/api/users/1?forceuser=225staff')
      expect(res.statusCode).toBe(403)
      expect(res.body).toEqual({})
    })
  })

})

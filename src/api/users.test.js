/* eslint-env jest */
// const request = require('supertest')
const app = require('../app')
const testutil = require('../test/util')
const { requestAsUser } = require('../test/util')

beforeEach(async () => {
  await testutil.setupTestDb()
  await testutil.populateTestDb()
})

afterEach(async () => {
  await testutil.destroyTestDb()
})

describe('Users API', () => {
  describe('GET /api/users/me', () => {
    test('returns correct user for admin', async () => {
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.get('/api/users/me')
      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBe(2)
      expect(res.body.uid).toBe('admin@illinois.edu')
      expect(res.body).toHaveProperty('staffAssignments')
      expect(res.body.staffAssignments).toEqual([])
    })

    test('returns correct user for 225staff user', async () => {
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.get('/api/users/me')
      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBe(3)
      expect(res.body.uid).toBe('225staff@illinois.edu')
      expect(res.body).toHaveProperty('staffAssignments')
      expect(res.body.staffAssignments).toHaveLength(1)
      expect(res.body.staffAssignments[0].id).toBe(1)
      expect(res.body.staffAssignments[0].name).toBe('CS225')
    })
  })

  describe('GET /api/users/admins', () => {
    test('returns correct users for admin', async () => {
      const request = await requestAsUser(app, 'dev@illinois.edu')
      const res = await request.get('/api/users/admins')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveLength(2)
      expect(res.body[0].uid).toBe('dev@illinois.edu')
      expect(res.body[1].uid).toBe('admin@illinois.edu')
    })

    test('returns 403 for 225staff', async () => {
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.get('/api/users/admins')
      expect(res.statusCode).toBe(403)
    })

    test('returns 403 for student', async () => {
      const request = await requestAsUser(app, 'student@illinois.edu')
      const res = await request.get('/api/users/admins')
      expect(res.statusCode).toBe(403)
    })
  })

  describe('PUT /api/users/admins/:userId', () => {
    test('succeeds for existing admin', async () => {
      const request = await requestAsUser(app, 'dev@illinois.edu')
      // make "225staff" an admin
      const res = await request.put('/api/users/admins/3')
      expect(res.statusCode).toBe(201)
      expect(res.body.isAdmin).toBe(true)
    })

    test('fails for non-admin', async () => {
      const request = await requestAsUser(app, '241staff@illinois.edu')
      const res = await request.put('/api/users/admins/3')
      expect(res.statusCode).toBe(403)
    })

    test('fails for student', async () => {
      const request = await requestAsUser(app, 'student@illinois.edu')
      const res = await request.put('/api/users/admins/3')
      expect(res.statusCode).toBe(403)
    })
  })

  describe('DELETE /api/users/admins/:userId', () => {
    test('succeeds for existing admin', async () => {
      const request = await requestAsUser(app, 'dev@illinois.edu')
      // make "admin" not an admin
      const res = await request.delete('/api/users/admins/2')
      expect(res.statusCode).toBe(204)
    })

    test('fails for self', async () => {
      const request = await requestAsUser(app, 'dev@illinois.edu')
      const res = await request.delete('/api/users/admins/1')
      expect(res.statusCode).toBe(403)
    })

    test('fails for non-admin', async () => {
      const request = await requestAsUser(app, '241staff@illinois.edu')
      const res = await request.delete('/api/users/admins/2')
      expect(res.statusCode).toBe(403)
    })

    test('fails for student', async () => {
      const request = await requestAsUser(app, 'student@illinois.edu')
      const res = await request.delete('/api/users/admins/2')
      expect(res.statusCode).toBe(403)
    })
  })

  describe('GET /api/users', () => {
    test('returns all users for admin', async () => {
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.get('/api/users')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveLength(6)
    })

    test('returns 403 for 225staff', async () => {
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.get('/api/users')
      expect(res.statusCode).toBe(403)
    })

    test('returns 403 for student', async () => {
      const request = await requestAsUser(app, 'student@illinois.edu')
      const res = await request.get('/api/users')
      expect(res.statusCode).toBe(403)
    })
  })

  describe('GET /api/users/:userId', () => {
    test('succeeds for admin', async () => {
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.get('/api/users/5')
      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBe(5)
      expect(res.body.uid).toBe('student@illinois.edu')
    })

    test('fails for 225staff', async () => {
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.get('/api/users/4')
      expect(res.statusCode).toBe(403)
    })

    test('fails for student', async () => {
      const request = await requestAsUser(app, 'student@illinois.edu')
      const res = await request.get('/api/users/4')
      expect(res.statusCode).toBe(403)
    })
  })
})

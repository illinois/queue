/* eslint-env jest */
const app = require('../app')
const testutil = require('../test/util')
const { requestAsUser } = require('../test/util')

beforeEach(async () => {
  await testutil.setupTestDb()
  await testutil.populateTestDb()
})

afterEach(() => testutil.destroyTestDb())

describe('Tokens API', () => {
  describe('GET /tokens', () => {
    it("returns user's own tokens", async () => {
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.get(`/api/tokens`)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveLength(1)
      expect(res.body[0]).toMatchObject({
        name: 'Admin test token',
        hash:
          '8b66be9b382176ea802a06d1be2a5e66d53fadf279a5fc40e17c6862c75d4e0f',
      })
      // Make sure token is never stored or returned
      expect(res.body[0].token).toBeUndefined()
    })

    it('excludes tokens of other users', async () => {
      const request = await requestAsUser(app, 'student@illinois.edu')
      const res = await request.get(`/api/tokens`)
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual([])
    })
  })
  describe('GET /tokens/:tokenId', () => {
    it("fails for token that doesn't exist", async () => {
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.get(`/api/tokens/1234`)
      expect(res.statusCode).toEqual(404)
    })
  })

  describe('POST /tokens', () => {
    it('creates a new token', async () => {
      const token = { name: 'my new token' }
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.post(`/api/tokens`).send(token)
      expect(res.statusCode).toBe(201)
      expect(res.body).toMatchObject({
        id: 2,
        name: 'my new token',
        token: expect.any(String),
        hash: expect.any(String),
        lastUsedAt: null,
      })

      // Check that we can now fetch the new token
      const res2 = await request.get('/api/tokens')
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toHaveLength(2)
      expect(res2.body[1].name).toBe('my new token')
    })
  })

  describe('DELETE /tokens', () => {
    it('removes a token for a user', async () => {
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.delete('/api/tokens/1')
      expect(res.statusCode).toBe(204)

      const res2 = await request.get('/api/tokens/1')
      expect(res2.statusCode).toBe(404)
    })

    it('fails for user who does not own the token', async () => {
      const request = await requestAsUser(app, 'student@illinois.edu')
      const res = await request.delete('/api/tokens/1')
      expect(res.statusCode).toBe(404)

      const adminRequest = await requestAsUser(app, 'admin@illinois.edu')
      const res2 = await adminRequest.get('/api/tokens/1')
      expect(res2.statusCode).toBe(200)
      expect(res2.body.name).toBe('Admin test token')
    })
  })
})

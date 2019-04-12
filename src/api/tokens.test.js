/* eslint-env jest */
const app = require('../app')
const testutil = require('../../test/util')
const { requestAsUser } = require('../../test/util')

beforeEach(async () => {
  await testutil.setupTestDb()
  await testutil.populateTestDb()
})

afterEach(() => testutil.destroyTestDb())

describe('Tokens API', () => {
  describe('GET /tokens', () => {
    it("returns user's own tokens", async () => {
      const request = await requestAsUser(app, 'admin')
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
      const request = await requestAsUser(app, 'student')
      const res = await request.get(`/api/tokens`)
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual([])
    })
  })
  describe('GET /tokens/:tokenId', () => {
    it("fails for token that doesn't exist", async () => {
      const request = await requestAsUser(app, 'admin')
      const res = await request.get(`/api/tokens/1234`)
      expect(res.statusCode).toEqual(404)
    })
  })

  describe('POST /tokens', () => {
    it('creates a new token', async () => {
      const token = { name: 'my new token' }
      const request = await requestAsUser(app, 'admin')
      const res = await request.post(`/api/tokens`).send(token)
      expect(res.statusCode).toBe(201)
      expect(res.body).toMatchObject({
        id: 2,
        name: 'my new token',
        token: expect.any(String),
        hash: expect.any(String),
        lastUsedAt: null,
      })
    })
  })
})

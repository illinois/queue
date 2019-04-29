/* eslint-env jest */
const app = require('../app')
const testutil = require('../test/util')
const { requestAsUser } = require('../test/util')

beforeEach(async () => {
  await testutil.setupTestDb()
  await testutil.populateTestDb()
})
afterEach(() => testutil.destroyTestDb())

describe('Autocomplete API', () => {
  it('returns all users for empty query', async () => {
    const request = await requestAsUser(app, 'admin@illinois.edu')
    const res = await request.get('/api/autocomplete/users?q=')
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveLength(6)
    expect(res.body[0]).toMatchObject({
      uid: 'dev@illinois.edu',
      isAdmin: true,
    })
  })

  it('returns specific user for partial uid', async () => {
    const request = await requestAsUser(app, 'admin@illinois.edu')
    const res = await request.get('/api/autocomplete/users?q=225')
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0]).toMatchObject({
      uid: '225staff@illinois.edu',
      name: '225 Staff',
    })
  })

  it('disallows requests from course staff', async () => {
    const request = await requestAsUser(app, '225staff@illinois.edu')
    const res = await request.get('/api/autocomplete/users?q=225')
    expect(res.statusCode).toBe(403)
  })

  it('disallows requests from student', async () => {
    const request = await requestAsUser(app, 'student@illinois.edu')
    const res = await request.get('/api/autocomplete/users?q=225')
    expect(res.statusCode).toBe(403)
  })
})

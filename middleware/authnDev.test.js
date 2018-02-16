/* eslint-env jest */
const authnDev = require('./authnDev')
const testutil = require('../testutil')

beforeEach(() => testutil.setupTestDb())
afterEach(() => testutil.destroyTestDb())

describe('authnDev middleware', () => {
  test('defaults to dev admin user', async () => {
    const req = { query: {}, session: {} }
    const res = { locals: {} }
    const next = jest.fn()
    await authnDev(req, res, next)
    expect(next).toBeCalled()
    expect(req.session).toHaveProperty('user')
    expect(req.session.user.netid).toBe('dev')
    expect(req.session.user.isAdmin).toBe(true)
    expect(res.locals).toHaveProperty('userAuthn')
    expect(res.locals.userAuthn.netid).toBe('dev')
    expect(res.locals.userAuthn.isAdmin).toBe(true)
  })

  test('reuses user from the request session', async () => {
    const user = Symbol('user')
    const req = { query: {}, session: { user } }
    const res = { locals: {} }
    const next = jest.fn()
    await authnDev(req, res, next)
    expect(next).toBeCalled()
    expect(res.locals.userAuthn).toBe(user)
  })

  test('can override user with forceuser query param', async () => {
    const req = { query: { forceuser: 'testuser' }, session: {} }
    const res = { locals: {} }
    const next = jest.fn()
    await authnDev(req, res, next)
    expect(next).toBeCalled()
    expect(req.session).toHaveProperty('user')
    expect(req.session.user.netid).toBe('testuser')
    expect(req.session.user.isAdmin).toBe(false)
    expect(res.locals).toHaveProperty('userAuthn')
    expect(res.locals.userAuthn.netid).toBe('testuser')
    expect(res.locals.userAuthn.isAdmin).toBe(false)
  })
})

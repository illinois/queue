/* eslint-env jest */
const authn = require('./authn').express
const testutil = require('../testutil')
const { User } = require('../models')

beforeEach(async () => {
  await testutil.setupTestDb()
  await testutil.populateTestDb()
})
afterEach(() => testutil.destroyTestDb())

const makeReq = (eppn, displayName) => {
  const get = jest.fn()
  get.mockImplementation(header => {
    switch (header) {
      case 'eppn':
        return eppn
      case 'displayname':
        return displayName
      default:
        return undefined
    }
  })
  return { get }
}

const makeRes = () => {
  const status = jest.fn()
  const send = jest.fn()
  status.mockReturnValue({ send })
  const res = {
    status,
    locals: {},
  }
  return { res, status, send }
}

describe('authn', () => {
  test('creates a new user if one does not yet exist', async () => {
    const req = makeReq('myrandomnetid@illinois.edu')
    const { res, status } = makeRes()
    const next = jest.fn()
    await authn(req, res, next)
    expect(status).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
    expect(res.locals).toHaveProperty('userAuthn')
    expect(res.locals.userAuthn.netid).toBe('myrandomnetid')
    expect(res.locals.userAuthn.isAdmin).toBe(false)

    // Verify that new user is actually persisted in the database
    const user = await User.findOne({ where: { netid: 'myrandomnetid' } })
    expect(user).not.toBe(null)
    expect(user.netid).toBe('myrandomnetid')
  })

  test('retrieves user for given netid', async () => {
    const req = makeReq('admin@illinois.edu')
    const { res, status } = makeRes()
    const next = jest.fn()
    await authn(req, res, next)
    expect(status).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
    expect(res.locals).toHaveProperty('userAuthn')
    expect(res.locals.userAuthn.netid).toBe('admin')
    expect(res.locals.userAuthn.isAdmin).toBe(true)
  })

  test('updates name given a displayname header', async () => {
    const name = 'My Cool New Name'
    const req = makeReq('admin@illinois.edu', name)
    const { res, status } = makeRes()
    const next = jest.fn()
    await authn(req, res, next)
    expect(status).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
    expect(res.locals).toHaveProperty('userAuthn')
    expect(res.locals.userAuthn.netid).toBe('admin')
    expect(res.locals.userAuthn.universityName).toBe(name)
    expect(res.locals.userAuthn.isAdmin).toBe(true)

    // Verify the change was actually persisted in the database
    const user = await User.findOne({ where: { netid: 'admin' } })
    expect(user.name).toBe(name)
  })

  test('rejects request if no eppn header is missing', async () => {
    const req = makeReq(undefined)
    const { res, status, send } = makeRes()
    const next = jest.fn()
    await authn(req, res, next)
    expect(req.get).toHaveBeenCalledWith('eppn')
    expect(status).toHaveBeenCalledWith(400)
    expect(send).toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
  })

  test('rejects request if no eppn header is invalid', async () => {
    const req = makeReq('thisisnotvalid')
    const { res, status, send } = makeRes()
    const next = jest.fn()
    await authn(req, res, next)
    expect(req.get).toHaveBeenCalledWith('eppn')
    expect(status).toHaveBeenCalledWith(400)
    expect(send).toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
  })
})

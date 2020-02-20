/* eslint-env jest */
const redirectIfNeedsAuthn = require('./redirectIfNeedsAuthn')
const { addJwtCookie } = require('../auth/util')
const testutil = require('../test/util')

beforeAll(async () => {
  await testutil.setupTestDb()
  await testutil.populateTestDb()
})

afterAll(async () => {
  await testutil.destroyTestDb()
})

const makeArgs = path => {
  const req = {
    path,
    cookies: {},
    secure: true,
  }

  const res = {
    redirect: jest.fn(),
    cookie(name, value) {
      req.cookies[name] = value
    },
  }

  const next = jest.fn()

  return { req, res, next }
}

describe('redirectIfNeedsAuthn middleware', () => {
  test('does nothing for unprotected routes', async () => {
    const { req, res, next } = makeArgs('/login')
    await redirectIfNeedsAuthn(req, res, next)
    expect(next).toBeCalled()
    expect(res.redirect).not.toBeCalled()
  })

  test("doesn't add an explicit redirect for the index route", async () => {
    const { req, res, next } = makeArgs('/')
    await redirectIfNeedsAuthn(req, res, next)
    expect(next).not.toBeCalled()
    expect(res.redirect).toBeCalledWith('/login')
  })

  test('adds redirect query parameter for unauthenticated users', async () => {
    const { req, res, next } = makeArgs('/queue/1')
    await redirectIfNeedsAuthn(req, res, next)
    expect(next).not.toBeCalled()
    expect(res.redirect).toBeCalledWith('/login?redirect=/queue/1')
  })

  test('does nothing for authenticated users', async () => {
    const { req, res, next } = makeArgs('/queue/1')

    addJwtCookie(req, res, {
      uid: 'student@illinois.edu',
    })
    await redirectIfNeedsAuthn(req, res, next)
    expect(next).toBeCalled()
    expect(res.redirect).not.toBeCalled()
  })
})

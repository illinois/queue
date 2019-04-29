/* eslint-env jest */
const authnToken = require('./authnToken')
const testutil = require('../test/util')

beforeAll(async () => {
  await testutil.setupTestDb()
  await testutil.populateTestDb()
})

afterAll(async () => {
  await testutil.destroyTestDb()
})

describe('authnToken middleware', () => {
  it('succeeds for a valid token as a query parameter', async () => {
    const req = {
      query: {
        // eslint-disable-next-line
        private_token: testutil.TOKEN,
      },
    }
    const res = { locals: {} }
    const next = jest.fn()
    await authnToken(req, res, next)
    expect(next).toBeCalledWith()
    expect(res.locals.userAuthn).toBeDefined()
    expect(res.locals.userAuthn.uid).toBe('admin@illinois.edu')
  })

  it('succeeds for a valid token as a header', async () => {
    const req = {
      query: {},
      header: jest.fn(headerName => {
        if (headerName === 'Private-Token') {
          return testutil.TOKEN
        }
        return null
      }),
    }
    const res = { locals: {} }
    const next = jest.fn()
    await authnToken(req, res, next)
    expect(next).toBeCalledWith()
    expect(res.locals.userAuthn).toBeDefined()
    expect(res.locals.userAuthn.uid).toBe('admin@illinois.edu')
  })

  it('fails for an invalid token', async () => {
    const req = {
      query: {
        // eslint-disable-next-line
        private_token: `${testutil.TOKEN}bad`,
      },
    }
    const res = { locals: {} }
    const next = jest.fn()
    await authnToken(req, res, next)
    testutil.expectNextCalledWithApiError(next, 401)
  })

  it('does nothing if no token is provided', async () => {
    const req = {
      query: {},
      header: jest.fn(),
    }
    const res = {
      locals: {},
    }
    const next = jest.fn()
    await authnToken(req, res, next)
    expect(next).toBeCalledWith()
  })

  it('does nothing if user has authenticated with another means', async () => {
    const res = {
      locals: {
        userAuthn: {},
      },
    }
    const next = jest.fn()
    await authnToken(null, res, next)
    expect(next).toBeCalledWith()
  })
})

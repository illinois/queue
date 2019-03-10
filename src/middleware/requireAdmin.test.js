/* eslint-env jest */
const testutil = require('../../test/util')
const requireAdmin = require('./requireAdmin')

const makeRes = isAdmin => ({
  locals: {
    userAuthz: {
      isAdmin,
    },
  },
})

describe('requireAdmin middleware', () => {
  test('responds with 403 for non-admin user', () => {
    const res = makeRes(false)
    const next = jest.fn()
    requireAdmin(null, res, next)
    testutil.expectNextCalledWithApiError(next, 403)
  })

  test('proceeds for admin user', () => {
    const res = makeRes(true)
    const next = jest.fn()
    requireAdmin(null, res, next)
    expect(next).toBeCalledWith()
  })
})

/* eslint-env jest */
const requireAdmin = require('./requireAdmin')

function makeRes(isAdmin) {
  const status = jest.fn()
  const send = jest.fn()
  status.mockReturnValue({ send })
  const res = {
    locals: {
      userAuthz: {
        isAdmin,
      },
    },
    status,
  }

  return { res, status, send }
}

describe('requireAdmin middleware', () => {
  test('responds with 403 for non-admin user', () => {
    const { res, status, send } = makeRes(false)
    const next = jest.fn()
    requireAdmin(null, res, next)
    expect(status).toBeCalledWith(403)
    expect(send).toBeCalled()
    expect(next).not.toBeCalled()
  })

  test('proceeds for admin user', () => {
    const { res } = makeRes(true)
    const next = jest.fn()
    requireAdmin(null, res, next)
    expect(next).toBeCalled()
  })
})

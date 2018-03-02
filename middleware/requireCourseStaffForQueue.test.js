/* eslint-env jest */
const requireCourseStaffForQueue = require('./requireCourseStaffForQueue')
const testutil = require('../testutil')

beforeAll(testutil.createDb)
afterAll(testutil.destroyDb)
beforeEach(testutil.resetAndPopulateDb)

const makeReq = queueId => ({
  params: {
    queueId,
  },
})

function makeRes(staffedCourseIds) {
  const status = jest.fn()
  const send = jest.fn()
  status.mockReturnValue({ send })
  const res = {
    locals: {
      userAuthz: {
        isAdmin: false,
        staffedCourseIds,
      },
    },
    status,
  }

  return { res, status, send }
}

describe('requireCourseStaffForQueue middleware', () => {
  test('responds with 403 for non-course staff user', async () => {
    const req = makeReq('1')
    const { res, status, send } = makeRes([])
    const next = jest.fn()
    await requireCourseStaffForQueue(req, res, next)
    expect(status).toBeCalledWith(403)
    expect(send).toBeCalled()
    expect(next).not.toBeCalled()
  })

  test('responds with 403 for coures staff of a different course', async () => {
    const req = makeReq('1')
    const { res, status, send } = makeRes([2])
    const next = jest.fn()
    await requireCourseStaffForQueue(req, res, next)
    expect(status).toBeCalledWith(403)
    expect(send).toBeCalled()
    expect(next).not.toBeCalled()
  })

  test('proceeds for coures staff user', async () => {
    const req = makeReq('1')
    const { res } = makeRes([1])
    const next = jest.fn()
    await requireCourseStaffForQueue(req, res, next)
    expect(next).toBeCalled()
  })

  test('gracefully handles reference to nonexistant queue', async () => {
    const req = makeReq('69')
    const { res, status, send } = makeRes([1])
    const next = jest.fn()
    await requireCourseStaffForQueue(req, res, next)
    expect(status).toBeCalledWith(404)
    expect(send).toBeCalled()
    expect(next).not.toBeCalled()
  })

  test('returns 500 status if queueId is missing', async () => {
    const req = makeReq(undefined)
    const { res, status, send } = makeRes([1])
    const next = jest.fn()
    await requireCourseStaffForQueue(req, res, next)
    expect(status).toBeCalledWith(500)
    expect(send).toBeCalled()
    expect(next).not.toBeCalled()
  })

  test('returns 500 status if queueId is invalid', async () => {
    const req = makeReq('hello')
    const { res, status, send } = makeRes([1])
    const next = jest.fn()
    await requireCourseStaffForQueue(req, res, next)
    expect(status).toBeCalledWith(500)
    expect(send).toBeCalled()
    expect(next).not.toBeCalled()
  })
})

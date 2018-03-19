/* eslint-env jest */
const requireCourseStaffForQueueForQuestion = require('./requireCourseStaffForQueueForQuestion')
const testutil = require('../../test/util')

beforeAll(async () => {
  await testutil.setupTestDb()
  await testutil.populateTestDb()
})

afterAll(() => testutil.destroyTestDb())

const makeReq = questionId => ({
  params: {
    questionId,
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

describe('requireCourseStaffForQueueForQuestion middleware', () => {
  test('responds with 403 for non-course staff user', async () => {
    const req = makeReq('1')
    const { res, status, send } = makeRes([])
    const next = jest.fn()
    await requireCourseStaffForQueueForQuestion(req, res, next)
    expect(status).toBeCalledWith(403)
    expect(send).toBeCalled()
    expect(next).not.toBeCalled()
  })

  test('responds with 403 for coures staff of a different course', async () => {
    const req = makeReq('2')
    const { res, status, send } = makeRes([2])
    const next = jest.fn()
    await requireCourseStaffForQueueForQuestion(req, res, next)
    expect(status).toBeCalledWith(403)
    expect(send).toBeCalled()
    expect(next).not.toBeCalled()
  })

  test('proceeds for coures staff user', async () => {
    const req = makeReq('1')
    const { res } = makeRes([1])
    const next = jest.fn()
    await requireCourseStaffForQueueForQuestion(req, res, next)
    expect(next).toBeCalled()
  })

  test('gracefully handles reference to nonexistant question', async () => {
    const req = makeReq('69')
    const { res, status, send } = makeRes([1])
    const next = jest.fn()
    await requireCourseStaffForQueueForQuestion(req, res, next)
    expect(status).toBeCalledWith(404)
    expect(send).toBeCalled()
    expect(next).not.toBeCalled()
  })

  test('returns 500 status if questionId is missing', async () => {
    const req = makeReq(undefined)
    const { res, status, send } = makeRes([1])
    const next = jest.fn()
    await requireCourseStaffForQueueForQuestion(req, res, next)
    expect(status).toBeCalledWith(500)
    expect(send).toBeCalled()
    expect(next).not.toBeCalled()
  })

  test('returns 500 status if questionId is invalid', async () => {
    const req = makeReq('hello')
    const { res, status, send } = makeRes([1])
    const next = jest.fn()
    await requireCourseStaffForQueueForQuestion(req, res, next)
    expect(status).toBeCalledWith(500)
    expect(send).toBeCalled()
    expect(next).not.toBeCalled()
  })
})

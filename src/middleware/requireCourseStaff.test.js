/* eslint-env jest */
const testutil = require('../test/util')
const requireCourseStaff = require('./requireCourseStaff')

const makeReq = courseId => ({
  params: {
    courseId,
  },
})

const makeRes = isCourseStaff => ({
  locals: {
    userAuthz: {
      staffedCourseIds: isCourseStaff ? [1] : [],
    },
  },
})

describe('requireCourseStaff middleware', () => {
  test('responds with 403 for non-course staff user', () => {
    const req = makeReq('1')
    const res = makeRes(false)
    const next = jest.fn()
    requireCourseStaff(req, res, next)
    testutil.expectNextCalledWithApiError(next, 403)
  })

  test('proceeds for coures staff user', () => {
    const req = makeReq('1')
    const res = makeRes(true)
    const next = jest.fn()
    requireCourseStaff(req, res, next)
    expect(next).toBeCalled()
  })

  test('returns 400 status if queueId is invalid', async () => {
    const req = makeReq('hello')
    const res = makeRes([1])
    const next = jest.fn()
    await requireCourseStaff(req, res, next)
    testutil.expectNextCalledWithApiError(next, 400)
  })
})

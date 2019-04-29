/* eslint-env jest */
const requireCourseStaffForQueueForQuestion = require('./requireCourseStaffForQueueForQuestion')
const testutil = require('../test/util')

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

const makeRes = staffedCourseIds => ({
  locals: {
    userAuthz: {
      isAdmin: false,
      staffedCourseIds,
    },
  },
})

describe('requireCourseStaffForQueueForQuestion middleware', () => {
  test('responds with 403 for non-course staff user', async () => {
    const req = makeReq('1')
    const res = makeRes([])
    const next = jest.fn()
    await requireCourseStaffForQueueForQuestion(req, res, next)
    testutil.expectNextCalledWithApiError(next, 403)
  })

  test('responds with 403 for coures staff of a different course', async () => {
    const req = makeReq('2')
    const res = makeRes([2])
    const next = jest.fn()
    await requireCourseStaffForQueueForQuestion(req, res, next)
    testutil.expectNextCalledWithApiError(next, 403)
  })

  test('proceeds for coures staff user', async () => {
    const req = makeReq('1')
    const res = makeRes([1])
    const next = jest.fn()
    await requireCourseStaffForQueueForQuestion(req, res, next)
    expect(next).toBeCalledWith()
  })

  test('gracefully handles reference to nonexistant question', async () => {
    const req = makeReq('69')
    const res = makeRes([1])
    const next = jest.fn()
    await requireCourseStaffForQueueForQuestion(req, res, next)
    testutil.expectNextCalledWithApiError(next, 404)
  })

  test('returns 500 status if questionId is missing', async () => {
    const req = makeReq(undefined)
    const res = makeRes([1])
    const next = jest.fn()
    await requireCourseStaffForQueueForQuestion(req, res, next)
    testutil.expectNextCalledWithApiError(next, 400)
  })

  test('returns 500 status if questionId is invalid', async () => {
    const req = makeReq('hello')
    const res = makeRes([1])
    const next = jest.fn()
    await requireCourseStaffForQueueForQuestion(req, res, next)
    testutil.expectNextCalledWithApiError(next, 400)
  })
})

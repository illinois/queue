/* eslint-env jest */
const testutil = require('../../test/util')
const util = require('./util')

beforeAll(async () => {
  await testutil.setupTestDb()
  await testutil.populateTestDb()
})

afterAll(async () => {
  await testutil.destroyTestDb()
})

const makeRes = () => ({
  locals: {},
})

describe('Testing Utils', () => {
  describe('findPropertyInRequest', () => {
    test('finds a property in the body', () => {
      const req = {
        body: {},
        params: {
          property: 'a',
        },
      }
      const res = util.findPropertyInRequest(req, 'property')
      expect(res).toBe('a')
    })
    test('finds a property in the body', () => {
      const req = {
        body: {
          property: 'a',
        },
        params: {},
      }
      const res = util.findPropertyInRequest(req, 'property')
      expect(res).toBe('a')
    })
  })

  describe('requireModel', () => {
    const makeReq = courseId => ({
      params: {
        courseId,
      },
      body: {},
    })

    test('succeeds for a model that exists', async () => {
      const req = makeReq('1')
      const res = makeRes()
      const next = jest.fn()
      await util.requireCourse(req, res, next)
      expect(next).toBeCalledWith()
      expect(res.locals).toHaveProperty('course')
      expect(res.locals.course.id).toBe(1)
    })

    test('fails with 422 if model id not present in request', async () => {
      const req = makeReq(undefined)
      const res = makeRes()
      const next = jest.fn()
      await util.requireCourse(req, res, next)
      testutil.expectNextCalledWithApiError(next, 422)
    })

    test('fails with 404 if model does not exist', async () => {
      const req = makeReq('50')
      const res = makeRes()
      const next = jest.fn()
      await util.requireCourse(req, res, next)
      testutil.expectNextCalledWithApiError(next, 404)
    })

    test('fails with 400 if model id is not an integer', async () => {
      const req = makeReq('hello')
      const res = makeRes()
      const next = jest.fn()
      await util.requireCourse(req, res, next)
      testutil.expectNextCalledWithApiError(next, 400)
    })
  })

  describe('requireModelForModel', () => {
    test('succeeds for a model that exists', async () => {
      const res = makeRes()
      res.locals.question = {
        queueId: 1,
      }
      const next = jest.fn()
      await util.requireQueueForQuestion(null, res, next)
      expect(next).toHaveBeenCalledWith()
      expect(res.locals).toHaveProperty('queue')
      expect(res.locals.queue.id).toBe(1)
    })

    test('fails with 404 if model does not exist', async () => {
      const res = makeRes()
      res.locals.question = {
        queueId: 12345,
      }
      const next = jest.fn()
      await util.requireQueueForQuestion(null, res, next)
      testutil.expectNextCalledWithApiError(next, 404)
    })
  })

  describe('isUserStudent', () => {
    test('returns false for an admin', () => {
      const userAuthz = {
        isAdmin: true,
        staffedCourseIds: [],
      }
      const value = util.isUserStudent(userAuthz, 123)
      expect(value).toBeFalsy()
    })

    test('returns false for course staff', () => {
      const userAuthz = {
        isAdmin: false,
        staffedCourseIds: [123],
      }
      const value = util.isUserStudent(userAuthz, 123)
      expect(value).toBeFalsy()
    })

    test('returns true for non-admin, non-course staff', () => {
      const userAuthz = {
        isAdmin: false,
        staffedCourseIds: [],
      }
      const value = util.isUserStudent(userAuthz, 123)
      expect(value).toBeTruthy()
    })
  })

  describe('filterConfidentialQueueQuestionsForUser', () => {
    test('removes question info from other users', () => {
      const questions = [
        {
          id: 10,
          askedById: 321,
          name: 'Secret',
        },
        {
          id: 11,
          askedById: 123,
          name: 'Not a Secret',
        },
        {
          id: 12,
          askedById: 456,
          name: 'Also a Secret',
        },
      ]
      const result = util.filterConfidentialQueueQuestionsForUser(
        123,
        questions
      )
      expect(result).toHaveLength(3)
      expect(result[0]).toEqual({ id: 10 })
      expect(result[1]).toEqual(questions[1])
      expect(result[2]).toEqual({ id: 12 })
    })
  })
})

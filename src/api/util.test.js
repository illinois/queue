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

function makeRes() {
  const status = jest.fn()
  const send = jest.fn()
  status.mockReturnValue({ send })
  const res = {
    locals: {},
    status,
  }

  return { res, status, send }
}

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
      const { res, status, send } = makeRes()
      const next = jest.fn()
      await util.requireCourse(req, res, next)
      expect(next).toBeCalled()
      expect(res.locals).toHaveProperty('course')
      expect(res.locals.course.id).toBe(1)
      expect(status).not.toBeCalled()
      expect(send).not.toBeCalled()
    })

    test('fails with 422 if model id not present in request', async () => {
      const req = makeReq(undefined)
      const { res, status, send } = makeRes()
      const next = jest.fn()
      await util.requireCourse(req, res, next)
      expect(next).not.toBeCalled()
      expect(status).toBeCalledWith(422)
      expect(send).toBeCalled()
    })

    test('fails with 404 if model does not exist', async () => {
      const req = makeReq('50')
      const { res, status, send } = makeRes()
      const next = jest.fn()
      await util.requireCourse(req, res, next)
      expect(next).not.toBeCalled()
      expect(status).toBeCalledWith(404)
      expect(send).toBeCalled()
    })

    test('fails with 400 if model id is not an integer', async () => {
      const req = makeReq('hello')
      const { res, status, send } = makeRes()
      const next = jest.fn()
      await util.requireCourse(req, res, next)
      expect(next).not.toBeCalled()
      expect(status).toBeCalledWith(400)
      expect(send).toBeCalled()
    })
  })

  describe('requireModelForModel', () => {
    test('succeeds for a model that exists', async () => {
      const { res, status, send } = makeRes()
      res.locals.question = {
        queueId: 1,
      }
      const next = jest.fn()
      await util.requireQueueForQuestion(null, res, next)
      expect(next).toBeCalled()
      expect(status).not.toBeCalled()
      expect(send).not.toBeCalled()
      expect(res.locals).toHaveProperty('queue')
      expect(res.locals.queue.id).toBe(1)
    })

    test('fails with 404 if model does not exist', async () => {
      const { res, status, send } = makeRes()
      res.locals.question = {
        queueId: 12345,
      }
      const next = jest.fn()
      await util.requireQueueForQuestion(null, res, next)
      expect(next).not.toBeCalled()
      expect(status).toBeCalledWith(404)
      expect(send).toBeCalled()
    })
  })

  describe('canUserSeeQuestionDetailsForConfidentialQueue', () => {
    test('returns true for an admin', () => {
      const userAuthz = {
        isAdmin: true,
        staffedCourseIds: [],
      }
      const value = util.canUserSeeQuestionDetailsForConfidentialQueue(
        userAuthz,
        123
      )
      expect(value).toBeTruthy()
    })

    test('returns true for course staff', () => {
      const userAuthz = {
        isAdmin: false,
        staffedCourseIds: [123],
      }
      const value = util.canUserSeeQuestionDetailsForConfidentialQueue(
        userAuthz,
        123
      )
      expect(value).toBeTruthy()
    })

    test('returns false for non-admin, non-course staff', () => {
      const userAuthz = {
        isAdmin: false,
        staffedCourseIds: [],
      }
      const value = util.canUserSeeQuestionDetailsForConfidentialQueue(
        userAuthz,
        123
      )
      expect(value).toBeFalsy()
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

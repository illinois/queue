/* eslint-env jest */
const requireCourseStaff = require('./requireCourseStaff')

const makeReq = courseId => ({
  params: {
    courseId,
  },
})

function makeRes(isCourseStaff) {
  const status = jest.fn()
  const send = jest.fn()
  status.mockReturnValue({ send })
  const res = {
    locals: {
      userAuthz: {
        staffedCourseIds: isCourseStaff ? [1] : [],
      },
    },
    status,
  }

  return { res, status, send }
}

describe('requireCourseStaff middleware', () => {
  test('responds with 403 for non-course staff user', () => {
    const req = makeReq('1')
    const { res, status, send } = makeRes(false)
    const next = jest.fn()
    requireCourseStaff(req, res, next)
    expect(status).toBeCalledWith(403)
    expect(send).toBeCalled()
    expect(next).not.toBeCalled()
  })

  test('proceeds for coures staff user', () => {
    const req = makeReq('1')
    const { res } = makeRes(true)
    const next = jest.fn()
    requireCourseStaff(req, res, next)
    expect(next).toBeCalled()
  })

  test('returns 500 status if queueId is invalid', async () => {
    const req = makeReq('hello')
    const { res, status, send } = makeRes([1])
    const next = jest.fn()
    await requireCourseStaff(req, res, next)
    expect(status).toBeCalledWith(500)
    expect(send).toBeCalled()
    expect(next).not.toBeCalled()
  })
})

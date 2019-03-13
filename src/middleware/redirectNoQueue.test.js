/* eslint-env jest */
const redirectNoQueue = require('./redirectNoQueue')
const testutil = require('../../test/util')
const { Queue } = require('../models')

beforeEach(async () => {
  await testutil.setupTestDb()
  await testutil.populateTestDb()
})
afterEach(() => testutil.destroyTestDb())

const makeArgs = queueId => {
  const req = {
    params: {
      queueId,
    },
  }

  const res = {
    redirect: jest.fn(),
  }

  const next = jest.fn()

  return { req, res, next }
}

describe('redirectNoQueue middleware', () => {
  test('redirects to homepage if queue never existed', async () => {
    const { req, res, next } = makeArgs(1234)
    await redirectNoQueue(req, res, next)
    expect(res.redirect).toBeCalledWith('/')
    expect(next).not.toBeCalled()
  })

  test('redirects to course page if 2+ active queues', async () => {
    // Make a few new queues for 225 and delete the original one
    await Queue.bulkCreate([
      { name: 'CS225 Queue #2', courseId: 1 },
      { name: 'CS225 Queue #3', courseId: 1 },
    ])
    await Queue.destroy({ where: { id: 1 } })
    const { req, res, next } = makeArgs(1)
    await redirectNoQueue(req, res, next)
    expect(res.redirect).toBeCalledWith('/course/1')
    expect(next).not.toBeCalled()
  })

  test('redirects to active queue if only one exists', async () => {
    // Make a few new queues for 241 and delete the original one
    await Queue.bulkCreate([{ name: 'CS225 Queue #2', courseId: 2 }])
    await Queue.destroy({ where: { id: 2 } })
    const { req, res, next } = makeArgs(2)
    await redirectNoQueue(req, res, next)
    expect(res.redirect).toBeCalledWith('/queue/6')
    expect(next).not.toBeCalled()
  })

  test('does nothing if requested queue is open', async () => {
    const { req, res, next } = makeArgs(1)
    await redirectNoQueue(req, res, next)
    expect(res.redirect).not.toBeCalled()
    expect(next).toBeCalled()
  })
})

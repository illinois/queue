/* eslint-env jest */
const safeAsync = require('./safeAsync')

describe('safeAsync wrapper', () => {
  test('returns a function that is waitable', async () => {
    let done = false
    await safeAsync(async () => {
      return new Promise(resolve =>
        setTimeout(() => {
          done = true
          resolve()
        }, 1000)
      )
    })()
    expect(done).toBeTruthy()
  })
})

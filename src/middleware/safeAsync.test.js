/* eslint-env jest */
const safeAsync = require('./safeAsync')

describe('safeAsync wrapper', () => {
  test('returns a function that is waitable', async () => {
    let c1 = false
    let c2 = false
    await safeAsync(async () => {
      await new Promise(resolve =>
        setTimeout(() => {
          c2 = true
          resolve()
        }, 1000)
      )
    })()
    c1 = true
    expect(c1 && c2).toBeTruthy()
  })
})

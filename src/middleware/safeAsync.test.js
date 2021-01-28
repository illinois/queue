/* eslint-env jest */
import safeAsync from './safeAsync'

describe('safeAsync wrapper', () => {
  test('returns a Promise', async () => {
    let c1 = false
    let c2 = false
    await safeAsync(async () => {
      await new Promise(resolve =>
        setTimeout(() => {
          c2 = true
          resolve()
        }, 100)
      )
    })()
    c1 = true
    expect(c1 && c2).toBeTruthy()
  })
})

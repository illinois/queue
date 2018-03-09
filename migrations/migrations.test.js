/* eslint-env jest */
const migrations = require('./index')

describe('Database migrations', () => {
  test('Running all migrations in sequence produces the correct database', async () => {
    // If databases are different, diffCommands will contain a non-empty
    // string describing the necessary migrations
    const diffCommands = await migrations.verifyMigrations()
    if (diffCommands !== '') {
      throw new Error(
        `Databases are not the same! The following migrations should be applied: \n\n${diffCommands}`
      )
    }
  })
})

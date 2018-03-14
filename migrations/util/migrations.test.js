/* eslint-env jest */
const migrations = require('./index')

describe('Database migrations', () => {
  test('Running all migrations in sequence produces the correct database', async () => {
    // If databases are different, diffCommands will contain a non-empty
    // string describing the necessary migrations
    const diff = await migrations.verifyMigrations()
    if (diff) {
      const sequelizeSchema = JSON.stringify(diff.sequelizeSchema, null, 2)
      const migrationSchema = JSON.stringify(diff.migrationSchema, null, 2)
      console.log(`Sequelize schema:\n\n${sequelizeSchema}`)
      console.log(`Migration schema:\n\n${migrationSchema}`)
      throw new Error(
        `Databases are not the same! The following migrations should be applied: \n\n${diff.diff}`
      )
    }
  })
})

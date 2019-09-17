const Umzug = require('umzug')
const Sequelize = require('sequelize')
const mysql = require('mysql2/promise')
const path = require('path')

const { logger } = require('../../util/logger')
const models = require('../../models')

/**
 * Executes all pending migrations.
 * @return {Promise} A promise that resolves when all migrations are complete
 */
module.exports.performMigrations = async sequelize => {
  logger.info('Running migrations...')
  const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
      sequelize,
    },
    migrations: {
      path: path.resolve(__dirname, '..'),
      params: [sequelize.getQueryInterface(), Sequelize],
    },
  })

  const migrations = await umzug.up()
  migrations.forEach((migration, i) => logger.info(`${i}. ${migration.file}`))
  logger.info(`Ran ${migrations.length} migrations`)
}

/**
 * Verifies that the tables created by Sequelize match the tables created by
 * our migration.
 * @return {Promise} A promise that resolves with the diff when the comparisons are complete
 */
module.exports.createVerificationDatabases = async () => {
  // We'll skirt around Sequelize for a hot minute and do some manual setup
  const testConnection = await mysql.createConnection({
    host: 'localhost',
    user: 'queue',
    charset: 'UTF8MB4_GENERAL_CI',
  })

  // Create test databases to create our test tables in
  await testConnection.query('DROP DATABASE IF EXISTS `queue_sequelize`;')
  await testConnection.query('DROP DATABASE IF EXISTS `queue_migrations`;')
  await testConnection.query('CREATE DATABASE `queue_sequelize`')
  await testConnection.query('CREATE DATABASE `queue_migrations`')

  const sequelizeUri = 'mysql://queue@localhost/queue_sequelize'
  const migrationUri = 'mysql://queue@localhost/queue_migrations'

  const syncedSequelize = new Sequelize(sequelizeUri, {
    operatorsAliases: false,
    dialectOptions: {
      multipleStatements: true,
    },
    logging: false,
  })
  const migrationSequelize = new Sequelize(migrationUri, {
    operatorsAliases: false,
    dialectOptions: {
      multipleStatements: true,
    },
    logging: false,
  })

  // Run migrations on the appropriate database
  await module.exports.performMigrations(migrationSequelize)

  // Run the Sequelize "sync" on the other database
  models.initSequelize(syncedSequelize)
  await syncedSequelize.sync({ force: true })

  // Delete the migrations metadata table before diffing
  await migrationSequelize.getQueryInterface().dropTable('SequelizeMeta')

  testConnection.close()
  syncedSequelize.close()
  migrationSequelize.close()
}

module.exports.destroyVerificationDatabases = async () => {
  // We'll skirt around Sequelize for a hot minute and do some manual setup
  const testConnection = await mysql.createConnection({
    host: 'localhost',
    user: 'queue',
    charset: 'UTF8MB4_GENERAL_CI',
  })

  // Cleanup time!
  await testConnection.query('DROP DATABASE IF EXISTS `queue_sequelize`;')
  await testConnection.query('DROP DATABASE IF EXISTS `queue_migrations`;')

  testConnection.close()
}

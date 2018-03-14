const Umzug = require('umzug')
const Sequelize = require('sequelize')
const mysql = require('mysql2/promise')
const DBDiff = require('dbdiff/dbdiff')

const models = require('../../models')

/**
 * Executes all pending migrations.
 * @return {Promise} A promise that resolves when all migrations are complete
 */
module.exports.performMigrations = async sequelize => {
  const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
      sequelize,
    },
    migrations: {
      params: [sequelize.getQueryInterface(), Sequelize],
    },
  })

  await umzug.up()
}

/**
 * Verifies that the tables created by Sequelize match the tables created by
 * our migration.
 * @return {Promise} A promise that resolves with the diff when the comparisons are complete
 */
module.exports.verifyMigrations = async () => {
  // We'll skirt around Sequelize for a hot minute and do some manual setup
  const testConnection = await mysql.createConnection({
    host: 'localhost',
    user: 'queue',
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

  // Perform the diff!
  const diff = new DBDiff()
  await diff.compare(migrationUri, sequelizeUri)

  // Clean up, now that we're done
  await testConnection.query('DROP DATABASE IF EXISTS `queue_sequelize`;')
  await testConnection.query('DROP DATABASE IF EXISTS `queue_migrations`;')

  const diffString = diff.commands('drop')
  if (!diffString) {
    return null
  }

  return {
    diff: diffString,
    sequelizeSchema: await diff.describeDatabase(sequelizeUri),
    migrationSchema: await diff.describeDatabase(migrationUri),
  }
}

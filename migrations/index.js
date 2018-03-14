/* eslint-disable no-await-in-loop */
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const mysql = require('mysql2/promise')
const DBDiff = require('dbdiff/dbdiff')

const models = require('../models')

/**
 * Performs any needed migrations on the database.
 * @return {Promise} A promise that resolves when the migrations are complete
 */
module.exports.runMigrations = async sequelize => {
  // Create the migrations DB if needed
  await sequelize.query(
    'CREATE TABLE IF NOT EXISTS `migrations` (`id` INTEGER NOT NULL auto_increment , `index` INTEGER UNIQUE NOT NULL, `filename` TEXT NOT NULL, `appliedAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, UNIQUE `migrations_index_unique` (`index`), PRIMARY KEY (`id`)) ENGINE=InnoDB;'
  )

  // Determine the last migration that ran
  let lastMigration = (await sequelize.query(
    'SELECT MAX(`index`) AS last_migration FROM migrations;'
  ))[0][0].last_migration
  if (lastMigration === null) {
    lastMigration = -1
  }

  // Collect a list of migrations that still need to be run
  const files = fs.readdirSync(__dirname)
  const regex = /^([0-9]+).+\.sql$/
  const neededMigrations = files
    .filter(file => regex.test(file))
    .map(file => ({
      index: Number.parseInt(regex.exec(file)[1], 10),
      filename: file,
    }))
    .filter(file => file.index > lastMigration)
    .sort((a, b) => a.index - b.index)

  // Perform the needed migrations
  for (let i = 0; i < neededMigrations.length; i += 1) {
    const migration = neededMigrations[i]
    const migrationSql = fs.readFileSync(
      path.join(__dirname, migration.filename),
      {
        encoding: 'utf8',
      }
    )

    // Perform the migration
    await sequelize.query(migrationSql)

    // Record the migration in the database
    const { index, filename } = migration
    await sequelize.query(
      `INSERT INTO migrations(\`index\`, \`filename\`) VALUES (${index}, '${filename}')`
    )
  }
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
  module.exports.runMigrations(migrationSequelize)

  // Run the Sequelize "sync" on the other database
  models.initSequelize(syncedSequelize)
  await syncedSequelize.sync({ force: true })

  // Perform the diff!
  const diff = new DBDiff()
  await diff.compare(migrationUri, sequelizeUri)

  // Clean up, now that we're done
  await testConnection.query('DROP DATABASE IF EXISTS `queue_sequelize`;')
  await testConnection.query('DROP DATABASE IF EXISTS `queue_migrations`;')

  return diff.commands('drop')
}

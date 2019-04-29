const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

const env = process.env.NODE_ENV || 'development'
const config = require('../config/config')[env]

/**
 * Loads our models into the given Sequelize instance
 * @param  {[type]} sequelize [description]
 * @return {[type]}           [description]
 */
module.exports.initSequelize = sequelize => {
  const models = {}

  fs.readdirSync(__dirname)
    .filter(
      file =>
        file.indexOf('.') !== 0 && file.endsWith('.js') && file !== 'index.js'
    )
    .forEach(file => {
      const model = sequelize.import(path.join(__dirname, file))
      const modelName = file.substring(0, file.indexOf('.js'))
      models[modelName] = model
    })

  Object.keys(models).forEach(modelName => {
    if ('associate' in models[modelName]) {
      models[modelName].associate(models)
    }
  })

  return models
}

const sequelizeConfig = {
  dialectOptions: {
    multipleStatements: true,
  },
}

let sequelize
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    ...config,
    ...sequelizeConfig,
  })
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config,
    ...sequelizeConfig,
  })
}

const models = module.exports.initSequelize(sequelize)

Object.assign(module.exports, models)

module.exports.sequelize = sequelize
module.exports.Sequelize = Sequelize
module.exports.models = models

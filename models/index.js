const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env]

if (process.env.DATABASE_URL) {
  var sequelize = new Sequelize(process.env.DATABASE_URL,config)
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config)
}

const db = {}

fs.readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file.indexOf('.js') !== -1) && (file !== 'index.js'))
  .forEach(function(file) {
    const model = sequelize.import(path.join(__dirname, file))
    const modelName = file.substring(0, file.indexOf('.js'))
    db[modelName] = model
  })

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

// Create all tables if needed
sequelize.sync()

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db

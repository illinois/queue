module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './dev.sqlite',
    logging: false,
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  },
  now: {
    dialect: 'sqlite',
    storage: '/tmp/now.sqlite',
    logging: false,
  },
  staging: {
    dialect: 'sqlite',
    storage: './staging.sqlite',
    logging: false,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8md4',
    },
  },
}

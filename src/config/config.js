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
    username: 'root',
    password: '???',
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
}

const logger = require('../util/logger')

module.exports = (err, req, res, _next) => {
  logger.error(err.stack)
  res.status(500).send()
}

const logger = require('../util/logger')

module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    next(err)
    return
  }
  logger.error(err.stack)
  // res.status(500).send(err.stack)
  next(err)
}

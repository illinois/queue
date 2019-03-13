const { ApiError } = require('../api/util')

module.exports = (req, res, next) => {
  if (!res.locals.userAuthz.isAdmin) {
    next(new ApiError(403, "You don't have authorization to do that"))
    return
  }
  next()
}

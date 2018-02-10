module.exports = (req, res, next) => {
  if (!res.locals.userAuthz.isAdmin) {
    res.status(403).send()
    return
  }
  next()
}

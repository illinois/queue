module.exports = (req, res, next) => {
  if (!res.locals.userAuthz.isAdmin) {
    res.status(403).send("You don't have authorization to do this")
    return
  }
  next()
}

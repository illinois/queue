const jwt = require('jsonwebtoken')

const { User } = require('../models')
const safeAsync = require('../middleware/safeAsync')

module.exports = safeAsync(async (req, res, next) => {
  try {
    const jwtCookie = req.cookies.jwt
    const jwtData = jwt.verify(jwtCookie, 'mysecretkey')
    const netid = jwtData.sub
    const user = await User.find({ where: { netid } })
    if (user === null) {
      // This shouldn't ever happen, but if it does...
      res.status(403).send()
      return
    }
    res.locals.userAuthn = user
    next()
  } catch (e) {
    console.error(e)
    res.status(403).send()
  }
})

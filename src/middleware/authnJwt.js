const jwt = require('jsonwebtoken')

const { User } = require('../models')
const safeAsync = require('../middleware/safeAsync')

module.exports = safeAsync(async (req, res, next) => {
  const jwtCookie = req.cookies.jwt
  if (!jwtCookie) {
    res.status(401).send()
    return
  }

  let jwtData
  try {
    jwtData = jwt.verify(jwtCookie, 'mysecretkey')
  } catch (e) {
    console.error(e)
    res.status(401).send()
  }

  const netid = jwtData.sub
  const user = await User.find({ where: { netid } })
  if (user === null) {
    // This shouldn't ever happen, but if it does...
    res.status(401).send()
    return
  }
  res.locals.userAuthn = user
  next()
})

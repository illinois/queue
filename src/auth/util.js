const jwt = require('jsonwebtoken')

const { User } = require('../models')

/**
 * Create + update user in the DB
 * Their displayed name might have changed since their last Shib login,
 * so we'll take this opportunity to update it in the DB if needed.
 */
module.exports.createOrUpdateUser = async (req, netid) => {
  const [user] = await User.findOrCreate({ where: { netid } })
  const name = req.get('displayname')
  if (name && name !== user.universityName) {
    user.universityName = name
    await user.save()
  }
  return user
}

module.exports.addJwtCookie = (req, res, user) => {
  // We'll now create a token for this user. This will be set as a cookie
  // and sent back to us with any future requests.
  const tokenData = {
    sub: user.netid,
  }
  const tokenOptions = {
    expiresIn: '28 days',
  }
  const token = jwt.sign(tokenData, 'mysecretkey', tokenOptions)

  res.cookie('jwt', token, {
    maxAge: 1000 * 60 * 60 * 24 * 28, // 28 days
    httpOnly: true,
    // On localhost, this needs to be false for the cookie to be accepted by
    // the client
    secure: req.secure,
  })
}

module.exports.getUserFromJwt = async (token) => {
  try {
    const jwtData = jwt.verify(token, 'mysecretkey')
    const netid = jwtData.sub
    const user = await User.find({ where: { netid } })
    return user
  } catch (e) {
    return null
  }
}

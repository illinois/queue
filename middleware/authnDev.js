const { User } = require('../models')

module.exports.socket = (socket, next) => {
  // Assume that when a socket connects, we've already done the normal authn
  // flow and that the user is cached in the session
  /* eslint-disable no-param-reassign */
  socket.userAuthn = socket.handshake.session.user
  next()
}

module.exports.express = async (req, res, next) => {
  // In Dev, we allow users to force themselves to authenticate as a different
  // user to make testing multiple-user things possible.
  if (req.session.user && !req.query.forceuser) {
    res.locals.userAuthn = req.session.user
    next()
  } else {
    const netid = req.query.forceuser || 'dev'
    const isAdmin = netid === 'dev'
    const [user] = await User.findOrCreate({
      where: {
        netid,
      },
      defaults: {
        isAdmin,
      },
    })
    req.session.user = user
    res.locals.userAuthn = user
    next()
  }
}

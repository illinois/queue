const { User } = require('../models')

const getUser = async (email = '') => {
  // Get the user's NetID based on the "eppn" field
  if (email.indexOf('@') === -1) {
    throw new Error('No login information found')
  }
  const [netid] = email.split('@')
  return User.findOrCreate({ where: { netid } })
}

module.exports.socket = (socket, next) => {
  getUser(socket.handshake.headers.eppn)
    .then(user => {
      /* eslint-disable no-param-reassign */
      socket.userAuthn = user
      next()
    })
    .catch(err => next(err))
}

module.exports.express = async (req, res, next) => {
  try {
    const user = await getUser(req.get('eppn'))

    // Only do this during express authn, not for sockets
    const name = req.get('displayname')
    if (name) {
      user.universityName = name
      await user.save()
    }

    res.locals.userAuthn = user
    next()
  } catch (err) {
    res.status(400).send('No login information found')
  }
}

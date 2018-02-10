const { User } = require('../models')

const DEV = process.env.NODE_ENV !== 'production'

module.exports = async (req, res, next) => {
  // Get the user's NetID based on the "eppn" field
  // Temporarily disable this in dev
  if (DEV && req.session.user) {
    res.locals.user = req.session.user
    next()
  } else if (DEV) {
    // By default, create or find admin user "dev"
    const [user] = await User.findOrCreate({
      where: {
        netid: 'dev',
      },
      defaults: {
        isAdmin: true,
      },
    })
    req.session.user = user
    res.locals.user = user
    next()
  } else {
    const email = req.get('eppn') || ''
    if (email.indexOf('@') === -1) {
      throw new Error('No login found.')
    }
    const [netid] = email.split('@')

    const [user] = await User.findOrCreate({ where: { netid } })
    res.locals.user = user
    next()
  }
}

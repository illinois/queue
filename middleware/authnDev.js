const { User } = require('../models')

module.exports = async (req, res, next) => {
  // In Dev, we allow
  if (req.session.user) {
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

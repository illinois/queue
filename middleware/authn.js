const { User } = require('../models')

module.exports = async (req, res, next) => {
  // Get the user's NetID based on the "eppn" field
  const email = req.get('eppn') || ''
  if (email.indexOf('@') === -1) {
    res.status(400).send('No login information found')
    return
  }
  const [netid] = email.split('@')
  const [user] = await User.findOrCreate({ where: { netid } })

  const name = req.get('displayname')
  if (name) {
    user.name = name
    await user.save()
  }

  res.locals.userAuthn = user
  next()
}

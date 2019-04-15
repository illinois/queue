const crypto = require('crypto')

const { ApiError } = require('../api/util')
const safeAsync = require('../middleware/safeAsync')
const { AccessToken, User } = require('../models')

module.exports = safeAsync(async (req, res, next) => {
  if (res.locals.userAuthn) {
    // Something else in the chain already handled authn
    next()
    return
  }

  let token
  if (req.query.private_token !== undefined) {
    // Token was provided in a query param
    token = req.query.private_token
  } else if (req.header('Private-Token') !== undefined) {
    // Token was provided in a header
    token = req.header('Private-Token')
  } else {
    // Didn't try to authenticate with a token; to the next middleware!
    next()
    return
  }

  const tokenHash = crypto
    .createHash('sha256')
    .update(token, 'utf8')
    .digest('hex')

  const tokenWithUser = await AccessToken.findOne({
    where: {
      hash: tokenHash,
    },
    include: [
      {
        model: User,
      },
    ],
  })

  if (!tokenWithUser) {
    // Invalid token
    next(new ApiError(401, 'Invalid token'))
    return
  }

  res.locals.userAuthn = tokenWithUser.user

  tokenWithUser.lastUsedAt = new Date()
  await tokenWithUser.save()

  next()
})

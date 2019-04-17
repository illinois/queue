const router = require('express').Router({
  mergeParams: true,
})
const uuidv4 = require('uuid/v4')
const crypto = require('crypto')

const { check } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')

const { ApiError, failIfErrors } = require('./util')

const { AccessToken } = require('../models')
const safeAsync = require('../middleware/safeAsync')

// Get all tokens for authenticated user
router.get(
  '/',
  safeAsync(async (req, res, _next) => {
    const { id } = res.locals.userAuthn
    const tokens = await AccessToken.findAll({
      where: {
        userId: id,
      },
    })
    res.send(tokens)
  })
)

// Get single token for authenticated user
router.get(
  '/:tokenId',
  safeAsync(async (req, res, next) => {
    const { id } = res.locals.userAuthn
    const { tokenId } = req.params
    const token = await AccessToken.findOne({
      where: {
        id: tokenId,
        userId: id,
      },
    })
    if (!token) {
      next(new ApiError(404, 'Token not found'))
      return
    }
    res.send(token)
  })
)

// Creates a new token for the user
router.post(
  '/',
  [check('name').isLength({ min: 1 }), failIfErrors],
  safeAsync(async (req, res, _next) => {
    const { id: userId } = res.locals.userAuthn
    const data = matchedData(req)
    const token = uuidv4()
    const tokenHash = crypto
      .createHash('sha256')
      .update(token, 'utf8')
      .digest('hex')
    const newToken = await AccessToken.create({
      name: data.name,
      hash: tokenHash,
      userId,
    })
    res.status(201).send({ ...newToken.toJSON(), token })
  })
)

router.delete(
  '/:tokenId',
  safeAsync(async (req, res, _next) => {
    const { id: userId } = res.locals.userAuthn
    const { tokenId: id } = req.params

    const deleteCount = await AccessToken.destroy({
      where: {
        id,
        userId,
      },
    })

    if (deleteCount === 0) {
      res.status(404).send()
    } else {
      res.status(204).send()
    }
  })
)

module.exports = router

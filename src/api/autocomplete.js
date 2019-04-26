const router = require('express').Router()

const { User, Sequelize } = require('../models')

const { failIfErrors, ApiError } = require('./util')
const requireAdmin = require('../middleware/requireAdmin')
const safeAsync = require('../middleware/safeAsync')

router.get(
  '/users',
  [requireAdmin, failIfErrors],
  safeAsync(async (req, res, next) => {
    const { q } = req.query
    if (q === null || q === undefined) {
      next(new ApiError(422, 'No query specified'))
      return
    }
    const users = await User.findAll({
      where: {
        [Sequelize.Op.or]: {
          uid: {
            [Sequelize.Op.like]: `${q}%`,
          },
        },
      },
      limit: 10,
    })
    res.send(users)
  })
)

module.exports = router

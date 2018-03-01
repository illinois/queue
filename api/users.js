const router = require('express').Router()

const { requireUser, failIfErrors } = require('./util')

const { User, Course } = require('../models')

const requireAdmin = require('../middleware/requireAdmin')

// Get list of all users
router.get('/', [requireAdmin], (req, res, _next) =>
  User.findAll().then(users => res.send(users))
)

// Get the currently authenticated user
router.get('/me', async (req, res, _next) => {
  const { id } = res.locals.userAuthn
  const user = await User.findOne({
    where: { id },
    include: [
      {
        model: Course,
        as: 'staffAssignments',
        through: {
          attributes: [],
        },
      },
    ],
  })
  res.send(user)
})

// Updates the information for a given user
router.patch('/me', async (req, res, _next) => {
  const { id } = res.locals.userAuthn
  const user = await User.findOne({
    where: { id },
    include: [
      {
        model: Course,
        as: 'staffAssignments',
        through: {
          attributes: [],
        },
      },
    ],
  })

  // Right now, we only allow preferredName to be updated
  if (req.body.preferredName) {
    user.preferredName = req.body.preferredName
    await user.save()
  }

  res.send(user)
})

// Get a specific user
router.get(
  '/:userId',
  [requireAdmin, requireUser, failIfErrors],
  (req, res, _next) => {
    res.send(res.locals.user)
  }
)

module.exports = router

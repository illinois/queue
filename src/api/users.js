const router = require('express').Router()

const { requireUser, failIfErrors, ApiError } = require('./util')

const { User, Course } = require('../models')

const requireAdmin = require('../middleware/requireAdmin')
const safeAsync = require('../middleware/safeAsync')

// Get list of all users
router.get('/', [requireAdmin], (req, res, _next) =>
  User.findAll().then(users => res.send(users))
)

// Get the currently authenticated user
router.get(
  '/me',
  safeAsync(async (req, res, _next) => {
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
)

// Get a list of all admins
router.get(
  '/admins',
  [requireAdmin, failIfErrors],
  safeAsync(async (req, res, _next) => {
    const users = await User.findAll({
      where: {
        isAdmin: true,
      },
    })
    res.send(users)
  })
)

// Add the specified user to the list of admins
router.put(
  '/admins/:userId',
  [requireAdmin, requireUser, failIfErrors],
  safeAsync(async (req, res, _next) => {
    const { user } = res.locals
    if (user.isAdmin) {
      res.status(204).send()
      return
    }
    user.isAdmin = true
    await user.save()
    res.status(201).send(user)
  })
)

// Remove the specified user from the list of admins
router.delete(
  '/admins/:userId',
  [requireAdmin, requireUser, failIfErrors],
  safeAsync(async (req, res, _next) => {
    const { id } = res.locals.userAuthn
    const { user } = res.locals
    // Prevent user from removing themselves as an admin
    if (user.id === id) {
      _next(new ApiError(403, 'You cannot remove yourself'))
      return
    }
    if (user.isAdmin) {
      user.isAdmin = false
      await user.save()
    }
    res.status(204).send()
  })
)

// Updates the information for a given user
router.patch(
  '/me',
  safeAsync(async (req, res, _next) => {
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
)

// Get a specific user
router.get(
  '/:userId',
  [requireAdmin, requireUser, failIfErrors],
  (req, res, _next) => {
    res.send(res.locals.user)
  }
)

module.exports = router

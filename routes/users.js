const router = require('express').Router()

const {
  requireUser,
  failIfErrors,
} = require('./util')
const { User } = require('../models')

// Get list of all users
router.get('/', (req, res, _next) => User.findAll().then(users => res.send(users)))

// Get a specific user
router.get('/:userId', [
  requireUser,
  failIfErrors,
], (req, res, _next) => {
  res.send(req.user)
})

module.exports = router

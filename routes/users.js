const router = require('express').Router()
const validator = require('validator')
const { User } = require('../models')

// Get list of all users
router.get('/', (req, res, next) => User.findAll().then(users => res.send(users)))

// Get a specific user
router.get('/:userId', (req, res, next) => {
  const userId = validator.toInt(req.params.userId)

  User.findOne({
    where: { id: userId }
  }).then(user => res.send(user))
})

module.exports = router;

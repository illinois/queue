const { User, Course } = require('../models')

const getAuthz = async userAuthn => {
  const staffedCourses = await Course.findAll({
    where: {
      '$staff.id$': userAuthn.id,
    },
    attributes: ['id'],
    include: [
      {
        model: User,
        as: 'staff',
        attributes: [],
      },
    ],
    raw: true,
  })
  const staffedCourseIds = staffedCourses.map(row => row.id)

  return {
    isAdmin: userAuthn.isAdmin,
    staffedCourseIds,
  }
}

module.exports.socket = (socket, next) => {
  if (!socket.userAuthn) {
    next(new Error('No authentication data found'))
  } else {
    getAuthz(socket.userAuthn)
      .then(userAuthz => {
        /* eslint-disable no-param-reassign */
        socket.userAuthz = userAuthz
        next()
      })
      .catch(next)
  }
}

module.exports.express = async (req, res, next) => {
  res.locals.userAuthz = await getAuthz(res.locals.userAuthn)
  next()
}

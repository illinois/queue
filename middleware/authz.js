const { User, Course } = require('../models')

module.exports = async (req, res, next) => {
  // Grab the user from the authn stage
  const { userAuthn } = res.locals

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

  res.locals.userAuthz = {
    isAdmin: userAuthn.isAdmin,
    staffedCourseIds,
  }

  next()
}

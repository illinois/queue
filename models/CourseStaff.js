module.exports = (sequelize, _DataTypes) => {
  const obj = sequelize.define('courseStaff', {}, {
    // Don't pluralize staff to staffs
    freezeTableName: true,
    name: {
      singular: 'courseStaff',
      plural: 'courseStaff',
    },
  })

  return obj
}

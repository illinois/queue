module.exports = (sequelize, DataTypes) => {
  const obj = sequelize.define(
    'courseRequest',
    {},
    {
      name: DataTypes.STRING,
    }
  )

  obj.associate = models => {
    models.CourseRequest.belongsTo(models.User, { as: 'requestedBy' })
    models.CourseRequest.belongsTo(models.User, { as: 'reviewedBy' })
  }

  return obj
}

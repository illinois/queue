module.exports = (sequelize, DataTypes) => {
  const obj = sequelize.define(
    'courseRequest',
    {},
    {
      name: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM('submitted', 'accepted', 'rejected'),
        defaultValue: 'submitted',
      },
      reviewerComment: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
    }
  )

  obj.associate = models => {
    models.CourseRequest.belongsTo(models.User, { as: 'requestedBy' })
    models.CourseRequest.belongsTo(models.User, { as: 'reviewedBy' })
  }

  return obj
}

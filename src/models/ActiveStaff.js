module.exports = (sequelize, DataTypes) => {
  const obj = sequelize.define(
    'activeStaff',
    {
      startTime: DataTypes.DATE,
      endTime: DataTypes.DATE,
    },
    {
      // Don't pluralize staff to staffs
      freezeTableName: true,
      name: {
        singular: 'activeStaff',
        plural: 'activeStaff',
      },
      defaultScope: {
        attributes: {
          include: ['userId', 'queueId'],
        },
      },
    }
  )

  obj.associate = models => {
    models.ActiveStaff.belongsTo(models.User)
    models.ActiveStaff.belongsTo(models.Queue)
  }

  return obj
}

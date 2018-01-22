module.exports = (sequelize, DataTypes) => {
  const obj = sequelize.define('activeStaff', {
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
  })

  obj.associate = (models) => {
    models.ActiveStaff.belongsTo(models.User)
    models.ActiveStaff.belongsTo(models.Queue)
  }

  return obj
}

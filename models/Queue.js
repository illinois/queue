module.exports = (sequelize, DataTypes) => {
  const obj = sequelize.define('queue', {
    name: DataTypes.TEXT,
    location: DataTypes.TEXT,

    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
  })

  obj.associate = (models) => {
    models.Queue.belongsTo(models.Course)
    models.Queue.hasMany(models.ActiveStaff)
    models.Queue.hasMany(models.Question)
    models.Queue.belongsTo(models.User, { as: 'CreatedByUser' })
  }

  return obj
}

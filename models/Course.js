module.exports = (sequelize, DataTypes) => {
  const obj = sequelize.define('course', {
    name: DataTypes.STRING,
  })

  obj.associate = (models) => {
    models.Course.hasMany(models.Queue)
  }

  return obj
}

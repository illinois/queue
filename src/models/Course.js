module.exports = (sequelize, DataTypes) => {
  const obj = sequelize.define('course', {
    name: DataTypes.STRING,
    shortcode: DataTypes.STRING,
    isUnlisted: DataTypes.BOOLEAN,
  })

  obj.associate = models => {
    models.Course.hasMany(models.Queue)
    models.Course.belongsToMany(models.User, {
      as: 'staff',
      through: models.CourseStaff,
    })
  }

  return obj
}

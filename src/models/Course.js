module.exports = (sequelize, DataTypes) => {
  const obj = sequelize.define('course', {
    name: DataTypes.STRING,
    shortcode: DataTypes.STRING,
    isUnlisted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    questionFeedback: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
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

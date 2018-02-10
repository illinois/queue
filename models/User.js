module.exports = (sequelize, DataTypes) => {
  const obj = sequelize.define('user', {
    netid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: DataTypes.STRING,
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  })

  obj.associate = (models) => {
    models.User.belongsToMany(models.Course, { as: 'staffAssignments', through: models.CourseStaff })
  }

  return obj
}

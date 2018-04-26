module.exports = (sequelize, DataTypes) => {
  const obj = sequelize.define('user', {
    netid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'netid',
    },
    universityName: DataTypes.STRING,
    preferredName: DataTypes.STRING,
    name: {
      type: DataTypes.VIRTUAL(DataTypes.STRING, [
        'universityName',
        'preferredName',
      ]),
      get() {
        return this.get('preferredName') || this.get('universityName')
      },
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  })

  obj.associate = models => {
    models.User.belongsToMany(models.Course, {
      as: 'staffAssignments',
      through: models.CourseStaff,
    })
  }

  return obj
}

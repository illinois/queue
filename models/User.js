module.exports = (sequelize, DataTypes) => {
  const obj = sequelize.define('user', {
    netid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: DataTypes.STRING,
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  })

  obj.associate = (models) => {
    models.User.belongsToMany(models.Course, { through: 'staffAssignment' })
  }

  return obj
}

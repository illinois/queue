module.exports = (sequelize, DataTypes) => {
  const obj = sequelize.define('user', {
    netid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    fname: DataTypes.STRING,
    lname: DataTypes.STRING,
    displayName: DataTypes.STRING,

  })

  return obj
}

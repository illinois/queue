"use strict"

module.exports = function(sequelize, DataTypes) {
  var obj = sequelize.define("course", {
    name: DataTypes.STRING,
  })

  obj.associate = function(models) {
    models.Course.hasMany(models.Queue)
  }

  return obj
}

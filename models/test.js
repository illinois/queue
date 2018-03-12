'use strict';
module.exports = (sequelize, DataTypes) => {
  var test = sequelize.define('test', {
    name: DataTypes.STRING,
    admin: DataTypes.STRING
  }, {});
  test.associate = function(models) {
    // associations can be defined here
  };
  return test;
};
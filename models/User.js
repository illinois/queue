"use strict";

module.exports = function(sequelize, DataTypes) {
    var obj = sequelize.define("user", {
      netid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },

      fname: DataTypes.STRING,
      lname: DataTypes.STRING,
      displayName: DataTypes.STRING,

    });

    obj.associate = function(models) {
    };

    return obj;
};

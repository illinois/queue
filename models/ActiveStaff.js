"use strict";

module.exports = function(sequelize, DataTypes) {
    var obj = sequelize.define("activeStaff", {
      startTime: DataTypes.DATE,
      endTime: DataTypes.DATE,
    });

    obj.associate = function(models) {
      models.ActiveStaff.belongsTo(models.User);
      models.ActiveStaff.belongsTo(models.Queue);
    };

    return obj;
};

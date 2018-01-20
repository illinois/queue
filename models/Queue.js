"use strict";

module.exports = function(sequelize, DataTypes) {
    var obj = sequelize.define("queue", {
      name: DataTypes.TEXT,

      startTime: DataTypes.DATE,
      endTime: DataTypes.DATE,

    });

    obj.associate = function(models) {
        models.Queue.belongsTo(models.Course);
        models.Queue.hasMany(models.ActiveStaff);
        models.Queue.hasMany(models.Question);
        models.Queue.belongsTo(models.User, {as: "CreatedByUser"});
    };

    return obj;
};

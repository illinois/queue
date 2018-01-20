"use strict"

module.exports = function(sequelize, DataTypes) {
  var obj = sequelize.define("question", {
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    topic: DataTypes.TEXT,

    beingAnswered: DataTypes.BOOLEAN,

    answerStartTime: DataTypes.DATE,
    answerFinishTime: DataTypes.DATE,
    enqueueTime: DataTypes.DATE,
    dequeueTime: DataTypes.DATE,
  })

  obj.associate = function(models) {
    models.Question.belongsTo(models.Queue)
    models.Question.belongsTo(models.User, {as: "askedBy"})
    models.Question.belongsTo(models.User, {as: "answeredBy"})
  }

  return obj
}

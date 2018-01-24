module.exports = (sequelize, DataTypes) => {
  const obj = sequelize.define('question', {
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    topic: DataTypes.TEXT,

    beingAnswered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    answerStartTime: DataTypes.DATE,
    answerFinishTime: DataTypes.DATE,
    enqueueTime: DataTypes.DATE,
    dequeueTime: DataTypes.DATE,
  }, {
    paranoid: true,
  })

  obj.associate = (models) => {
    models.Question.belongsTo(models.Queue)
    models.Question.belongsTo(models.User, { as: 'askedBy' })
    models.Question.belongsTo(models.User, { as: 'answeredBy' })
  }

  return obj
}

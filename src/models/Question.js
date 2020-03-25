module.exports = (sequelize, DataTypes) => {
  const obj = sequelize.define(
    'question',
    {
      name: DataTypes.TEXT,
      location: DataTypes.TEXT,
      topic: DataTypes.TEXT,

      beingAnswered: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      answerStartTime: DataTypes.DATE,
      answerFinishTime: DataTypes.DATE,
      enqueueTime: DataTypes.DATE,
      dequeueTime: DataTypes.DATE,

      // Feedback
      comments: DataTypes.TEXT,
      preparedness: DataTypes.ENUM('not', 'average', 'well'),
    },
    {
      // Don't actually delete, so that we can save feedback
      paranoid: true,
    }
  )

  obj.associate = models => {
    models.Question.belongsTo(models.Queue)
    models.Question.belongsTo(models.User, { as: 'askedBy' })
    models.Question.belongsTo(models.User, { as: 'answeredBy' })

    models.Question.addScope(
      'defaultScope',
      {
        attributes: {
          include: ['askedById', 'answeredById', 'queueId'],
        },
        include: [
          {
            model: models.User,
            as: 'answeredBy',
            attributes: ['name', 'uid'],
            required: false,
          },
          {
            model: models.User,
            as: 'askedBy',
            attributes: ['uid'],
            required: true,
          },
        ],
      },
      {
        override: true,
      }
    )
  }

  return obj
}

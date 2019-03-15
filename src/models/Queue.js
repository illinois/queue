module.exports = (sequelize, DataTypes) => {
  const obj = sequelize.define(
    'queue',
    {
      name: DataTypes.TEXT,
      location: DataTypes.TEXT,
      fixedLocation: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      open: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      message: DataTypes.TEXT,
      messageEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isConfidential: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      admissionControlEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      admissionControlUrl: DataTypes.TEXT,
      startTime: DataTypes.DATE,
      endTime: DataTypes.DATE,
    },
    {
      paranoid: true, // Don't actually delete
      defaultScope: {
        attributes: {
          include: ['courseId', 'createdByUserId'],
          exclude: ['admissionControlEnabled', 'admissionControlUrl'],
        },
      },
      scopes: {
        courseStaff: {
          attributes: {
            include: ['courseId', 'createdByUserId'],
          },
        },
      },
    }
  )

  obj.associate = models => {
    models.Queue.belongsTo(models.Course)
    models.Queue.hasMany(models.ActiveStaff)
    models.Queue.hasMany(models.Question)
    models.Queue.belongsTo(models.User, { as: 'createdByUser' })

    models.Queue.addScope('questionCount', {
      attributes: {
        include: [
          [
            sequelize.literal(
              '(SELECT COUNT(`questions`.`id`) FROM `questions` WHERE `questions`.`queueId` = `queue`.`id` AND `questions`.`dequeueTime` IS NULL)'
            ),
            'questionCount',
          ],
        ],
      },
      include: [
        {
          model: models.Question,
          where: { dequeueTime: null },
          required: false,
          attributes: [],
        },
      ],
    })
  }

  return obj
}

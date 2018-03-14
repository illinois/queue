module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('questions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      name: Sequelize.TEXT,
      location: Sequelize.TEXT,
      topic: Sequelize.TEXT,
      beingAnswered: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      answerStartTime: Sequelize.DATE,
      answerFinishTime: Sequelize.DATE,
      enqueueTime: Sequelize.DATE,
      dequeueTime: Sequelize.DATE,
      comments: Sequelize.TEXT,
      preparedness: Sequelize.ENUM('not', 'average', 'well'),

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
      queueId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'queues',
          key: 'id',
        },
      },
      askedById: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      answeredById: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    })
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.dropTable('questions')
  },
}

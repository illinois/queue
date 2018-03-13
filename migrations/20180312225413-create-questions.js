module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('courseStaff', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      preparedness: Sequelize.TEXT,

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      },
      queueId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'queues',
          key: 'id',
        },
        allowNull: false,
      },
      askedById: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: false,
      },
      answeredById: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: false,
      }
    })
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.dropTable('questions')
  }
};

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('activeStaff', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      startTime: Sequelize.DATE,
      endTime: Sequelize.DATE,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: false,
      },
      queueId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'queues',
          key: 'id',
        },
        allowNull: false,
      }
    })
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.dropTable('activeStaff')
  }
};

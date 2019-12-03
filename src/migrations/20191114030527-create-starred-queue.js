module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('starredQueues', {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      queueId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'queues',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
    })
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.dropTable('starredQueues')
  },
}

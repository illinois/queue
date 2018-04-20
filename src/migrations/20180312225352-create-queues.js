module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('queues', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: Sequelize.TEXT,
      location: Sequelize.TEXT,
      startTime: Sequelize.DATE,
      endTime: Sequelize.DATE,
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
      courseId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'courses',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'set null',
      },
      createdByUserId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'set null',
      },
    })
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.dropTable('queues')
  },
}

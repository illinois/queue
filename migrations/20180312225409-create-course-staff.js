module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('courseStaff', {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      courseId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'courses',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
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
    })
    try {
      await queryInterface.addConstraint(
        'courseStaff',
        ['courseId', 'userId'],
        {
          type: 'primary key',
        }
      )
    } catch (e) {
      // Ignore this error, it's probably just because we're running a
      // migration on an old database
    }
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.dropTable('courseStaff')
  },
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('courseStaff', {
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
      .then(() => {
        queryInterface.addConstraint('courseStaff', ['courseId', 'userId'], {
          type: 'primary key',
        })
      })
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.dropTable('courseStaff')
  },
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('courseRequests', {
      name: Sequelize.STRING,
      status: {
        type: Sequelize.ENUM('submitted', 'accepted', 'rejected'),
        defaultValue: 'submitted',
      },
      reviewerComment: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      requestedById: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'set null',
      },
      reviewedById: {
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
    return queryInterface.dropTable('courseRequests')
  },
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('accessTokens', {
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      hash: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      lastUsedAt: {
        type: Sequelize.DATE,
        defaultValue: null,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.dropTable('accessTokens')
  },
}

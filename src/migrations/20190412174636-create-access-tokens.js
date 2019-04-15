module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('accessTokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      hash: {
        type: Sequelize.STRING(64),
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
      userId: {
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
    return queryInterface.dropTable('accessTokens')
  },
}

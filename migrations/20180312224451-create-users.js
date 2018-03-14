module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      netid: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      universityName: Sequelize.STRING,
      preferredName: Sequelize.STRING,
      isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.dropTable('users')
  }
};

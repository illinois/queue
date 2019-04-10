module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.addIndex('users', ['isAdmin'])
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.removeIndex('users', ['isAdmin'])
  },
}

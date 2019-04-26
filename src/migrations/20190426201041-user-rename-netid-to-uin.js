module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.renameColumn('users', 'netid', 'uid')
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.renameColumn('users', 'uid', 'netid')
  },
}

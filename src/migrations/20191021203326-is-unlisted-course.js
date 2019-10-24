module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('courses', 'isUnlisted', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      after: 'messageEnabled',
    })
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.removeColumn('courses', 'isUnlisted')
  },
}

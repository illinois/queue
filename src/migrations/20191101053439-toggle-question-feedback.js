module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('courses', 'questionFeedback', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      after: 'messageEnabled',
    })
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.removeColumn('courses', 'questionFeedback')
  },
}

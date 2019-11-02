module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('courses', 'questionFeedback', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    })
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.removeColumn('courses', 'questionFeedback')
  },
}

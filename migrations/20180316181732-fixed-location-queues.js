module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('queues', 'fixedLocation', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      after: 'location',
    })
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.removeColumn('queues', 'fixedLocation')
  },
}

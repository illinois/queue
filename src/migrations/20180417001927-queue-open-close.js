module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('queues', 'open', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      after: 'fixedLocation',
    })
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.removeColumn('queues', 'open')
  },
}

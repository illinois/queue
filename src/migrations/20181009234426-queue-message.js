module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('queues', 'message', {
      type: Sequelize.TEXT,
      after: 'open',
    })
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.removeColumn('queues', 'message')
  },
}

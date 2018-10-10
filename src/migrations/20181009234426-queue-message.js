module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('queues', 'message', {
        type: Sequelize.TEXT,
        after: 'open',
      })
      .then(() => {
        return queryInterface.addColumn('queues', 'messageEnabled', {
          type: Sequelize.BOOLEAN,
          after: 'message',
          defaultValue: false,
        })
      })
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.removeColumn('queues', 'message').then(() => {
      return queryInterface.removeColumn('queues', 'messageEnabled')
    })
  },
}

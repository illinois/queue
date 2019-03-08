module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.addColumn(
        'queues',
        'admissionControlEnabled',
        {
          type: Sequelize.BOOLEAN,
          default: false,
        },
        { transaction }
      )
      await queryInterface.addColumn(
        'queues',
        'admissionControlUrl',
        {
          type: Sequelize.TEXT,
        },
        { transaction }
      )
    })
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.dropTable('queueConfigs')
  },
}

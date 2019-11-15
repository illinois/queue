module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.addColumn(
        'courses',
        'isUnlisted',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          after: 'shortcode',
        },
        { transaction }
      )
      await queryInterface.addColumn(
        'courses',
        'questionFeedback',
        {
          type: Sequelize.BOOLEAN,
          after: 'isUnlisted',
        },
        { transaction }
      )
    })
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeColumn('courses', 'isUnlisted', {
        transaction,
      })
      await queryInterface.removeColumn('courses', 'questionFeedback', {
        transaction,
      })
    })
  },
}

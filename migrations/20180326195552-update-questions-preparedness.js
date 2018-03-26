module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      'questions',
      'preparedness',
      'old_preparedness'
    )
    await queryInterface.addColumn('questions', 'preparedness', {
      type: Sequelize.INTEGER,
      after: 'comments',
    })
    await queryInterface.sequelize.query(
      'UPDATE `questions` SET `questions`.`preparedness` = ' +
        'CASE `questions`.`old_preparedness` ' +
        "WHEN 'not' THEN 0 " +
        "WHEN 'average' THEN 1 " +
        "WHEN 'well' THEN 2 " +
        'WHEN NULL THEN NULL ' +
        'END;'
    )
    await queryInterface.removeColumn('questions', 'old_preparedness')
  },

  down: (_queryInterface, _Sequelize) => {
    // Don't bother.
  },
}

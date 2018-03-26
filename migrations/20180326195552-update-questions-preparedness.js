module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('questions', 'preparedness', {
      type: Sequelize.ENUM('bad', 'average', 'good'),
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('questions', 'preparedness', {
      type: Sequelize.ENUM('not', 'average', 'well'),
    })
  },
}

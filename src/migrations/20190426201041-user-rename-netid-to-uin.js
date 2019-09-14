module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.renameColumn('users', 'netid', 'uid')

    const { sequelize } = queryInterface
    const users = await queryInterface.sequelize.query(
      'SELECT uid FROM users',
      { type: sequelize.QueryTypes.SELECT }
    )
    Promise.all(
      users.map(async user =>
        sequelize.query('UPDATE users SET uid=? WHERE uid=?', {
          replacements: [`${user.uid}@illinois.edu`, user.uid],
        })
      )
    )
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.sequelize.query(
      "UPDATE users SET uid=REPLACE(uid, '@illinois.edu', '')"
    )
    await queryInterface.renameColumn('users', 'uid', 'netid')
  },
}

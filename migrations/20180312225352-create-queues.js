module.exports = {
  up: (queryInterface, Sequelize) => {
   queryInterface.createTable('queues', {
     id: {
       allowNull: false,
       autoIncrement: true,
       primaryKey: true,
       type: Sequelize.INTEGER
     },
     name: Sequelize.TEXT,
     location: Sequelize.TEXT,
     startTime: Sequelize.DATE,
     endTime: Sequelize.DATE,
     createdAt: {
       allowNull: false,
       type: Sequelize.DATE
     },
     updatedAt: {
       allowNull: false,
       type: Sequelize.DATE
     },
     deletedAt: {
       type: Sequelize.DATE
     },
     courseId: {
       type: Sequelize.INTEGER,
       references: {
         model: 'courses',
         key: 'id',
       },
       allowNull: false,
     },
     createdByUserId: {
       type: Sequelize.INTEGER,
       references: {
         model: 'users',
         key: 'id',
       },
       allowNull: false,
     }
   })
  },

  down: (queryInterface, _Sequelize) => {
   return queryInterface.dropTable('queues')
  }
};

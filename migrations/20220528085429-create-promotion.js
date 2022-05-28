'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Promotions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      shopId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Shops',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      content: {
        type: Sequelize.STRING,
      },
      discount: {
        type: Sequelize.FLOAT,
      },
      standarFee: {
        type: Sequelize.FLOAT,
      },
      expiredAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Promotions');
  },
};

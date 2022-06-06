'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ShippingUnits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      workingTime: {
        type: Sequelize.STRING,
      },
      fee: {
        type: Sequelize.FLOAT,
      },
      maxOrderValue: {
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable('ShippingUnits');
  },
};

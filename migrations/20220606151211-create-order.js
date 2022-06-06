'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      addressId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Addresses',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      shopId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Shops',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      promotionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Promotions',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      shippingUnitId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ShippingUnits',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.STRING,
      },
      amount: {
        type: Sequelize.FLOAT,
      },
      serviceFeePercentage: {
        type: Sequelize.FLOAT,
      },
      isPurchased: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('Orders');
  },
};

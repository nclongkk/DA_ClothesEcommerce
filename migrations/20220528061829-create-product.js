'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products', {
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
        type: Sequelize.TEXT,
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Categories',
          key: 'id',
        },
      },
      shopId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Shops',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      avgRatings: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      totalRatings: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      totalVersions: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      avgRatings: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      totalRatings: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      soldQuantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      minPrice: {
        type: Sequelize.FLOAT,
      },
      maxPrice: {
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
    await queryInterface.dropTable('Products');
  },
};

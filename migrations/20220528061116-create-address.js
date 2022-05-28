'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      cityId: {
        type: Sequelize.STRING,
        references: {
          model: 'Cities',
          key: 'id',
        },
      },
      districtId: {
        type: Sequelize.STRING,
        references: {
          model: 'Districts',
          key: 'id',
        },
      },
      wardId: {
        type: Sequelize.STRING,
        references: {
          model: 'Wards',
          key: 'id',
        },
      },
      detail: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable('Addresses');
  },
};

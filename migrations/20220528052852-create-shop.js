'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Shops', {
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
      coverImage: {
        type: Sequelize.STRING,
      },
      addressDetail: {
        type: Sequelize.STRING,
      },
      avatar: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      paypalMail: {
        type: Sequelize.STRING,
      },
      avgRatings: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      totalRatings: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      userId: {
        type: Sequelize.INTEGER,
        unique: true,
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
    await queryInterface.dropTable('Shops');
  },
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ShopRatings', [
      {
        userId: 2,
        shopId: 2,
        rating: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        shopId: 3,
        rating: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 5,
        shopId: 2,
        rating: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 6,
        shopId: 1,
        rating: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 6,
        shopId: 2,
        rating: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 6,
        shopId: 3,
        rating: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 7,
        shopId: 3,
        rating: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ShopRatings', null, {});
  },
};

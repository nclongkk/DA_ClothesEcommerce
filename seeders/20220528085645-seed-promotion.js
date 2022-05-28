'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Promotions', [
      {
        shopId: 2,
        content: 'Giảm giá đầu năm',
        discount: 10,
        standarFee: 100000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        shopId: 2,
        content: 'Giảm giá đầu năm',
        discount: 20,
        standarFee: 500000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        shopId: 2,
        content: 'Giảm giá đầu năm',
        discount: 15,
        standarFee: 200000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Promotions', null, {});
  },
};

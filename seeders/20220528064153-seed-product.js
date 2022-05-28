'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products', [
      {
        shopId: 3,
        categoryId: 1,
        name: 'Áo thun nam cổ tròn phối logo DIORRR',
        description: '',
        soldQuantity: 0,
        minPrice: 180000,
        maxPrice: 200000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        shopId: 3,
        categoryId: 3,
        name: 'Quần Dài Gucci Vải Cotton Thêu Kim Sa Thời Trang Cho Nam Nữ',
        description: '',
        soldQuantity: 0,
        minPrice: 631000,
        maxPrice: 700000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        shopId: 2,
        categoryId: 1,
        name: 'Áo thun nam chữ in LOUVUITTON',
        description: '',
        soldQuantity: 0,
        minPrice: 50000,
        maxPrice: 50000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        shopId: 2,
        categoryId: 5,
        name: 'Áo sơ mi nam tay dài',
        description: '',
        soldQuantity: 0,
        minPrice: 750000,
        maxPrice: 750000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {});
  },
};

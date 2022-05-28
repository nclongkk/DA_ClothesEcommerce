'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories', [
      {
        name: 'T-Shirt',
        image:
          'https://hstatic.net/640/1000004640/1/2016/4-7/xanhya-021_23dedcff-e930-4671-67c5-8fa2f2d3d094_fbbc85ae-a4d4-40b8-4441-f99a47418edf_large.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Coat',
        image:
          'https://product.hstatic.net/1000369857/product/akk19__3__73bf817e66024169858ab524603b6060.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Pant',
        image:
          'https://lianhinapparel.com/wp-content/uploads/2020/11/men-casual-pant-500x500-1.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Dress',
        image:
          'https://dress.com.vn/wp-content/uploads/serita-dress-00002-600x900.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Shirt',
        image: 'https://cf.shopee.vn/file/467afe6efc1d745da40c9006f4576be3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Skirt',
        image:
          'https://www.collinsdictionary.com/images/full/skirt_214811818_1000.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {});
  },
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ProductImages', [
      {
        productId: 1,
        image:
          'https://vn-live-05.slatic.net/p/717f0a0e33092597321fd7e558730b8a.jpg_720x720q80.jpg_.webp',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 3,
        image:
          'https://lzd-img-global.slatic.net/g/p/da909ed902405a332509c5c9871bfed3.jpg_120x120q80.jpg_.webp',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 2,
        image:
          'https://lzd-img-global.slatic.net/g/p/bcc4655118764728b468e48da8dacc2c.jpg_720x720q80.jpg_.webp',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 2,
        image:
          'https://lzd-img-global.slatic.net/g/p/bcc4655118764728b468e48da8dacc2c.jpg_720x720q80.jpg_.webp',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 4,
        image:
          'https://aristino.com/Data/ResizeImage/images/product/so-mi-dai-tay/alsr10/ao-so-mi-ALSR10-01x900x900x4.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 4,
        image:
          'https://aristino.com/Data/ResizeImage/images/product/so-mi-dai-tay/alsr10/ao-so-mi-ALSR10-03x900x900x4.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ProductImages', null, {});
  },
};

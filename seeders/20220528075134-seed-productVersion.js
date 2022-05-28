'use strict';

const { COLORS, SIZES } = require('../constants/constants');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ProductVersions', [
      {
        productId: 1,
        color: COLORS.WHITE,
        size: SIZES.M,
        price: 180000,
        quantity: 100,
        image:
          'https://vn-live-05.slatic.net/p/31843d37df194953c5fae1e048b6e951.jpg_720x720q80.jpg_.webp',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 1,
        color: COLORS.WHITE,
        size: SIZES.L,
        price: 180000,
        quantity: 100,
        image:
          'https://vn-live-05.slatic.net/p/31843d37df194953c5fae1e048b6e951.jpg_720x720q80.jpg_.webp',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 1,
        color: COLORS.WHITE,
        size: SIZES.XL,
        price: 180000,
        quantity: 100,
        image:
          'https://vn-live-05.slatic.net/p/31843d37df194953c5fae1e048b6e951.jpg_720x720q80.jpg_.webp',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 1,
        color: COLORS.BLACK,
        size: SIZES.M,
        price: 200000,
        quantity: 100,
        image:
          'https://vn-live-05.slatic.net/p/5f884fb132969d9827c87b7f86c5ff65.jpg_720x720q80.jpg_.webp',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 1,
        color: COLORS.BLACK,
        size: SIZES.L,
        price: 200000,
        quantity: 100,
        image:
          'https://vn-live-05.slatic.net/p/5f884fb132969d9827c87b7f86c5ff65.jpg_720x720q80.jpg_.webp',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 1,
        color: COLORS.BLACK,
        size: SIZES.XL,
        price: 200000,
        quantity: 100,
        image:
          'https://vn-live-05.slatic.net/p/5f884fb132969d9827c87b7f86c5ff65.jpg_720x720q80.jpg_.webp',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 2,
        color: COLORS.BLACK,
        size: SIZES.M,
        price: 631000,
        quantity: 100,
        image:
          'https://lzd-img-global.slatic.net/g/p/bcc4655118764728b468e48da8dacc2c.jpg_720x720q80.jpg_.webp',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 2,
        color: COLORS.BLACK,
        size: SIZES.L,
        price: 650000,
        quantity: 100,
        image:
          'https://lzd-img-global.slatic.net/g/p/bcc4655118764728b468e48da8dacc2c.jpg_720x720q80.jpg_.webp',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 2,
        color: COLORS.BLACK,
        size: SIZES.XL,
        price: 700000,
        quantity: 100,
        image:
          'https://lzd-img-global.slatic.net/g/p/bcc4655118764728b468e48da8dacc2c.jpg_720x720q80.jpg_.webp',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 3,
        color: COLORS.WHITE,
        size: SIZES.M,
        price: 50000,
        quantity: 100,
        image:
          'https://lzd-img-global.slatic.net/g/p/7d44cb4869388e25990b1e1afe827147.jpg_720x720q80.jpg_.webp',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 3,
        color: COLORS.WHITE,
        size: SIZES.L,
        price: 50000,
        quantity: 100,
        image:
          'https://lzd-img-global.slatic.net/g/p/7d44cb4869388e25990b1e1afe827147.jpg_720x720q80.jpg_.webp',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 3,
        color: COLORS.BLACK,
        size: SIZES.M,
        price: 50000,
        quantity: 100,
        image:
          'https://lzd-img-global.slatic.net/g/p/da909ed902405a332509c5c9871bfed3.jpg_720x720q80.jpg_.webp',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 3,
        color: COLORS.BLACK,
        size: SIZES.L,
        price: 50000,
        quantity: 100,
        image:
          'https://lzd-img-global.slatic.net/g/p/da909ed902405a332509c5c9871bfed3.jpg_720x720q80.jpg_.webp',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 4,
        color: COLORS.WHITE,
        size: SIZES.M,
        price: 750000,
        quantity: 100,
        image:
          'https://aristino.com/Data/ResizeImage/images/product/so-mi-dai-tay/alsr10/ao-so-mi-ALSR10-01x900x900x4.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 4,
        color: COLORS.WHITE,
        size: SIZES.L,
        price: 750000,
        quantity: 100,
        image:
          'https://aristino.com/Data/ResizeImage/images/product/so-mi-dai-tay/alsr10/ao-so-mi-ALSR10-01x900x900x4.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {},
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Shops', [
      {
        name: 'Long Shop',
        description: 'Our shop specializes in providing model clothes for men',
        userId: 2,
        cityId: '48',
        districtId: '490',
        wardId: '20203',
        avatar:
          'https://danangaz.com/wp-content/uploads/2018/07/31322662064_ecfc58646a_o.jpg',
        coverImage:
          'https://www.aljazeera.com/wp-content/uploads/2022/01/shops.jpg?fit=1024%2C576',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'LOUIS VUITTON',
        description: 'We provide the luxury products',
        userId: 3,
        cityId: '49',
        districtId: '507',
        wardId: '20551',
        avatar:
          'https://inkythuatso.com/uploads/thumbnails/800/2021/11/logo-lv-inkythuatso-01-02-13-52-56.jpg',
        coverImage:
          'https://cdn3.dhht.vn/wp-content/uploads/2020/09/danh-gia-dong-ho-louis-vuitton-lv-xuat-xu-gia-nhuoc-diem-1.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'GUCCI',
        description:
          'We make the international fashion, luxury products, go global and go viral',
        userId: 4,
        cityId: '48',
        districtId: '491',
        wardId: '20203',
        avatar:
          'https://gudlogo.com/wp-content/uploads/2019/11/gucci-logo-su-hinh-thanh-va-phat-trien.jpg',
        coverImage:
          'https://www.reviewcathegioi.com/wp-content/uploads/2021/06/a-1.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Shops', null, {});
  },
};

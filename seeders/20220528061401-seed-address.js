'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      'Addresses',
      [
        {
          userId: 2,
          cityId: '51',
          districtId: '533',
          wardId: '21421',
          detail: 'Thôn Phước Thịnh',
          name: 'Ngo Cong Long',
          phone: '0989898989',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          cityId: '48',
          districtId: '490',
          wardId: '20203',
          detail: '470 Kinh Duong Vuong',
          name: 'Long Ngo',
          phone: '0989898989',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          cityId: '49',
          districtId: '507',
          wardId: '20551',
          detail: 'Thon ...',
          name: 'Bao Duong',
          phone: '0989898989',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Addresses', null, {});
  },
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'ShippingUnits',
      [
        {
          name: 'Express delivery',
          description: '2 days delivery commitment',
          workingTime: 'All days except Sunday and holidays',
          fee: 45.0,
          maxOrderValue: 5000000.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Standard delivery',
          description: 'Guaranteed safety, delivery time from 3 to 5 days',
          workingTime: 'All days except Sunday',
          fee: 20.0,
          maxOrderValue: 5000000.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Postal delivery',
          description:
            'Suitable for small-sized items, safe, committed to compensate for shipping problems',
          workingTime: 'All days except Sunday',
          fee: 13.0,
          maxOrderValue: 5000000.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ShippingUnits', null, {});
  },
};

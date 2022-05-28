'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'admin',
          email: 'admin@gmail.com',
          password:
            '$2a$10$55ehHt30.561U5QCo4yn/eOSGY.Kac8J2fOEwi50RM.qGGpEDAiZ6',
          gender: 'male',
          avatar: '',
          phone: '0123456789',
          coverImage: '',
          isActive: true,
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Cong Long',
          email: 'nclongkk@gmail.com',
          password:
            '$2a$10$55ehHt30.561U5QCo4yn/eOSGY.Kac8J2fOEwi50RM.qGGpEDAiZ6',
          gender: 'male',
          avatar: '',
          phone: '0395815855',
          coverImage: '',
          facebookId: '2947325648914049',
          isActive: true,
          role: 'member',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Louis Vuitton',
          email: 'louisvuitton@gmail.com',
          password:
            '$2a$10$55ehHt30.561U5QCo4yn/eOSGY.Kac8J2fOEwi50RM.qGGpEDAiZ6',
          gender: 'male',
          avatar:
            'https://inkythuatso.com/uploads/thumbnails/800/2021/11/logo-lv-inkythuatso-01-02-13-52-56.jpg',
          phone: '0123456789',
          coverImage:
            'https://akm-img-a-in.tosshub.com/indiatoday/images/story/201508/lv-story_647_080415040437.jpg?size=770:433',
          isActive: true,
          role: 'member',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Gucci',
          email: 'gucci@gmail.com',
          password:
            '$2a$10$55ehHt30.561U5QCo4yn/eOSGY.Kac8J2fOEwi50RM.qGGpEDAiZ6',
          gender: 'female',
          avatar:
            'https://gudlogo.com/wp-content/uploads/2019/11/gucci-logo-su-hinh-thanh-va-phat-trien.jpg',
          phone: '0123456789',
          coverImage:
            'https://cdn.coingape.com/wp-content/uploads/2021/04/05192923/gucci-non-fungible-tokens-NFT.jpeg',
          isActive: true,
          role: 'member',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Thanh Long',
          email: 'tlong@gmail.com',
          password:
            '$2a$10$55ehHt30.561U5QCo4yn/eOSGY.Kac8J2fOEwi50RM.qGGpEDAiZ6',
          gender: 'male',
          avatar: '',
          phone: '0123456789',
          coverImage: '',
          isActive: true,
          role: 'member',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Duong Van Bao',
          email: 'vbao@gmail.com',
          password:
            '$2a$10$55ehHt30.561U5QCo4yn/eOSGY.Kac8J2fOEwi50RM.qGGpEDAiZ6',
          gender: 'male',
          avatar: '',
          phone: '0123456789',
          coverImage: '',
          isActive: true,
          role: 'member',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Kieu Phuong',
          email: 'kphuong@gmail.com',
          password:
            '$2a$10$55ehHt30.561U5QCo4yn/eOSGY.Kac8J2fOEwi50RM.qGGpEDAiZ6',
          gender: 'female',
          avatar: '',
          phone: '0123456789',
          coverImage: '',
          isActive: true,
          role: 'member',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};

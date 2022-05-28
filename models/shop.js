'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shop extends Model {
    static associate(models) {
      Shop.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'owner',
        onDelete: 'CASCADE',
      });
      Shop.belongsTo(models.City, {
        foreignKey: 'cityId',
        as: 'city',
      });
      Shop.belongsTo(models.District, {
        foreignKey: 'districtId',
        as: 'district',
      });
      Shop.belongsTo(models.Ward, {
        foreignKey: 'wardId',
        as: 'ward',
      });
      Shop.hasMany(models.Product, { foreignKey: 'shopId', as: 'products' });
    }
  }
  Shop.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      cityId: DataTypes.STRING,
      districtId: DataTypes.STRING,
      wardId: DataTypes.STRING,
      coverImage: DataTypes.STRING,
      avatar: DataTypes.STRING,
      addressDetail: DataTypes.STRING,
      phone: DataTypes.STRING,
      paypalMail: DataTypes.STRING,
      avgRatings: DataTypes.FLOAT,
      totalRatings: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Shop',
    }
  );
  return Shop;
};

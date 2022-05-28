'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShopRating extends Model {
    static associate(models) {
      ShopRating.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
      });
      ShopRating.belongsTo(models.Shop, {
        foreignKey: 'shopId',
        as: 'shop',
        onDelete: 'CASCADE',
      });
    }
  }
  ShopRating.init(
    {
      userId: DataTypes.INTEGER,
      shopId: DataTypes.INTEGER,
      rating: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'ShopRating',
    }
  );
  return ShopRating;
};

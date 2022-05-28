'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    static associate(models) {
      Wishlist.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product',
      });
      Wishlist.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  Wishlist.init(
    {
      productId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'WishlistItem',
    }
  );
  return Wishlist;
};

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      CartItem.belongsTo(models.ProductVersion, {
        foreignKey: 'productVersionId',
        as: 'productVersion',
        onDelete: 'CASCADE',
      });
      CartItem.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
      });
    }
  }
  CartItem.init(
    {
      userId: DataTypes.INTEGER,
      productVersionId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'CartItem',
    }
  );
  return CartItem;
};

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductVersion extends Model {
    static associate(models) {
      ProductVersion.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product',
        onDelete: 'CASCADE',
      });
      ProductVersion.hasMany(models.CartItem, {
        foreignKey: 'productVersionId',
        as: 'cartItems',
      });
    }
  }
  ProductVersion.init(
    {
      productId: DataTypes.INTEGER,
      size: DataTypes.STRING,
      color: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      price: DataTypes.FLOAT,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'ProductVersion',
    }
  );
  return ProductVersion;
};

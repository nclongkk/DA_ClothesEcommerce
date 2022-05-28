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
    }
  }
  ProductVersion.init(
    {
      productId: DataTypes.INTEGER,
      color: DataTypes.STRING,
      size: DataTypes.STRING,
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

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Shop, {
        foreignKey: 'shopId',
        as: 'shop',
        onDelete: 'CASCADE',
      });
      Product.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category',
        onDelete: 'CASCADE',
      });
      Product.hasMany(models.ProductVersion, {
        foreignKey: 'productId',
        as: 'productVersions',
      });
      Product.hasMany(models.ProductImage, {
        foreignKey: 'productId',
        as: 'images',
      });
      Product.hasMany(models.WishlistItem, {
        foreignKey: 'productId',
        as: 'wishlistItems',
      });
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      categoryId: DataTypes.INTEGER,
      shopId: DataTypes.INTEGER,
      soldQuantity: DataTypes.INTEGER,
      avgRatings: DataTypes.FLOAT,
      totalRatings: DataTypes.INTEGER,
      totalVersions: DataTypes.INTEGER,
      minPrice: DataTypes.FLOAT,
      maxPrice: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'Product',
    }
  );
  return Product;
};

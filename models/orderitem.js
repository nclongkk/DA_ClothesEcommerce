'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      OrderItem.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order',
        onDelete: 'CASCADE',
      });
      OrderItem.belongsTo(models.ProductVersion, {
        foreignKey: 'productVersionId',
        as: 'productVersion',
        onDelete: 'CASCADE',
      });
      OrderItem.hasOne(models.Feedback, {
        foreignKey: 'orderItemId',
        as: 'feedback',
      });
    }
  }
  OrderItem.init(
    {
      productVersionId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      orderId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'OrderItem',
    }
  );
  return OrderItem;
};

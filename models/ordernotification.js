'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderNotification extends Model {
    static associate(models) {
      OrderNotification.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order',
        onDelete: 'CASCADE',
      });
    }
  }
  OrderNotification.init(
    {
      orderId: DataTypes.INTEGER,
      receiverUserId: DataTypes.INTEGER,
      message: DataTypes.STRING,
      isRead: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'OrderNotification',
    }
  );
  return OrderNotification;
};

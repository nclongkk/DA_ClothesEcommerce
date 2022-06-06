'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
      });
      Transaction.belongsTo(models.Shop, {
        foreignKey: 'shopId',
        as: 'shop',
        onDelete: 'CASCADE',
      });
      Transaction.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order',
        onDelete: 'CASCADE',
      });
    }
  }
  Transaction.init(
    {
      userId: DataTypes.INTEGER,
      shopId: DataTypes.INTEGER,
      orderId: DataTypes.INTEGER,
      status: DataTypes.STRING,
      senderPayPalMail: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Transaction',
    }
  );
  return Transaction;
};

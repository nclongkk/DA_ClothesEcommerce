'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
      });
      Order.belongsTo(models.Shop, {
        foreignKey: 'shopId',
        as: 'shop',
        onDelete: 'CASCADE',
      });
      Order.belongsTo(models.Promotion, {
        foreignKey: 'promotionId',
        as: 'promotion',
        onDelete: 'CASCADE',
      });
      Order.belongsTo(models.ShippingUnit, {
        foreignKey: 'shippingUnitId',
        as: 'shippingUnit',
        onDelete: 'CASCADE',
      });
      Order.belongsTo(models.Address, {
        foreignKey: 'addressId',
        as: 'address',
        onDelete: 'CASCADE',
      });
      Order.hasMany(models.OrderItem, {
        foreignKey: 'orderId',
        as: 'orderItems',
      });
      Order.hasOne(models.Transaction, {
        foreignKey: 'orderId',
        as: 'transaction',
      });
    }
  }
  Order.init(
    {
      addressId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      shopId: DataTypes.INTEGER,
      isPurchased: DataTypes.BOOLEAN,
      serviceFeePercentage: DataTypes.FLOAT,
      promotionId: DataTypes.INTEGER,
      shippingUnitId: DataTypes.INTEGER,
      status: DataTypes.STRING,
      amount: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'Order',
    }
  );
  return Order;
};

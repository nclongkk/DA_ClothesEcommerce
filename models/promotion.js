'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Promotion extends Model {
    static associate(models) {
      Promotion.belongsTo(models.Shop, {
        foreignKey: 'shopId',
        as: 'shop',
      });
    }
  }
  Promotion.init(
    {
      shopId: DataTypes.INTEGER,
      content: DataTypes.STRING,
      discount: DataTypes.FLOAT,
      standarFee: DataTypes.FLOAT,
      expiredAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Promotion',
    }
  );
  return Promotion;
};

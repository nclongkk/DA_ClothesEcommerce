'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShippingUnit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ShippingUnit.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      workingTime: DataTypes.STRING,
      fee: DataTypes.FLOAT,
      maxOrderValue: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'ShippingUnit',
    }
  );
  return ShippingUnit;
};

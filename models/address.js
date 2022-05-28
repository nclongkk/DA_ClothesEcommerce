'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Address.belongsTo(models.City, {
        foreignKey: 'cityId',
        as: 'city',
      });
      Address.belongsTo(models.District, {
        foreignKey: 'districtId',
        as: 'district',
      });
      Address.belongsTo(models.Ward, {
        foreignKey: 'wardId',
        as: 'ward',
      });
    }
  }
  Address.init(
    {
      userId: DataTypes.INTEGER,
      cityId: DataTypes.STRING,
      districtId: DataTypes.STRING,
      wardId: DataTypes.STRING,
      detail: DataTypes.STRING,
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Address',
    }
  );
  return Address;
};

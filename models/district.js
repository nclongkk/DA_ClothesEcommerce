'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class District extends Model {
    static associate(models) {}
  }
  District.init(
    {
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      cityId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'District',
    }
  );
  return District;
};

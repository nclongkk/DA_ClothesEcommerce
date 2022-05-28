'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CodeVerify extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CodeVerify.init(
    {
      code: DataTypes.STRING,
      email: DataTypes.STRING,
      name: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'CodeVerify',
    }
  );
  return CodeVerify;
};

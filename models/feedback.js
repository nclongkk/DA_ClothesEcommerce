'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    static associate(models) {
      Feedback.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product',
        onDelete: 'CASCADE',
      });
      Feedback.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
      });
      Feedback.belongsTo(models.OrderItem, {
        foreignKey: 'orderItemId',
        as: 'orderItem',
        onDelete: 'CASCADE',
      });
      Feedback.hasMany(models.FeedbackImage, {
        foreignKey: 'feedbackId',
        as: 'feedbackImages',
      });
    }
  }
  Feedback.init(
    {
      userId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      orderItemId: DataTypes.INTEGER,
      content: DataTypes.STRING,
      rating: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Feedback',
    }
  );
  return Feedback;
};

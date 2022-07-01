'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FeedbackImage extends Model {
    static associate(models) {
      FeedbackImage.belongsTo(models.Feedback, {
        foreignKey: 'feedbackId',
        as: 'feedback',
        onDelete: 'CASCADE',
      });
    }
  }
  FeedbackImage.init(
    {
      feedbackId: DataTypes.INTEGER,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'FeedbackImage',
    }
  );
  return FeedbackImage;
};

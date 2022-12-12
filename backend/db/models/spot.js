'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     Spot.hasMany(models.Review, {foreignKey: "spotId"})
     Spot.hasMany(models.Booking, {foreignKey: "spotId"})
     Spot.hasMany(models.SpotImage, {foriengKey: "spotId"})
    }
  }
  Spot.init(
    {
      ownerId: {
        unique: true,
        type: DataTypes.INTEGER,
      },
      address: {
        unique: true,
        type: DataTypes.STRING,
      },
      city: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      state: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      country: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lat: {
        allowNull: false,
        type: DataTypes.DECIMAL,
      },
      lng: {
        allowNull: false,
        type: DataTypes.DECIMAL,
      },
      name: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
        allowNull:false,
      },
      price: {
        allowNull: false,
        type: DataTypes.DECIMAL,
      },
    },
    {
      sequelize,
      modelName: "Spot",
    }
  );
  return Spot;
};
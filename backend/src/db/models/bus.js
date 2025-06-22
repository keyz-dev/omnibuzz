'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Bus.belongsTo(models.Agency, {
        foreignKey: 'agencyId',
        as: 'agency',
      });
      Bus.belongsTo(models.Station, {
        foreignKey: 'baseStationId',
        as: 'baseStation',
      });
    }
  }
  Bus.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    plateNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    busType: {
      type: DataTypes.ENUM('Classic', 'VIP', 'Standard'),
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seatLayout: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    agencyId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    baseStationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    amenities: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Active', 'Available', 'Under Maintenance', 'Inactive'),
      allowNull: false,
      defaultValue: 'Available',
    },
  }, {
    sequelize,
    modelName: 'Bus',
    timestamps: true,
  });
  return Bus;
};
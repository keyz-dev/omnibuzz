'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Route extends Model {
    static associate(models) {
      Route.belongsTo(models.Agency, {
        foreignKey: 'agencyId',
        as: 'agency',
      });

      Route.belongsTo(models.Station, {
        foreignKey: 'originStationId',
        as: 'originStation',
      });

      Route.belongsTo(models.Station, {
        foreignKey: 'destinationStationId',
        as: 'destinationStation',
      });
    }
  }

  Route.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      agencyId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Agencies',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      originStationId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Stations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      destinationStationId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Stations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      distance: {
        type: DataTypes.FLOAT, //in km
        allowNull: false,
        defaultValue: 0,
      },
      estimatedDuration: {
        type: DataTypes.FLOAT, // in hours
        allowNull: false,
        defaultValue: 0,
      },
      basePrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        defaultValue: 'Active',
      },
    },
    {
      sequelize,
      modelName: 'Route',
      tableName: 'Routes',
      timestamps: true,
    }
  );

  return Route;
};
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    static associate(models) {
      Schedule.belongsTo(models.Route, {
        foreignKey: 'routeId',
        as: 'route',
      });
    }
  }
  Schedule.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      routeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Routes',
          key: 'id',
        },
      },
      departureTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      frequency: {
        type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'one-time'),
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      busType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      activeDays: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'expired'),
        defaultValue: 'active',
        allowNull: false,
      },
      session: {
        type: DataTypes.VIRTUAL,
        get() {
          const time = this.getDataValue('departureTime');
          if (!time) return null;
          const hour = parseInt(time.split(':')[0], 10);
          return hour < 12 ? 'morning' : 'evening';
        },
      },
      estimatedArrivalTime: {
        type: DataTypes.VIRTUAL,
        get() {
          const departureTime = this.getDataValue('departureTime');
          const route = this.get('route'); // Access the associated route

          if (!departureTime || !route || !route.estimatedDuration) {
            return null;
          }

          const [hours, minutes, seconds] = departureTime.split(':').map(Number);
          const departure = new Date();
          departure.setHours(hours, minutes, seconds, 0);

          // Assuming estimatedDuration is in hours (can be a decimal)
          const durationInMilliseconds = route.estimatedDuration * 60 * 60 * 1000;
          const arrival = new Date(departure.getTime() + durationInMilliseconds);

          return arrival.toTimeString().split(' ')[0]; // Format as HH:MM:SS
        },
      },
    },
    {
      sequelize,
      modelName: 'Schedule',
      timestamps: true,
    }
  );
  return Schedule;
};
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StationWorker extends Model {
    static associate(models) {
      // define associations here
      StationWorker.belongsTo(models.Station, {
        foreignKey: "stationId",
        as: "station",
      });
      StationWorker.belongsTo(models.User, {
        foreignKey: "userId",
        as: "worker",
      });
      StationWorker.belongsTo(models.User, {
        foreignKey: "invitedBy",
        as: "inviter",
      });
    }
  }
  StationWorker.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      stationId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Stations",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      role: {
        type: DataTypes.ENUM("station_manager", "ticket_agent"),
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      invitationToken: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Token for invitation link",
      },
      invitationExpires: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Expiration time for invitation token",
      },
      invitedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        comment: "ID of the user who sent the invitation",
      },
      joinedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "StationWorker",
      tableName: "StationWorkers",
      indexes: [
        {
          unique: true,
          fields: ["stationId", "userId"],
        },
      ],
      hooks: {
        beforeCreate: async (worker) => {
          // Generate invitation token if not provided
          if (!worker.invitationToken) {
            worker.invitationToken = Math.random()
              .toString(36)
              .substring(2, 15);
            worker.invitationExpires = new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ); // 7 days
          }
        },
        afterSave: async (worker) => {
          // Update station active status when worker is assigned/removed
          if (worker.changed("stationId")) {
            const oldStationId = worker.previous("stationId");
            const newStationId = worker.stationId;

            // Update old station if exists
            if (oldStationId) {
              const oldStation =
                await worker.sequelize.models.Station.findByPk(oldStationId);
              if (oldStation) {
                await oldStation.updateActiveStatus();
              }
            }

            // Update new station if exists
            if (newStationId) {
              const newStation =
                await worker.sequelize.models.Station.findByPk(newStationId);
              if (newStation) {
                await newStation.updateActiveStatus();
              }
            }
          }
        },
        afterDestroy: async (worker) => {
          // Update station active status when worker is deleted
          if (worker.stationId) {
            const station = await worker.sequelize.models.Station.findByPk(
              worker.stationId
            );
            if (station) {
              await station.updateActiveStatus();
            }
          }
        },
      },
    }
  );
  return StationWorker;
};

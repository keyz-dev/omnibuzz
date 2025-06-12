"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("StationWorkers", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      stationId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Stations",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      role: {
        type: Sequelize.ENUM("station_manager", "ticket_agent"),
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      invitationToken: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Token for invitation link",
      },
      invitationExpires: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Expiration time for invitation token",
      },
      invitedBy: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        comment: "ID of the user who sent the invitation",
      },
      joinedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Add unique constraint for stationId and userId
    await queryInterface.addIndex("StationWorkers", ["stationId", "userId"], {
      unique: true,
      name: "station_workers_station_user_unique",
    });

    // Add indexes for faster lookups
    await queryInterface.addIndex("StationWorkers", ["stationId"], {
      name: "station_workers_station_id_idx",
    });
    await queryInterface.addIndex("StationWorkers", ["userId"], {
      name: "station_workers_user_id_idx",
    });
    await queryInterface.addIndex("StationWorkers", ["invitationToken"], {
      name: "station_workers_invitation_token_idx",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("StationWorkers");
  },
};

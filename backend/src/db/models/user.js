"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const {
  cleanUpInstanceImages,
  cleanupOldImages,
} = require("../../utils/imageCleanup");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define associations here
      User.hasOne(models.Agency, {
        foreignKey: "ownerId",
        as: "ownedAgency",
      });

      // Add many-to-many relationship for agency workers
      User.belongsToMany(models.Agency, {
        through: "StationWorkers",
        foreignKey: "userId",
        as: "workingAgencies",
      });

      // Station relationships
      User.belongsToMany(models.Station, {
        through: "StationWorkers",
        foreignKey: "userId",
        as: "workingStations",
      });
    }

    // Instance method to check password
    async comparePassword(candidatePassword) {
      return bcrypt.compare(candidatePassword, this.password);
    }

    // Helper method to check if user is a station worker
    isStationWorker() {
      return ["station_manager", "ticket_agent"].includes(this.role);
    }

    // Helper method to check if user is an agency worker
    isStationWorker() {
      return ["agency_admin", "station_manager", "ticket_agent"].includes(
        this.role
      );
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: /^\+?[\d\s-]{10,}$/,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true, // Nullable for OAuth users
        validate: {
          len: [6, 100],
        },
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      authProvider: {
        type: DataTypes.ENUM("local", "google"),
        defaultValue: "local",
      },
      role: {
        type: DataTypes.ENUM(
          "passenger",
          "system_admin",
          "agency_admin",
          "station_manager",
          "ticket_agent"
        ),
        defaultValue: "passenger",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      phoneVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      emailVerificationCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emailVerificationExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate: async (user) => {
          // Generate verification code for agency_admin
          if (user.role === "agency_admin" && !user.emailVerified) {
            user.emailVerificationCode = Math.floor(
              100000 + Math.random() * 900000
            ).toString();
            user.emailVerificationExpires = new Date(
              Date.now() + 24 * 60 * 60 * 1000
            ); // 24 hours
          }
        },
        beforeSave: async (user) => {
          // Only hash the password if it has been modified (or is new)
          if (user.changed("password") && user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }

          // Clean up old avatar if it's being changed
          if (user.changed("avatar") && user.previous("avatar")) {
            await cleanupOldImages(user, { avatar: user.previous("avatar") });
          }
        },
        beforeDestroy: async (user) => {
          // Clean up avatar when user is deleted
          await cleanUpInstanceImages(user);
        },
      },
    }
  );
  return User;
};

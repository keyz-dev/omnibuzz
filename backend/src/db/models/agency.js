"use strict";
const { Model } = require("sequelize");
const TownUtils = require("../../utils/townUtils");
const {
  cleanUpInstanceImages,
  cleanupOldImages,
} = require("../../utils/imageCleanup");

module.exports = (sequelize, DataTypes) => {
  class Agency extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define associations here
      Agency.hasMany(models.Station, {
        foreignKey: "agencyId",
        as: "stations",
      });
      Agency.hasMany(models.VerificationDocument, {
        foreignKey: "agencyId",
        as: "verificationDocuments",
      });
      Agency.belongsTo(models.User, {
        foreignKey: "ownerId",
        as: "owner",
      });

      // Add many-to-many relationship for agency workers
      Agency.belongsToMany(models.User, {
        through: "StationWorkers",
        foreignKey: "agencyId",
        as: "workers",
      });

      Agency.hasMany(models.Bus, {
        foreignKey: 'agencyId',
        as: 'buses',
      });
    }

    // Method to check if agency can be published
    async canBePublished() {
      try {
        const stationCount = await this.countStations();
        if (stationCount === 0) {
          return false;
        }
        const documents = await this.getVerificationDocuments();
        const validDocuments = documents.every((doc) => doc.status === "approved")

        return validDocuments;
      } catch (error) {
        console.error("Error checking publishing status:", error);
        return false;
      }
    }
  }
  Agency.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      headAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
      },
      logo: {
        type: DataTypes.STRING,
      },
      contactInfo: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        defaultValue: [],
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      towns: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        validate: {
          isValidTowns(value) {
            if (!TownUtils.validateTowns(value)) {
              throw new Error("One or more towns are not valid");
            }
          },
        },
      },
      townCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Generated column based on towns array length",
        validate: false, // Disable validation for this field
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      ownerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      coordinates: {
        type: DataTypes.JSONB,
        allowNull: true,
        validate: {
          isCoordinates(value) {
            if (
              value &&
              (typeof value.lat !== "number" || typeof value.lng !== "number")
            ) {
              throw new Error(
                "Coordinates must be an object with numeric lat and lng"
              );
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Agency",
      hooks: {
        beforeSave: async (agency) => {
          // Clean up old images if they're being changed
          if (agency.changed("logo") && agency.previous("logo")) {
            await cleanupOldImages(agency, {
              logo: agency.previous("logo"),
            });
          }
          if (agency.changed("images")) {
            const oldImages = agency.previous("images") || [];
            const newImages = agency.images || [];
            const removedImages = oldImages.filter(
              (img) => !newImages.includes(img)
            );
            if (removedImages.length > 0) {
              await cleanupOldImages(agency, { images: removedImages });
            }
          }
        },
        beforeDestroy: async (agency) => {
          // Clean up all images when agency is deleted
          await cleanUpInstanceImages(agency);
        },
      },
    }
  );
  return Agency;
};

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
    }

    // Method to check if agency can be published
    async canBePublished() {
      try {
        // 1. Check if agency has at least one station
        const stationCount = await this.countStations();
        if (stationCount === 0) {
          return false;
        }

        // 2. Define required document types
        const requiredDocuments = [
          "business_registration",
          "tax_clearance",
          "operating_license",
        ];

        // 3. Get all verification documents
        const documents = await this.getVerificationDocuments();

        // 4. Check if all required documents exist and are approved
        for (const requiredType of requiredDocuments) {
          const document = documents.find((doc) => doc.type === requiredType);
          if (!document || document.status !== "approved") {
            return false;
          }
        }

        return true;
      } catch (error) {
        console.error("Error checking publishing status:", error);
        return false;
      }
    }

    // Method to update publishing status
    async updatePublishingStatus() {
      const canPublish = await this.canBePublished();
      if (this.isPublished !== canPublish) {
        this.isPublished = canPublish;
        await this.save();
      }
      return canPublish;
    }

    // Method to get verification status details
    async getVerificationStatus() {
      const stationCount = await this.countStations();
      const documents = await this.getVerificationDocuments();

      const requiredDocuments = [
        "business_registration",
        "tax_clearance",
        "operating_license",
      ];

      const documentStatus = requiredDocuments.map((type) => {
        const doc = documents.find((d) => d.type === type);
        return {
          type,
          status: doc ? doc.status : "missing",
          documentId: doc ? doc.id : null,
        };
      });

      return {
        canBePublished: await this.canBePublished(),
        requirements: {
          hasStation: stationCount > 0,
          stationCount,
          documents: documentStatus,
        },
      };
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

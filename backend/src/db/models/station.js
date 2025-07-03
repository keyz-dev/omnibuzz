"use strict";
const { Model } = require("sequelize");
const TownUtils = require("../../utils/townUtils");
const { isLocalImageUrl, isCloudinaryUrl } = require("../../utils/imageUtils");
const {
  cleanUpInstanceImages,
  cleanupOldImages,
} = require("../../utils/imageCleanup");
const { formatImageUrl } = require("../../utils/agencyProfileUtils");

module.exports = (sequelize, DataTypes) => {
  class Station extends Model {
    static associate(models) {
      // define associations here
      Station.belongsTo(models.Agency, {
        foreignKey: "agencyId",
        as: "agency",
      });

      // Add association with StationWorker
      Station.hasMany(models.StationWorker, {
        foreignKey: "stationId",
        as: "workers",
      });

      Station.hasMany(models.Bus, {
        foreignKey: 'baseStationId',
        as: 'buses',
      });
    }

    // Method to add a destination
    async addDestination(destinationTown) {
      const town = TownUtils.getTownByName(destinationTown);

      if (!town) {
        throw new Error("Invalid destination town");
      }

      if (town.name.toLowerCase() === this.baseTown.toLowerCase()) {
        throw new Error("Cannot add station's own town as destination");
      }

      if (!this.destinations.includes(town.name)) {
        this.destinations = [...this.destinations, town.name];
        await this.save();
      }

      return this;
    }

    // Method to remove a destination
    async removeDestination(destinationTown) {
      this.destinations = this.destinations.filter(
        (town) => town.toLowerCase() !== destinationTown.toLowerCase()
      );
      await this.save();
      return this;
    }

    // Method to check if a town is a valid destination
    isDestination(townName) {
      return this.destinations.some(
        (town) => town.toLowerCase() === townName.toLowerCase()
      );
    }

    // Method to update active status based on workers
    async updateActiveStatus() {
      const workerCount = await this.countWorkers();
      const shouldBeActive = workerCount > 0;

      if (this.isActive !== shouldBeActive) {
        this.isActive = shouldBeActive;
        await this.save();
      }

      return this.isActive;
    }
  }
  Station.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      neighborhood: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      baseTown: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isValidTown(value) {
            const town = TownUtils.getTownByName(value);
            if (!town) {
              throw new Error("Invalid town");
            }
          },
        },
      },
      destinations: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        validate: {
          isValidDestinations(value) {
            if (!Array.isArray(value)) {
              throw new Error("Destinations must be an array");
            }

            const baseTown = this.baseTown;
            const invalidTowns = value.filter((town) => {
              const townInfo = TownUtils.getTownByName(town);
              return (
                !townInfo ||
                townInfo.name.toLowerCase() === baseTown.toLowerCase()
              );
            });

            if (invalidTowns.length > 0) {
              throw new Error(
                `Invalid destinations: ${invalidTowns.join(", ")}`
              );
            }
          },
        },
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        validate: {
          isValidImages(value) {
            if (!Array.isArray(value)) {
              throw new Error("Images must be an array");
            }

            // Validate each image path/URL based on environment
            const invalidPaths = value.filter((path) => {
              if (process.env.NODE_ENV === "production") {
                return !isCloudinaryUrl(path);
              } else {
                return !isLocalImageUrl(path);
              }
            });

            if (invalidPaths.length > 0) {
              throw new Error(
                process.env.NODE_ENV === "production"
                  ? "All images must be Cloudinary URLs in production"
                  : "All images must be local file paths in development"
              );
            }
          },
        },
        get() {
          const images = this.getDataValue("images");
          return images.map((image) => formatImageUrl(image));
        },
      },
      agencyId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Agencies",
          key: "id",
        },
      },
      contactInfo: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        defaultValue: [],
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      coordinates: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {
          lat: null,
          lng: null,
        },
        validate: {
          isValidCoordinates(value) {
            if (!value || typeof value !== "object") {
              throw new Error("Coordinates must be an object");
            }
            if (
              typeof value.lat !== "number" ||
              typeof value.lng !== "number"
            ) {
              throw new Error(
                "Coordinates must have numeric lat and lng values"
              );
            }
            if (value.lat < -90 || value.lat > 90) {
              throw new Error("Latitude must be between -90 and 90");
            }
            if (value.lng < -180 || value.lng > 180) {
              throw new Error("Longitude must be between -180 and 180");
            }
          },
        },
      },
      // Payment Information
      paymentMethods: {
        type: DataTypes.JSONB,
        defaultValue: [],
        validate: {
          isValidPaymentMethods(value) {
            if (!Array.isArray(value)) {
              throw new Error("Payment methods must be an array");
            }

            value.forEach((item, idx) => {
              if (
                !item ||
                typeof item !== "object" ||
                !item.method ||
                !item.value ||
                !item.value.accountNumber ||
                !item.value.accountName
              ) {
                throw new Error(
                  `Payment method #${idx + 1} is invalid – requires { method:'OM|MoMo', value:{ accountNumber, accountName } }`
                );
              }

              if (!["OM", "MoMo"].includes(item.method)) {
                throw new Error(
                  `Payment method #${idx + 1}: method must be 'OM' or 'MoMo'`
                );
              }
            });
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Station",
      hooks: {
        beforeSave: async (station) => {
          // Clean up old images if they're being changed
          if (station.changed("images")) {
            const oldImages = station.previous("images") || [];
            const newImages = station.images || [];
            const removedImages = oldImages.filter(
              (img) => !newImages.includes(img)
            );
            if (removedImages.length > 0) {
              await cleanupOldImages(station, { images: removedImages });
            }
          }
        },
        beforeDestroy: async (station) => {
          // Clean up all images when station is deleted
          await cleanUpInstanceImages(station);
        },
      },
    }
  );
  return Station;
};

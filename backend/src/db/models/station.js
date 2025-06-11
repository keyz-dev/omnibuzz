"use strict";
const { Model } = require("sequelize");
const TownUtils = require("../../utils/townUtils");
const { isLocalImageUrl, isCloudinaryUrl } = require("../../utils/imageUtils");
const { cleanupImages, cleanupOldImages } = require("../../utils/imageCleanup");

module.exports = (sequelize, DataTypes) => {
  class Station extends Model {
    static associate(models) {
      // define associations here
      Station.belongsTo(models.Agency, {
        foreignKey: "agencyId",
        as: "agency",
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

            const station = this;
            const invalidTowns = value.filter((town) => {
              const townInfo = TownUtils.getTownByName(town);
              return (
                !townInfo ||
                townInfo.name.toLowerCase() === station.baseTown.toLowerCase()
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
      },
      agencyId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Agencies",
          key: "id",
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
          await cleanupImages(station);
        },
      },
    }
  );
  return Station;
};

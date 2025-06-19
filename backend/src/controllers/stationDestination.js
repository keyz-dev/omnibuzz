const { Station, Agency, User } = require("../db/models");
const { validateRequest } = require("../utils/validation");
const { formatStationData } = require("../utils/agencyProfileUtils");
const {
  addDestinationSchema,
  removeDestinationSchema,
} = require("../schemas/stationSchema");
const { ValidationError } = require("../utils/error");
const TownUtils = require("../utils/townUtils");

class StationDestinationController {
  // Add destination to station
  async addDestination(req, res, next) {
    try {
      const { error, value } = validateRequest(req.body, addDestinationSchema);
      if (error) {
        throw new ValidationError(error.details[0].message);
      }

      const station = await Station.findByPk(req.params.id, {
        include: [
          {
            model: Agency,
            as: "agency",
          },
        ],
      });

      if (!station) {
        return res.status(404).json({
          success: false,
          message: "Station not found",
        });
      }

      // Check if user is authorized
      if (
        station.agency.ownerId !== req.user.id &&
        !req.user.role.includes("admin")
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to modify this station",
        });
      }

      // Add destination
      await station.addDestination(value.destinationTown);

      // Return updated station
      const updatedStation = await Station.findByPk(station.id, {
        include: [
          {
            model: Agency,
            as: "agency",
            include: [
              {
                model: User,
                as: "owner",
                attributes: ["id", "fullName", "email", "avatar"],
              },
            ],
          },
        ],
      });

      // Format station data
      const formattedStation = formatStationData(updatedStation);

      res.json({
        success: true,
        data: formattedStation,
      });
    } catch (error) {
      next(error);
    }
  }

  // Remove destination from station
  async removeDestination(req, res, next) {
    try {
      const { error, value } = validateRequest(
        req.body,
        removeDestinationSchema
      );
      if (error) {
        throw new ValidationError(error.details[0].message);
      }

      const station = await Station.findByPk(req.params.id, {
        include: [
          {
            model: Agency,
            as: "agency",
          },
        ],
      });

      if (!station) {
        return res.status(404).json({
          success: false,
          message: "Station not found",
        });
      }

      // Check if user is authorized
      if (
        station.agency.ownerId !== req.user.id &&
        !req.user.role.includes("admin")
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to modify this station",
        });
      }

      // Remove destination
      await station.removeDestination(value.destinationTown);

      // Return updated station
      const updatedStation = await Station.findByPk(station.id, {
        include: [
          {
            model: Agency,
            as: "agency",
            include: [
              {
                model: User,
                as: "owner",
                attributes: ["id", "fullName", "email", "avatar"],
              },
            ],
          },
        ],
      });

      // Format station data
      const formattedStation = formatStationData(updatedStation);

      res.json({
        success: true,
        data: formattedStation,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get station destinations
  async getDestinations(req, res, next) {
    try {
      const station = await Station.findByPk(req.params.id, {
        attributes: ["id", "baseTown", "destinations"],
      });

      if (!station) {
        return res.status(404).json({
          success: false,
          message: "Station not found",
        });
      }

      // Get town details for each destination
      const destinations = station.destinations.map((townName) => {
        const town = TownUtils.getTownByName(townName);
        return {
          name: town.name,
          code: town.code,
          region: town.region,
        };
      });

      res.json({
        success: true,
        data: {
          baseTown: {
            name: station.baseTown,
            ...TownUtils.getTownByName(station.baseTown),
          },
          destinations,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = StationDestinationController;

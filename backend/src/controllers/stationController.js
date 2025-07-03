const { Station, Agency, User, StationWorker } = require("../db/models");
const {
  createStationSchema,
  updateStationSchema,
} = require("../schemas/stationSchema");
const { ValidationError } = require("../utils/errors");
const { Op } = require("sequelize");
const {
  cleanUpInstanceImages,
  cleanUpFileImages,
} = require("../utils/imageCleanup");
const { validateRequest } = require("../utils/validation");

class StationController {
  // Get all stations with pagination and filters
  async getAll(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        isPublished,
        isVerified,
        agencyId,
      } = req.query;

      const offset = (page - 1) * limit;
      const where = {};

      // Add search filter
      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { address: { [Op.iLike]: `%${search}%` } },
        ];
      }

      // Add boolean filters
      if (isPublished !== undefined) {
        where.isPublished = isPublished === "true";
      }
      if (isVerified !== undefined) {
        where.isVerified = isVerified === "true";
      }

      // Add agency filter
      if (agencyId) {
        where.agencyId = agencyId;
      }

      const { count, rows: stations } = await Station.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [
          {
            model: Agency,
            as: "agency",
            attributes: ["id", "name", "logo"],
          },
          {
            model: User,
            as: "creator",
            attributes: ["id", "fullName", "email", "avatar"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.json({
        success: true,
        data: stations,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Create a new station
  async create(req, res, next) {
    try {
      // Parse JSON fields
      req.body.coordinates = JSON.parse(req.body.coordinates);
      req.body.contactInfo = JSON.parse(req.body.contactInfo);
      req.body.paymentMethods = JSON.parse(req.body.paymentMethods);
      req.body.destinations = JSON.parse(req.body.destinations);

      const { error, value } = validateRequest(req.body, createStationSchema);
      if (error) {
        throw new ValidationError(error.details[0].message);
      }
      // Handle file uploads
      const fileData = {};
      if (req.files && req.files.images) {
        fileData.images = req.files.images.map((file) => file.path);
      }

      // Create station
      const station = await Station.create({
        ...value,
        ...fileData,
        isActive: false,
        createdBy: req.user.id,
        agencyId: req.agency.id,
      });

      res.status(201).json({
        success: true,
        data: station,
      });
    } catch (error) {
      if (req.files) {
        await cleanUpFileImages(req);
      }
      next(error);
    }
  }

  // Get station by ID
  async getById(req, res, next) {
    try {
      const station = await Station.findByPk(req.params.id, {
        include: [
          {
            model: Agency,
            as: "agency",
            attributes: ["id", "name", "logo"],
          },
          {
            model: User,
            as: "creator",
            attributes: ["id", "fullName", "email", "avatar"],
          },
        ],
      });

      if (!station) {
        return res.status(404).json({
          success: false,
          message: "Station not found",
        });
      }

      res.json({
        success: true,
        data: station,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update station
  async update(req, res, next) {
    try {
      // Parse JSON fields if present
      if (req.body.coordinates) {
        req.body.coordinates = JSON.parse(req.body.coordinates);
      }
      if (req.body.contactInfo) {
        req.body.contactInfo = JSON.parse(req.body.contactInfo);
      }
      if (req.body.paymentMethods) {
        req.body.paymentMethods = JSON.parse(req.body.paymentMethods);
      }

      // Validate request body
      const { error, value } = validateRequest(req.body, updateStationSchema);
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

      // Check if user is authorized to update
      if (
        station.agency.ownerId !== req.user.id &&
        !req.user.role.includes("admin")
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this station",
        });
      }

      // Handle file uploads
      const fileData = {};
      if (req.files) {
        if (req.files.images) {
          fileData.images = req.files.images.map((file) => file.path);
        }
      }

      // Update station
      await station.update({
        ...value,
        ...fileData,
      });

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

      res.json({
        success: true,
        data: updatedStation,
      });
    } catch (error) {
      next(error);
    }
  }

  // Remove station
  async remove(req, res, next) {
    try {
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

      // Check if user is authorized to delete
      if (
        station.agency.ownerId !== req.user.id &&
        !req.user.role.includes("admin")
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to delete this station",
        });
      }

      // Clean up images before deleting
      await cleanUpInstanceImages(station);

      // Delete the station
      await station.destroy();

      res.json({
        success: true,
        message: "Station deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Get station by agency ID
  async getByAgencyId(req, res, next) {
    try {
      const { agencyId } = req.params;

      const stations = await Station.findAll({
        where: { agencyId },
        include: [
          {
            model: StationWorker,
            as: "workers",
            required: false,
            where: { role: "station_manager" },
            include: [
              {
                model: User,
                as: "user",
                attributes: ["fullName", "email", "avatar"],
              },
            ],
          },
        ],
      });

      stations.forEach((station) => {
        if (station.workers && station.workers.length > 0) {
          const manager = station.workers[0].user.toJSON();
          station.dataValues.manager = manager;
        } else {
          station.dataValues.manager = null;
        }
        // add mockup data for routes and total bookings
        station.dataValues.activeRoutes = 12
        station.dataValues.totalBookings = 102

        delete station.dataValues.workers;
      });

      res.json({
        success: true,
        data: stations,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StationController();

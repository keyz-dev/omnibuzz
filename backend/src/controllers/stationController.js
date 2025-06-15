const { Station, Agency, User } = require("../db/models");
const {
  createStationSchema,
  updateStationSchema,
  addDestinationSchema,
  removeDestinationSchema,
} = require("../schemas/stationSchema");
const { ValidationError } = require("../utils/errors");
const { Op } = require("sequelize");
const { cleanupImages } = require("../utils/imageCleanup");
const { validateRequest } = require("../utils/validation");
const { isLocalImageUrl } = require("../utils/imageUtils");
const TownUtils = require("../utils/townUtils");
const {
  assignWorkerSchema,
  acceptInvitationSchema,
} = require("../schemas/stationWorkerSchema");
const { generateToken } = require("../utils/jwt");
const emailService = require("../services/emailService");

// Helper function to format image URLs
const formatImageUrl = (image) => {
  if (!image) return null;

  if (isLocalImageUrl(image)) {
    return `${process.env.SERVER_URL}${image}`;
  }
  return image;
};

// Helper function to format station data including images
const formatStationData = (station) => {
  const stationData = station.toJSON();

  // Format images
  if (stationData.images) {
    stationData.images = stationData.images.map((img) => formatImageUrl(img));
  }

  // Format owner avatar if present
  if (
    stationData.agency &&
    stationData.agency.owner &&
    stationData.agency.owner.avatar
  ) {
    stationData.agency.owner.avatar = formatImageUrl(
      stationData.agency.owner.avatar
    );
  }

  return stationData;
};

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

      // Format image URLs
      const formattedStations = stations.map((station) =>
        formatStationData(station)
      );

      res.json({
        success: true,
        data: formattedStations,
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

      const { error, value } = validateRequest(req.body, createStationSchema);
      if (error) {
        throw new ValidationError(error.details[0].message);
      }

      // Handle file uploads
      const fileData = {};
      if (req.files && req.files.stationImages) {
        fileData.images = req.files.stationImages.map((file) => file.path);
      }

      // Create station
      const station = await Station.create({
        ...value,
        ...fileData,
        createdBy: req.user.id,
      });

      // Return created station with agency details
      const stationWithAgency = await Station.findByPk(station.id, {
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
      const formattedStation = formatStationData(stationWithAgency);

      res.status(201).json({
        success: true,
        data: formattedStation,
      });
    } catch (error) {
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

      // Format station data
      const formattedStation = formatStationData(station);

      res.json({
        success: true,
        data: formattedStation,
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
        if (req.files.stationImages) {
          fileData.images = req.files.stationImages.map((file) => file.path);
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
      await cleanupImages(station);

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

  // Assign a worker to a station
  async assignWorker(req, res) {
    try {
      const { error, value } = validateRequest(req.body, assignWorkerSchema);

      if (error) {
        throw new ValidationError(error.details[0].message);
      }

      const { stationId, fullName, email, role, phone } = value;

      // Check if station exists
      const station = await Station.findByPk(stationId, {
        include: [
          {
            model: Agency,
            as: "agency",
            include: [{ model: User, as: "owner" }],
          },
        ],
      });

      if (!station) {
        throw new ValidationError("Station not found");
      }
      // Check if user already exists
      let user = await User.findOne({ where: { email } });
      if (user) {
        // Check if user is already assigned to this station
        const existingWorker = await StationWorker.findOne({
          where: { stationId, userId: user.id },
        });

        if (existingWorker) {
          throw new ValidationError("User is already assigned to this station");
        }
      } else {
        user = await User.create({
          email,
          fullName,
          phone,
          avatar,
          isActive: false,
        });
      }

      // Generate invitation token
      const invitationToken = generateToken({ userId: user.id }, "1d");
      const invitationExpiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ); // 7 days

      // Create station worker record
      const worker = await StationWorker.create({
        stationId,
        userId: user.id,
        role,
        isActive: false,
        invitationToken,
        invitationExpires: invitationExpiresAt,
        invitedBy: req.user.id,
      });

      // Send invitation email
      await emailService.sendEmail({
        to: email,
        subject: "You've been invited to join OmniBuzz",
        template: "staffInvitation",
        data: {
          name: user.fullName,
          role,
          stationName: station.name,
          invitationLink: `${process.env.FRONTEND_URL}/accept-invitation?token=${worker.invitationToken}`,
        },
      });

      res.status(201).json({
        success: true,
        message: "Worker assigned successfully. Invitation sent.",
        data: {
          worker: {
            id: worker.id,
            email,
            fullName,
            role,
            status: worker.status,
          },
        },
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  // Get station workers
  async getWorkers(req, res) {
    try {
      const { id } = req.params;

      // Check if station exists
      const station = await Station.findByPk(id, {
        include: [
          {
            model: Agency,
            as: "agency",
            include: [{ model: User, as: "owner" }],
          },
        ],
      });

      if (!station) {
        throw new ValidationError("Station not found");
      }

      // Get all workers for the station
      const workers = await StationWorker.findAll({
        where: { stationId: id },
        include: [
          {
            model: User,
            as: "user",
            attributes: [
              "id",
              "email",
              "fullName",
              "phone",
              "status",
              "avatar",
            ],
          },
        ],
      });

      res.json({
        success: true,
        data: {
          workers: workers.map((worker) => ({
            id: worker.id,
            role: worker.role,
            status: worker.status,
            user: worker.user,
          })),
        },
      });
    } catch (error) {
      handleError(error, res);
    }
  }
}

module.exports = new StationController();

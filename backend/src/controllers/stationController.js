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
const { formatStationData } = require("../utils/agencyProfileUtils");
const { assignWorkerSchema } = require("../schemas/stationWorkerSchema");
const { generateToken } = require("../utils/jwt");
const emailService = require("../services/emailService");

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
        createdBy: req.user.id,
        agencyId: req.agency.id,
      });

      // Format station data
      const formattedStation = formatStationData(station);

      res.status(201).json({
        success: true,
        data: formattedStation,
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

  // Assign a worker to a station
  async assignWorker(req, res, next) {
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
      let existingWorker = null;
      if (user) {
        // Check if user is already assigned to this station
        existingWorker = await StationWorker.findOne({
          where: { stationId, userId: user.id },
        });

        if (existingWorker) {
          // update user role
          await user.update({ role });
        }
      } else {
        user = await User.create({
          email,
          fullName,
          phone,
          isActive: false,
        });
      }

      // Generate invitation token, signed with the user's email
      const invitationToken = generateToken({ userId: user.id, email }, "1d");
      const invitationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

      // Create station worker record
      const worker = existingWorker || new StationWorker();
      if (!existingWorker) {
        worker.stationId = stationId;
        worker.userId = user.id;
        worker.role = role;
        worker.isActive = false;
        worker.invitationToken = invitationToken;
        worker.invitationExpires = invitationExpiresAt;
        worker.invitedBy = req.user.id;
      }
      await worker.save();

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
      next(error);
    }
  }

  // Get station workers
  async getWorkers(req, res, next) {
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
      next(error);
    }
  }
}

module.exports = new StationController();

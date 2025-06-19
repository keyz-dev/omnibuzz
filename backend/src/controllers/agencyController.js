const { Agency, User, Station, VerificationDocument } = require("../db/models");
const {
  createAgencySchema,
  updateAgencySchema,
} = require("../schemas/agencySchema");
const { ValidationError, NotFoundError } = require("../utils/errors");
const { Op } = require("sequelize");
const {
  cleanUpInstanceImages,
  cleanUpFileImages,
} = require("../utils/imageCleanup");
const { validateRequest } = require("../utils/validation");
const emailService = require("../services/emailService");
const { sequelize } = require("../db/models");
const {
  getStationCompletionStatus,
  getVerificationCompletionStatus,
  formatAgencyData,
} = require("../utils/agencyProfileUtils");
const { generateToken } = require("../utils/jwt");

class AgencyController {
  // Get all agencies with pagination and filters
  async getAll(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        isPublished,
        isVerified,
        town,
      } = req.query;

      const offset = (page - 1) * limit;
      const where = {};

      // Add search filter
      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ];
      }

      // Add boolean filters
      if (isPublished !== undefined) {
        where.isPublished = isPublished === "true";
      }
      if (isVerified !== undefined) {
        where.isVerified = isVerified === "true";
      }

      // Add town filter
      if (town) {
        where.towns = { [Op.contains]: [town] };
      }

      const { count, rows: agencies } = await Agency.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [
          {
            model: User,
            as: "owner",
            attributes: ["id", "fullName", "email", "avatar"],
          },
          {
            model: Station,
            as: "stations",
            attributes: ["id", "name"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      // Format image URLs
      const formattedAgencies = agencies.map((agency) =>
        formatAgencyData(agency)
      );

      res.json({
        success: true,
        data: formattedAgencies,
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

  // Create a new agency
  async create(req, res, next) {
    let fileData = {};
    try {
      req.body.contactInfo = JSON.parse(req.body.contactInfo);
      req.body.towns = JSON.parse(req.body.towns);
      req.body.coordinates = JSON.parse(req.body.coordinates);

      const { error, value } = validateRequest(req.body, createAgencySchema);
      if (error) {
        throw new ValidationError(error.details[0].message);
      }

      // Handle file uploads
      if (req.files) {
        if (req.files.logo && req.files.logo[0]) {
          fileData.logo = req.files.logo[0].path;
        }
        if (req.files.agencyImages) {
          fileData.images = req.files.agencyImages.map((file) => file.path);
        }
      }

      // check if agency already exists
      const existingAgency = await Agency.findOne({
        where: { name: value.name },
      });
      if (existingAgency) {
        throw new ValidationError("Agency already exists");
      }

      // check if user is already an agency admin
      const user = await User.findByPk(req.user.id);
      if (user.role.includes("agency_admin")) {
        throw new ValidationError("User is already an agency admin");
      }

      // Start transaction
      const result = await sequelize.transaction(async (t) => {
        // Create agency
        const agency = await Agency.create(
          {
            ...value,
            ...fileData,
            ownerId: req.user.id,
          },
          { transaction: t }
        );

        await user.update({ role: "agency_admin" }, { transaction: t });

        // Return created agency with owner details
        const agencyWithOwner = await Agency.findByPk(agency.id, {
          include: [
            {
              model: User,
              as: "owner",
              attributes: ["id", "fullName", "email", "role", "avatar"],
            },
          ],
          transaction: t,
        });
        return agencyWithOwner;
      });

      // Format agency data including owner avatar
      const formattedAgency = formatAgencyData(result);

      // Send welcome email to the new agency admin
      await emailService.sendEmail({
        to: req.user.email,
        subject: "Welcome to OmniBuzz Agency Admin",
        template: "agencyAdminWelcome",
        data: {
          name: req.user.fullName,
          agencyName: formattedAgency.name,
          dashboardUrl: `${process.env.FRONTEND_URL}/agency/admin`,
          supportEmail: process.env.SMTP_EMAIL,
          currentYear: new Date().getFullYear(),
        },
      });

      // generate a new token for the user
      const token = await generateToken({ userId: user.id }, "7d");

      res.status(201).json({
        success: true,
        data: { agency: formattedAgency, user: user.toJSON(), token },
      });
    } catch (error) {
      // Delete any uploaded images
      if (req.files || req.file) {
        await cleanUpFileImages(req);
      }
      next(error);
    }
  }

  // GET /api/agencies/:agencyId/profile - Get agency profile completion status
  async getByUserId(req, res, next) {
    try {
      const agency = req.agency;
      if (!agency) {
        throw new NotFoundError("Agency not found");
      }
      const isPublishable = await agency.canBePublished();

      // New completion step statuses
      const stationStatus = getStationCompletionStatus(agency.stations);
      const verificationStatus = getVerificationCompletionStatus(
        agency.verificationDocuments
      );

      const profileData = {
        agency: formatAgencyData(agency),
        isPublishable,
        completionSteps: {
          verification: {
            status: verificationStatus,
            completed: verificationStatus === "completed",
            documentsCount: agency.verificationDocuments.length,
          },
          stations: {
            status: stationStatus,
            completed: stationStatus === "completed",
            stationsCount: agency.stations.length,
          },
        },
      };

      res.json({
        success: true,
        data: profileData,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get agency by ID
  async getById(req, res, next) {
    try {
      const agency = await Agency.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: "owner",
            attributes: ["id", "fullName", "email", "avatar"],
          },
          {
            model: Station,
            as: "stations",
          },
          {
            model: VerificationDocument,
            as: "verificationDocuments",
          },
        ],
      });

      if (!agency) {
        return res.status(404).json({
          success: false,
          message: "Agency not found",
        });
      }
      // Format agency data including owner avatar
      const formattedAgency = formatAgencyData(agency);

      res.json({
        success: true,
        data: formattedAgency,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update agency
  async update(req, res, next) {
    try {
      // Validate request body
      const { error, value } = validateRequest(req.body, updateAgencySchema);
      if (error) {
        throw new ValidationError(error.details[0].message);
      }

      const agency = await Agency.findByPk(req.params.id);
      if (!agency) {
        return res.status(404).json({
          success: false,
          message: "Agency not found",
        });
      }

      // Check if user is authorized to update
      if (agency.ownerId !== req.user.id && !req.user.role.includes("admin")) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this agency",
        });
      }

      // Handle file uploads
      const fileData = {};
      if (req.files) {
        if (req.files.logo && req.files.logo[0]) {
          fileData.logo = req.files.logo[0].path;
        }
        if (req.files.agencyImages) {
          fileData.images = req.files.agencyImages.map((file) => file.path);
        }
      }

      // Update agency
      await agency.update({
        ...value,
        ...fileData,
      });

      // Return updated agency
      const updatedAgency = await Agency.findByPk(agency.id, {
        include: [
          {
            model: User,
            as: "owner",
            attributes: ["id", "fullName", "email", "avatar"],
          },
        ],
      });

      // Format agency data including owner avatar
      const formattedAgency = formatAgencyData(updatedAgency);

      res.json({
        success: true,
        data: formattedAgency,
      });
    } catch (error) {
      next(error);
    }
  }

  // Remove agency
  async remove(req, res, next) {
    try {
      const agency = await Agency.findByPk(req.params.id);

      if (!agency) {
        return res.status(404).json({
          success: false,
          message: "Agency not found",
        });
      }

      // Check if user is authorized to delete
      if (agency.ownerId !== req.user.id && !req.user.role.includes("admin")) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to delete this agency",
        });
      }

      // Clean up images before deleting
      await cleanUpInstanceImages(agency);

      // Delete the agency
      await agency.destroy();

      res.json({
        success: true,
        message: "Agency deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AgencyController();

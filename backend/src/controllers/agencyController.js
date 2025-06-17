const { Agency, User, Station, VerificationDocument } = require("../db/models");
const {
  createAgencySchema,
  updateAgencySchema,
} = require("../schemas/agencySchema");
const { ValidationError } = require("../utils/errors");
const { Op } = require("sequelize");
const { cleanupImages } = require("../utils/imageCleanup");
const { validateRequest } = require("../utils/validation");
const { isLocalImageUrl } = require("../utils/imageUtils");
const emailService = require("../services/emailService");
const { sequelize } = require("../db/models");

// Helper function to format image URLs
const formatImageUrl = (image) => {
  if (!image) return null;

  if (isLocalImageUrl(image)) {
    return `${process.env.SERVER_URL}${image}`;
  }
  return image;
};

// Helper function to format agency data including owner avatar
const formatAgencyData = (agency) => {
  const agencyData = agency.toJSON();

  // Format agency images
  agencyData.logo = formatImageUrl(agencyData.logo);
  if (agencyData.agencyImages) {
    agencyData.agencyImages = agencyData.agencyImages.map((img) =>
      formatImageUrl(img)
    );
  }

  // Format owner avatar if present
  if (agencyData.owner && agencyData.owner.avatar) {
    agencyData.owner.avatar = formatImageUrl(agencyData.owner.avatar);
  }

  return agencyData;
};

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
    try {
      const { error, value } = validateRequest(req.body, createAgencySchema);
      if (error) {
        throw new ValidationError(error.details[0].message);
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

        // Update user role to agency_admin
        await User.update(
          { role: "agency_admin" },
          {
            where: { id: req.user.id },
            transaction: t,
          }
        );

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

      res.status(201).json({
        success: true,
        data: formattedAgency,
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
      await cleanupImages(agency);

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

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class VerificationDocument extends Model {
    static associate(models) {
      VerificationDocument.belongsTo(models.Agency, {
        foreignKey: "agencyId",
        as: "agency",
      });
    }

    // Helper method to check if file type is allowed
    static isAllowedFileType(fileType) {
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/svg",
        "image/ico",
        "image/jpg",
      ];
      return allowedTypes.includes(fileType.toLowerCase());
    }

    // Instance method to get the associated agency
    async getAgency(options) {
      // 'sequelize.models' is available via 'this.sequelize'
      const Agency = this.sequelize.models.Agency;
      return Agency.findByPk(this.agencyId, options);
    }
  }
  VerificationDocument.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM(
          "business_registration",
          "tax_clearance",
          "operating_license",
          "insurance_certificate",
          "safety_certificate",
          "vehicle_registration",
          "driver_license",
          "other"
        ),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      fileType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAllowedFileType(value) {
            if (!VerificationDocument.isAllowedFileType(value)) {
              throw new Error(
                "Invalid file type. Allowed types: PDF, JPEG, PNG"
              );
            }
          },
        },
      },
      status: {
        type: DataTypes.ENUM(["pending", "approved", "rejected"]),
        defaultValue: "pending",
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
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
    },
    {
      sequelize,
      modelName: "VerificationDocument",
      hooks: {
        afterSave: async (document) => {
          // Update agency's publishing status when document status changes
          const agency = await document.getAgency();
          await agency.updatePublishingStatus();
        },
      },
    }
  );
  return VerificationDocument;
};

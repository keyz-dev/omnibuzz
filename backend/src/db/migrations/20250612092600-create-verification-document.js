"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("VerificationDocuments", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      type: {
        type: Sequelize.ENUM(
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
        type: Sequelize.STRING,
        allowNull: false,
        comment: "MIME type of the file (e.g., application/pdf, image/jpeg)",
      },
      status: {
        type: Sequelize.ENUM(["pending", "approved", "rejected"]),
        defaultValue: "pending",
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      agencyId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Agencies",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("VerificationDocuments");
  },
};

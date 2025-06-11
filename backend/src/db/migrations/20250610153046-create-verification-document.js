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
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Type of document (e.g., business_license, tax_certificate)",
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

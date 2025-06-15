"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("VerificationDocuments", "remark", {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: "Admin's remark for approval or rejection",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("VerificationDocuments", "remark");
  },
};

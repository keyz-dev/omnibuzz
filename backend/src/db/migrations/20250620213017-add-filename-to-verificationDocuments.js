'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("VerificationDocuments", "fileName", {
      type: Sequelize.STRING,
      allowNull: false,
      comment: "File name of the document",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("VerificationDocuments", "fileName");
  },
};

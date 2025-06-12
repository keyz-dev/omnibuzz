"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Agencies", "coordinates", {
      type: Sequelize.JSONB,
      allowNull: true,
      comment: "Latitude and longitude coordinates as { lat, lng }",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Agencies", "coordinates");
  },
};

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Stations", "images", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: [],
      allowNull: false,
      comment: "Array of image URLs for the station",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Stations", "images");
  },
};

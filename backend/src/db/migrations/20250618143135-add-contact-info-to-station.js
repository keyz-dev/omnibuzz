"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Stations", "contactInfo", {
      type: Sequelize.ARRAY(Sequelize.JSONB),
      allowNull: true,
      defaultValue: [],
      comment: "Contact information, same structure as agency contactInfo",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Stations", "contactInfo");
  },
};

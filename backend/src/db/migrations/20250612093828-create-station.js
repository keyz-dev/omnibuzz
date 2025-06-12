"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Stations", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      neighborhood: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      baseTown: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      destinations: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
      agencyId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Agencies",
          key: "id",
        },
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      coordinates: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {
          lat: null,
          lng: null,
        },
      },
      paymentMethods: {
        type: Sequelize.JSONB,
        defaultValue: [],
        allowNull: false,
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
    await queryInterface.dropTable("Stations");
  },
};

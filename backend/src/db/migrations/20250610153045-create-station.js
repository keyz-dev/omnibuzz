"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Stations", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
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
        comment: "Neighborhood or quarter where the station is located",
      },
      baseTown: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "The town where this station is located",
      },
      destinations: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
        comment:
          "Array of destination towns where trips from this station can go",
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
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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

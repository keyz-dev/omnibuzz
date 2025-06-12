"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Agencies", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      headAddress: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      logo: {
        type: Sequelize.STRING,
      },
      contactInfo: {
        type: Sequelize.ARRAY(Sequelize.JSONB),
        defaultValue: [],
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      towns: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      townCount: {
        type: "INTEGER GENERATED ALWAYS AS (array_length(towns, 1)) STORED",
        allowNull: false,
      },
      isPublished: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment:
          "Computed based on having at least one station and all verification documents approved",
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: "Indicates if the agency has been verified by admin",
      },
      ownerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
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
    await queryInterface.dropTable("Agencies");
  },
};

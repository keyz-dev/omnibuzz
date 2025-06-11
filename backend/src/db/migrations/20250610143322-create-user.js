"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        comment: "Unique identifier for the user",
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "User's full name",
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
        comment: "User's email address (must be unique)",
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "User's phone number",
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Hashed password (null for OAuth users)",
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "URL to user's profile picture",
      },
      authProvider: {
        type: Sequelize.ENUM("local", "google"),
        defaultValue: "local",
        allowNull: false,
        comment: "Authentication provider (local or google)",
      },
      role: {
        type: Sequelize.ENUM(
          "passenger",
          "system_admin",
          "agency_admin",
          "station_manager",
          "ticket_agent"
        ),
        defaultValue: "passenger",
        allowNull: false,
        comment: "User role in the system",
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: "Whether the user account is active",
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: "Whether the user's email is verified",
      },
      phoneVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: "Whether the user's phone is verified",
      },
      emailVerificationCode: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Code sent for email verification",
      },
      emailVerificationExpires: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Expiration time for email verification code",
      },
      invitationToken: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Token for staff invitation link",
      },
      invitationExpires: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Expiration time for invitation token",
      },
      invitedBy: {
        type: Sequelize.UUID,
        allowNull: true,
        comment: "ID of the agency_admin who sent the invitation",
        references: {
          model: "Users",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        comment: "Timestamp when the user was created",
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        comment: "Timestamp when the user was last updated",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};

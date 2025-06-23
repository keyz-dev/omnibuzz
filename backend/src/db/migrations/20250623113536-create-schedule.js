'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Schedules', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      routeId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Routes',
          key: 'id',
        },
      },
      departureTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      frequency: {
        type: Sequelize.ENUM('daily', 'weekly', 'monthly', 'one-time'),
        allowNull: false,
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      busType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      activeDays: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'expired'),
        defaultValue: 'active',
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Schedules');
  },
};
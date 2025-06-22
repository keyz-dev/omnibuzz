'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Buses', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      plateNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      busType: {
        type: Sequelize.ENUM('Classic', 'VIP', 'Standard'),
        allowNull: false,
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      seatLayout: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      agencyId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Agencies',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      baseStationId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Stations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      amenities: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('Active', 'Available', 'Under Maintenance', 'Inactive'),
        allowNull: false,
        defaultValue: 'Available',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Buses');
  }
};
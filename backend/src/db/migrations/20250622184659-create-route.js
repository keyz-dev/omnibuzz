'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Routes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
      originStationId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Stations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      destinationStationId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Stations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      distance: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      estimatedDuration: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      basePrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('Active', 'Inactive'),
        defaultValue: 'Active',
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
    await queryInterface.dropTable('Routes');
  },
};
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('GroupMembers', 'userId', {
      type: Sequelize.INTEGER,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    });
    await queryInterface.addColumn('GroupMembers', 'groupId', {
      type: Sequelize.UUID,
      references: { model: 'Groups', key: 'id' },
      onDelete: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('GroupMembers', 'userId');
    await queryInterface.removeColumn('GroupMembers', 'groupId');
  }
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const isRoleTableAlreadyExists = await queryInterface.tableExists('role');
    if (!isRoleTableAlreadyExists) {
      await queryInterface.createTable('role', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        roleName: {
          allowNull: false,
          type: Sequelize.STRING,
        },
      });
    } else {
      console.error('Unable to create roles table because its already exists.');
    }
  },

  async down(queryInterface, Sequelize) {
    const isRoleTableAlreadyExists = await queryInterface.tableExists('role');
    if (isRoleTableAlreadyExists) {
      await queryInterface.dropTable('role');
    } else {
      console.error('Table user doesn\'t exist.');
    }
  },
};

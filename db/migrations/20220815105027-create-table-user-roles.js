module.exports = {
  async up(queryInterface, Sequelize) {
    const isUserTableExists = await queryInterface.tableExists('user');
    const isRoleTableExists = await queryInterface.tableExists('role');
    const isUserRolesTableAlreadyExists = await queryInterface.tableExists('user_roles');
    if (!isUserRolesTableAlreadyExists || !isRoleTableExists || !isUserTableExists) {
      await queryInterface.createTable('user_roles', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userId: {
          type: Sequelize.INTEGER,
          onDelete: 'CASCADE',
          allowNull: false,
          references: { model: 'user', key: 'id' },
        },
        roleId: {
          type: Sequelize.INTEGER,
          onDelete: 'CASCADE',
          allowNull: false,
          references: { model: 'role', key: 'id' },
        },
      }, {
        uniqueKeys:
            {
              unique_cityId_roleId: { fields: ['userId', 'roleId'] },
            },
      });
    } else {
      console.error('Migration down.');
    }
  },

  async down(queryInterface, Sequelize) {
    const isUserRoleTableAlreadyExists = await queryInterface.tableExists('user_roles');
    if (isUserRoleTableAlreadyExists) {
      await queryInterface.dropTable('user_roles');
    } else {
      console.error('Table user_roles doesn\'t exist.');
    }
  },
};

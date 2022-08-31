module.exports = {
  async up(queryInterface, Sequelize) {
    const isUserTableExists = await queryInterface.tableExists('comment');
    const isConfirmCodesTableExists = await queryInterface.tableExists('user_confirm_codes');
    if (isUserTableExists && isConfirmCodesTableExists) {
      const isUserIdAlreadyExists = await queryInterface.describeTable('user_confirm_codes');
      if (!isUserIdAlreadyExists.userId) {
        await queryInterface.addColumn('user_confirm_codes', 'userId', {
          type: Sequelize.INTEGER,
          onDelete: 'CASCADE',
          allowNull: false,
          references: { model: 'user', key: 'id' },
        });
      } else {
        console
            .error('Migration can\'t create foreign key because userId already exist');
      }
    } else {
      console
          .error('Migration can\'t create foreign key because user or user_confirm_codes tables doesn\'t exist');
    }
  },

  async down(queryInterface, Sequelize) {
    const isUserTableExists = await queryInterface.tableExists('user');
    if (isUserTableExists) {
      const isUserIdColumnExists = await queryInterface.describeTable('user_confirm_codes');
      if (isUserIdColumnExists.userId) {
        await queryInterface.removeColumn('user_confirm_codes', 'userId');
      }
    } else {
      console.error('Column userId doesn\'t exist');
    }
  },
};

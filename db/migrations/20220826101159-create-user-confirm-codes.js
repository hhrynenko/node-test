const moment = require('moment');

module.exports = {
  async up(queryInterface, Sequelize) {
    const isConfirmCodesTableAlreadyExists = await queryInterface.tableExists('user_confirm_codes');
    if (!isConfirmCodesTableAlreadyExists) {
      await queryInterface.createTable('user_confirm_codes', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        expiresAt: {
          type: Sequelize.DATE,
          defaultValue: moment(moment() + 15 * 60000),
        },
        verifyCode: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
      });
    } else {
      console.error('Unable to create user_confirm_codes table because its already exists.');
    }
  },
  async down(queryInterface, Sequelize) {
    const isConfirmCodesTableExists = await queryInterface.tableExists('user_confirm_codes');
    if (isConfirmCodesTableExists) {
      await queryInterface.dropTable('user_confirm_codes');
    } else {
      console.error('Table user_confirm_codes doesn\'t exist.');
    }
  },
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const isUserTableAlreadyExists = await queryInterface.tableExists('user');
    if (!isUserTableAlreadyExists) {
      await queryInterface.createTable('user', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        username: {
          allowNull: false,
          unique: true,
          type: Sequelize.STRING,
        },
        email: {
          allowNull: false,
          unique: true,
          type: Sequelize.STRING,
        },
        password: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        verified: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
      });
    } else {
      console.error('Unable to create user table because its already exists.');
    }
  },

  async down(queryInterface, Sequelize) {
    const isUserTableExists = await queryInterface.tableExists('user');
    if (isUserTableExists) {
      await queryInterface.dropTable('user');
    } else {
      console.error('Table user doesn\'t exist.');
    }
  },
};

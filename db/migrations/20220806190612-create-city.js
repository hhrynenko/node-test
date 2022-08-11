module.exports = {
  async up(queryInterface, Sequelize) {
    const isCityAlreadyExists = await queryInterface.tableExists('city');
    if (!isCityAlreadyExists) {
      await queryInterface.createTable('city', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        cityName: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        averageGrade: {
          allowNull: false,
          type: Sequelize.DOUBLE,
          default: 0,
        },
      });
    } else {
      console.error('Unable to create city table because its already exists.');
    }
  },
  async down(queryInterface, Sequelize) {
    const isCityExists = await queryInterface.tableExists('city');
    if (isCityExists) {
      await queryInterface.dropTable('city');
    } else {
      console.error('Table comment doesn\'t exist.');
    }
  },
};

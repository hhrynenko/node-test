module.exports = {
  async up(queryInterface, Sequelize) {
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('city');
  },
};

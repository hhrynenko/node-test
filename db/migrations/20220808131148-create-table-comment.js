module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comment', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      commentText: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      cityGrade: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('comment');
  },
};

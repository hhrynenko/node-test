module.exports = {
  async up(queryInterface, Sequelize) {
    const isCommentAlreadyExists = await queryInterface.tableExists('comment');
    if (!isCommentAlreadyExists) {
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
    }
  },

  async down(queryInterface, Sequelize) {
    const isCommentExists = await queryInterface.tableExists('comment');
    if (isCommentExists) {
      await queryInterface.dropTable('comment');
    }
  },
};

module.exports = {
    async up(queryInterface, Sequelize) {
        const isCommentTableExists = await queryInterface.tableExists('comment');
        const isCityTableExists = await queryInterface.tableExists('city');
        const isCityIdAlreadyExists = await queryInterface.describeTable('comment');
        if (isCommentTableExists && isCityTableExists && !isCityIdAlreadyExists.cityId) {
            await queryInterface.addColumn('comment', 'cityId', {
                type: Sequelize.INTEGER,
                onDelete: 'CASCADE',
                allowNull: false,
                references: { model: 'city', key: 'id' },
            });
        }
    },

    async down(queryInterface, Sequelize) {
        const isCityIdExists = await queryInterface.describeTable('comment');
        if (isCityIdExists.cityId) {
            await queryInterface.removeColumn('comment', 'cityId');
        }
    },
};

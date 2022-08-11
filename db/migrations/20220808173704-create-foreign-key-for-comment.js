module.exports = {
    async up(queryInterface, Sequelize) {
        const isCommentTableExists = await queryInterface.tableExists('comment');
        const isCityTableExists = await queryInterface.tableExists('city');
        if (isCommentTableExists && isCityTableExists) {
            const isCityIdAlreadyExists = await queryInterface.describeTable('comment');
            if (!isCityIdAlreadyExists.cityId) {
                await queryInterface.addColumn('comment', 'cityId', {
                    type: Sequelize.INTEGER,
                    onDelete: 'CASCADE',
                    allowNull: false,
                    references: { model: 'city', key: 'id' },
                });
            } else {
                console
                    .error('Migration can\'t create foreign key because cityId already exist');
            }
        } else {
            console
                .error('Migration can\'t create foreign' +
                    ' key because comment or city tables doesn\'t exist');
        }
    },

    async down(queryInterface, Sequelize) {
        const isCommentTableExists = await queryInterface.tableExists('comment');
        if (isCommentTableExists) {
            const isCityIdColumnExists = await queryInterface.describeTable('comment');
            if (isCityIdColumnExists.cityId) {
                await queryInterface.removeColumn('comment', 'cityId');
            }
        } else {
            console.error('Column cityId doesn\'t exist');
        }
    },
};

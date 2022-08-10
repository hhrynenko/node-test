module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('comment', 'cityId', {
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            allowNull: false,
            references: { model: 'city', key: 'id' },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('comment', 'cityId');
    },
};

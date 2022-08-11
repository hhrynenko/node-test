const { Op } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('city', [
      { id: 1, cityName: 'City1', averageGrade: 7 },
      { id: 2, cityName: 'City2', averageGrade: 5 },
      { id: 3, cityName: 'City3', averageGrade: 4 },
      { id: 4, cityName: 'City4', averageGrade: 6 },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('city', {
      id: {
        [Op.or]: [1, 2, 3, 4],
      },
}, {});
  },
};

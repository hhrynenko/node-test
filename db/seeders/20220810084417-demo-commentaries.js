module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('comment', [
      {
 id: 1, commentText: 'Commentary for City 1', cityGrade: 10, cityId: 1,
},
      {
 id: 2, commentText: 'Commentary for City 2', cityGrade: 4, cityId: 2,
},
      {
 id: 3, commentText: 'Commentary for City 3', cityGrade: 5, cityId: 3,
},
      {
 id: 4, commentText: 'Commentary for City 4', cityGrade: 3, cityId: 4,
},
      {
 id: 5, commentText: 'Commentary for City 1', cityGrade: 8, cityId: 1,
},
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('comment', null, {});
  },
};

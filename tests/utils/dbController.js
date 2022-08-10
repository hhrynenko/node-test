const { Op } = require('sequelize');
const db = require('../../db/models/index');
const { City, Comment } = require('../../utils/constants');

const addSomeCitiesToDb = async (citiesToAdd) => {
    await db.sequelize.authenticate();
    const queryRes = await City.bulkCreate(citiesToAdd);
    return queryRes.map((city) => city.dataValues.id);
};

const addComments = async (idsOfTempCities, gradesToAdd) => {
    const commentsToAdd = idsOfTempCities.map((id) => gradesToAdd
        .map((grade) => ({ commentText: `Test Comment. City ${id}`, cityGrade: grade, cityId: id })));
    return Comment.bulkCreate(commentsToAdd.flat());
};

const clearCitiesFromDb = async (idsOfTempCities) => {
    await City.destroy({
        where: {
            id: {
                [Op.or]: idsOfTempCities,
            },
        },
    });
    return 0;
};

module.exports.addComments = addComments;
module.exports.clearCitiesFromDb = clearCitiesFromDb;
module.exports.addSomeCitiesToDb = addSomeCitiesToDb;

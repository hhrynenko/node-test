const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const db = require('../../db/models');
const dbConnection = require('../../db/models/index');

const City = db.city;
const Comment = db.comment;
const Role = db.role;
const UserRoles = db.user_roles;
const User = db.user;

const addTestUser = async ({ username, password, email, role }) => {
    const hashPass = bcrypt.hashSync(password, 7);
    const userQueryData = await User.create({
        username,
        password: hashPass,
        email,
    });
    const roleQueryData = await Role.findOne({
        attributes: ['id'],
        where: {
            roleName: role,
        },
        raw: true,
    });
    const roleId = roleQueryData.id;
    const userId = userQueryData.dataValues.id;
    await UserRoles.create({
        roleId,
        userId,
    });
    return [userId];
};

const deleteUserAndRoles = async (userId) => {
    await User.destroy({
        where: {
            id: {
                [Op.or]: userId,
            },
        },
    });
    return null;
};

const addSomeCitiesToDb = async (citiesToAdd) => {
    await dbConnection.sequelize.authenticate();
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
    return null;
};

module.exports.deleteUserAndRoles = deleteUserAndRoles;
module.exports.addTestUser = addTestUser;
module.exports.addComments = addComments;
module.exports.clearCitiesFromDb = clearCitiesFromDb;
module.exports.addSomeCitiesToDb = addSomeCitiesToDb;

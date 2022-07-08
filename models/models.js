const { DataTypes } = require('sequelize');
const sequelize = require('../utils/dbConfig');

const City = sequelize.define('city', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cityName: { type: DataTypes.STRING, allowNull: false },
    commentText: { type: DataTypes.STRING, allowNull: false },
    currentTemperature: { type: DataTypes.INTEGER, allowNull: false },
    degrees: { type: DataTypes.STRING, allowNull: false },
});

const Comment = sequelize.define('comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    commentText: { type: DataTypes.STRING, allowNull: false },
});

module.exports = {
    City,
    Comment,
};

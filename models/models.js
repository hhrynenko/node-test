const { DataTypes } = require('sequelize');
const sequelize = require('../utils/dbConfig');

const City = sequelize.define('city', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cityName: { type: DataTypes.STRING, allowNull: false },
    averageGrade: { type: DataTypes.DOUBLE, default: 0 },
}, { timestamps: false });

const Comment = sequelize.define('comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    commentText: { type: DataTypes.STRING, allowNull: false },
    cityGrade: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: false });

City.hasMany(Comment);
Comment.belongsTo(City);

module.exports = {
    City,
    Comment,
};

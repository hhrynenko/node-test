const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    static associate(models) {
      this.hasMany(models.comment, { onDelete: 'CASCADE', foreignKey: 'cityId' });
    }
  }
  City.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cityName: DataTypes.STRING,
    averageGrade: DataTypes.DOUBLE,
  }, {
    timestamps: false,
    tableName: 'city',
    sequelize,
    modelName: 'city',
  });
  return City;
};

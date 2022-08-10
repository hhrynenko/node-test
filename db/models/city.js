const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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

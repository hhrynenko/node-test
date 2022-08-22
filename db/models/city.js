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
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    cityName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    averageGrade: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      default: 0,
    },
  }, {
    timestamps: false,
    tableName: 'city',
    sequelize,
    modelName: 'city',
  });
  return City;
};

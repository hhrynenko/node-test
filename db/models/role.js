const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class role extends Model {
    static associate(models) {
      role.belongsToMany(models.user, { through: models.user_roles, foreignKey: 'roleId' });
    }
  }
  role.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    roleName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    timestamps: false,
    tableName: 'role',
    modelName: 'role',
  });
  return role;
};

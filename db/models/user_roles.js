const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class user_roles extends Model {
    static associate(models) {
    }
  }
  user_roles.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      allowNull: false,
      references: { model: 'user', key: 'id' },
    },
    roleId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      allowNull: false,
      references: { model: 'role', key: 'id' },
    },
  }, {
    sequelize,
    modelName: 'user_roles',
    timestamps: false,
    tableName: 'user_roles',
  });
  return user_roles;
};

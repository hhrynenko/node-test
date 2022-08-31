const {
  Model,
} = require('sequelize');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  class user_confirm_codes extends Model {
    static associate(models) {
      this.belongsTo(models.user, { onDelete: 'CASCADE' });
    }
  }
  user_confirm_codes.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: { model: 'user', key: 'id' },
    },
    expiresAt: {
      type: DataTypes.DATE,
      defaultValue: moment(moment() + 15 * 60000),
    },
    verifyCode: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
  }, {
    sequelize,
    timestamps: false,
    modelName: 'user_confirm_codes',
    tableName: 'user_confirm_codes',
  });
  return user_confirm_codes;
};

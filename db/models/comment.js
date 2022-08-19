const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      this.belongsTo(models.city, { onDelete: 'CASCADE' });
    }
  }
  Comment.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    commentText: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    cityGrade: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    cityId: {
      type: DataTypes.INTEGER, allowNull: false, onDelete: 'CASCADE', references: { model: 'city', key: 'id' },
    },
  }, {
    sequelize,
    timestamps: false,
    tableName: 'comment',
    modelName: 'comment',
  });
  return Comment;
};

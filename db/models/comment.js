const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.city, { onDelete: 'CASCADE' });
    }
  }
  Comment.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    commentText: DataTypes.STRING,
    cityGrade: DataTypes.INTEGER,
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

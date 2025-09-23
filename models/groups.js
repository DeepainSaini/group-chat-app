'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Groups extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.belongsToMany(models.User, {
        through: 'GroupMembers',
        foreignKey: 'groupId',
        otherKey: 'userId',
      });
      
      this.hasMany(models.GroupMembers, { 
        foreignKey: 'groupId',
        as: 'members'
      });
      
      
      this.hasMany(models.Chat, { 
        foreignKey: 'groupId',
        as: 'chats'
      });
      
      
      this.belongsTo(models.User, { 
        foreignKey: 'createdBy',
        as: 'creator'
      });
    }
  }
  Groups.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    createdBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Groups',
  });
  return Groups;
};
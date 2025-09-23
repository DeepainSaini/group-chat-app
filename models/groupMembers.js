'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GroupMembers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Groups, { 
        foreignKey: 'groupId',
        as: 'group'
      });
      
      this.belongsTo(models.User, { 
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }

  GroupMembers.init({
    role: {
        type: DataTypes.STRING,
        defaultValue: 'member'
      }
  }, {
    sequelize,
    modelName: 'GroupMembers',
    tableName: 'GroupMembers',
  });
  return GroupMembers;
};
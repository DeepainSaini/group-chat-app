'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // models.User.hasMany(models.Chat);
      this.hasMany(models.Chat, {as: 'chats', foreignKey: 'UserId' });

      this.belongsToMany(models.Groups, {
        through: 'GroupMembers',
        foreignKey: 'userId',
        otherKey: 'groupId',
        as: 'groups'
      });
  
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
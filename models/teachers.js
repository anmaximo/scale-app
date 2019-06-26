'use strict';
module.exports = (sequelize, DataTypes) => {
  const teachers = sequelize.define('teachers', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  teachers.associate = function(models) {
    // associations can be defined here
  };
  return teachers;
};
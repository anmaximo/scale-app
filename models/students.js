'use strict';
module.exports = (sequelize, DataTypes) => {
  const students = sequelize.define('students', {
    student_number: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    teacher_id: DataTypes.INTEGER,
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  students.associate = function(models) {
    // associations can be defined here
  };
  return students;
};
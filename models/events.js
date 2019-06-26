'use strict';
module.exports = (sequelize, DataTypes) => {
  const events = sequelize.define('events', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    number_of_participants: DataTypes.INTEGER,
    author_id: DataTypes.INTEGER,
    event_date: DataTypes.STRING,
    strand: DataTypes.STRING,
    approved: DataTypes.BOOLEAN,
    status: DataTypes.BOOLEAN,
    date_of_approval: DataTypes.STRING,
    approved_by: DataTypes.INTEGER
  }, {});
  events.associate = function(models) {
    // associations can be defined here
  };
  return events;
};
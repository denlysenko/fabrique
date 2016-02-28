'use strict';

module.exports = function(sequelize, DataTypes) {
  var DataSheet = sequelize.define('dataSheet',
      {
        id: {
          type: DataTypes.INTEGER(10).UNSIGNED,
          autoIncrement: true,
          primaryKey: true
        },
        feature: {
          type: DataTypes.STRING,
          validate: {
            notEmpty: {
              msg: 'Feature should contain letters and numbers'
            }
          }
        },
        characteristic: {
          type: DataTypes.STRING,
          validate: {
            notEmpty: {
              msg: 'Characteristic should contain letters and numbers'
            }
          }
        }
      },
      {
        timestamps: false,
        underscored: false,
        tableName: 'data_sheet'
      });

  return DataSheet;
};
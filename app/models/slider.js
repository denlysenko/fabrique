'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('slider',
      {
        id: {
          type: DataTypes.INTEGER(10).UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        code: {
          type: DataTypes.STRING(45),
          validate: {
            isAlphanumeric: {
              msg: 'Code should contain only letter or numbers'
            }
          }
        },
        title: {
          type: DataTypes.STRING(100),
          validate: {
            notEmpty: {
              msg: 'Title should contain letters and numbers'
            }
          }
        },
        slogan: {
          type: DataTypes.STRINGD,
          validate: {
            notEmpty: {
              msg: 'Slogan should contain letters and numbers'
            }
          }
        },
        imageUrl: {
          type: DataTypes.STRING(90)
        }
      },
      {
        timestamps: true,
        underscored: true,
        tableName: 'slider'
      });
};
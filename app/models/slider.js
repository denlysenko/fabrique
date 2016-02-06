'use strict';

module.exports = function(sequelize, DataTypes) {
  var Slider = sequelize.define('slider',
      {
        id: {
          type: DataTypes.INTEGER(10).UNSIGNED,
          primaryKey: true,
          autoIncrement: true
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
          type: DataTypes.STRING(255),
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
        classMethods: {
          associate: function(models) {
            Slider.belongsTo(models.product, {foreignKey: 'productCode'});
          }
        },
        timestamps: false,
        underscored: false,
        tableName: 'slider'
      });
  return Slider;
};
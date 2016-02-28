'use strict';

module.exports = function(sequelize, DataTypes) {
  var Image = sequelize.define('image',
      {
        id: {
          type: DataTypes.INTEGER(10).UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        imageUrl: {
          type: DataTypes.STRING(90)
        },
        thumbUrl: {
          type: DataTypes.STRING(90)
        }
      },
      {
        timestamps: false,
        underscored: false,
        tableName: 'images'
      });

  return Image;
};
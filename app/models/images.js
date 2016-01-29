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
        classMethods: {
          associate: function(models) {}
        },
        timestamps: true,
        underscored: true,
        tableName: 'images'
      });

  return Image;
};
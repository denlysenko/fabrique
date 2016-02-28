'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tokens', {
    email: {
      type: DataTypes.STRING(45)
    },
    token: {
      type: DataTypes.STRING(90)
    },
    expires: {
      type: DataTypes.DATE
    }
  }, {
    timestamps: false,
    underscored: false,
    tableName: 'tokens'
  });
};
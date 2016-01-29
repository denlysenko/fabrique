'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('subscriber',
      {
        email: {
          type: DataTypes.STRING(45),
          unique: {
            msg: 'Your email was already subscribed'
          },
          validate: {
            isEmail: {
              msg: 'Please, enter valid email'
            }
          }
        }
      },
      {
        timestamps: true,
        underscored: true,
        tableName: 'subscribers'
      });
};
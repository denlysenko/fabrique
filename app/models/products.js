'use strict';

module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define('product',
      {
        productCode: {
          type: DataTypes.STRING(45),
          unique: {
            msg: 'Product with such code already exists!'
          },
          validate: {
            isAlphanumeric: {
              msg: 'Code should contain only letter or numbers!'
            }
          },
          primaryKey: true
        },
        category: {
          type: DataTypes.ENUM('flooring', 'curtains', 'bedding'),
          validate: {
            isAlpha: {
              msg: 'Category should contain letters'
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
        desc: {
          type: DataTypes.TEXT,
          validate: {
            notEmpty: {
              msg: 'Description should contain letters and numbers'
            }
          }
        },
        info: {
          type: DataTypes.TEXT,
          validate: {
            notEmpty: {
              msg: 'Info should contain letters and numbers'
            }
          }
        },
        price: {
          type: DataTypes.DECIMAL(8,2).UNSIGNED,
          validate: {
            isFloat: {
              msg: 'Price should contain decimal numbers'
            }
          }
        },
        views: {
          type: DataTypes.INTEGER(10).UNSIGNED,
          defaultValue: 0
        },
        added: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
        },
        sale: {
          type: DataTypes.INTEGER(3).UNSIGNED,
          allowNull: true
        }
      },
      {
        indexes: [{
          name: 'ixTitle',
          type: 'FULLTEXT',
          fields: ['title']
        }],
        classMethods: {
          associate: function(models) {
            Product.hasMany(models.review, {foreignKey: 'productCode', as: 'reviews'});
            Product.hasMany(models.image, {foreignKey: 'productCode', as: 'images'});
            Product.hasMany(models.dataSheet, {foreignKey: 'productCode', as: 'dataSheet'});
          }
        },
        timestamps: true,
        underscored: false,
        tableName: 'products'
      });

  return Product;
};


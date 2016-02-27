var models = require('../../models');

module.exports = function(req, res, next) {
	models.product.findAll({
    order: [
        ['views', 'DESC']
    ],
    limit: 4,
    include: [
      {model: models.image, as: 'images'}
    ]
  })
      .then(function(rows) {
        mostViewed = res.locals.mostViewed = rows;
        next();
      })
      .catch(function(err) {
        next(err);
      });
};
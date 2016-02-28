var models = require('../../models');

module.exports = function(req, res, next) {
  if(res.locals.last && res.locals.last.length) {
    next();
  } else {
    models.product.findAll({
      order: [
        ['createdAt', 'DESC']
      ],
      limit: 4,
      include: [
        {model: models.image, as: 'images'}
      ]
    })
        .then(function(rows) {
          last = res.locals.last = rows;
          next();
        })
        .catch(function(err) {
          next(err);
        });
  }
};		
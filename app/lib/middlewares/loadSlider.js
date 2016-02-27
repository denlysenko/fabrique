var Slider = require('../../models').slider;

module.exports = function(req, res, next) {
  Slider.findAll()
      .then(function(rows) {
        sliders = res.locals.sliders = rows;
        next();
      })
      .catch(function(err) {
        next(err);
      });
};
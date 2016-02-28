var Slider = require('../../models').slider;

module.exports = function(req, res, next) {
  if(res.locals.sliders && res.locals.sliders.length) {
    next();
  } else {
    Slider.findAll()
        .then(function(rows) {
          sliders = res.locals.sliders = rows;
          next();
        })
        .catch(function(err) {
          next(err);
        });
  }
};
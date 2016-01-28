var Slider = require('.././slider');

module.exports = function(req, res, next) {
	Slider.find(function(err, sliders) {
		if(err) return next(err);
		sliders = res.locals.sliders = sliders;
		next();
	});
};
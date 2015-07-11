var request = require('request');

module.exports = function(req, res, next) {
	if(req.session.rates) {
		rate = res.locals.rate = req.session.rate;
		currency = res.locals.currency = req.session.currency;
		next();
	} else {
		var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22GBPUSD%22%2C%20%22GBPEUR%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
		request(url, function(err, response, body) {
			var body = JSON.parse(body);
			var rates = body.query.results.rate;
			var exRates = {};
			rates.forEach(function(rate) {
				exRates[rate.id] = rate.Rate;
			});
			exRates['GBP'] = 1;
			req.session.rates = exRates;
			rate = res.locals.rate = req.session.rate = req.session.rates['GBP'];
			currency = res.locals.currency = req.session.currency = '£';
			next();
		});
	}
};
var Client = require('../../models').client;

module.exports = function(req, res ,next) {
	if(!req.session.uid) return next();
	Client.findOne({
    where: {
      email: req.session.uid
    }
  })
      .then(function(user) {
		    user = res.locals.user = user;
		    next();
	    })
      .catch(function(err) {
        next(err);
      });

};
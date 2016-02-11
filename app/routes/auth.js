'use strict';

var auth = require('../controllers/auth'),
    checkAuth = require('../lib/middlewares/checkAuth');

module.exports = function(app) {
  app.route('/register')
      .get(auth.regForm)
      .post(auth.register);

  app.route('/login')
      .get(auth.login)
      .post(auth.authenticate);

  app.route('/register/secure').get(auth.securePassword);

  app.route('/register/email-verification/:token').get(auth.confirmation);

  app.route('/restore_password').post(auth.restore);

  app.route('/update_password').post(auth.updatePassword);

  app.route('/logout').get(auth.logout);

  app.route('/cancel_account')
		.get(checkAuth, auth.cancelAccount)
		.delete(auth.removeAccount);
};

//
//
//
//
//

//

//module.exports = router;
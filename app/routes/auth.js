'use strict';

var auth = require('../controllers/auth');

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
};

//router.get('/logout', user.logout);
//
//
//
//
//router.route('/cancel_account')
//		.get(checkAuth, user.cancelAccount)
//		.delete(user.removeAccount);
//

//module.exports = router;
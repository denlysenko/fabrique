'use strict';

var auth = require('../controllers/auth')

module.exports = function(app) {
  app.route('/register')
      .get(auth.regForm)
      .post(auth.register);

  app.route('/login')
      .get(auth.login)
      .post(auth.authenticate);

  app.route('/register/secure').get(auth.securePassword);
};



//router.get('/register/email-verification/:token', user.confirmation);
//

//router.get('/logout', user.logout);
//
//router.post('/restore_password', user.restore);
//router.post('/update_password', user.updatePassword);
//
//router.route('/cancel_account')
//		.get(checkAuth, user.cancelAccount)
//		.delete(user.removeAccount);
//

//module.exports = router;
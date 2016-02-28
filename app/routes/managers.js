var manager = require('../controllers/managers'),
    loadManager = require('../lib/middlewares/loadManager'),
    checkManager = require('../lib/middlewares/checkManager');

module.exports = function(app) {

  app.route('/api').get(loadManager, manager.index);
  app.route('/api/authenticate')
      .get(loadManager, manager.index)
      .post(manager.authenticate);

  app.route('/api/manager')
      .get(checkManager, manager.manager)
      .post(checkManager, manager.create)
      .delete(checkManager, manager.remove)
      .put(checkManager, manager.update);

  app.get('/api/cancel', manager.cancel);
  app.get('/api/logout', manager.logout);
};
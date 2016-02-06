var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var config = require('./config');
var methodOverride = require('method-override');
var multer = require('multer');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({
  dest: './tmp',
  rename: function(fieldname, filename) {
    return filename;
  }
}))
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(session(config.get('session')));
app.use(require('./app/lib/modules/messages/index'));
app.use(require('./app/lib/modules/search-results/index'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./app/lib/middlewares/loadRates'));

//app.use('/api', require('./app/routes/api/routes'));
//app.use('/', require('./app/routes/index'));
//app.use('/product', require('./app/routes/product'));

// catch 404 and forward to errors handler
app.use(function(req, res, next) {
  var err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

// errors handlers

// development errors handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      title: err.message,
      page: 'error'
    });
  });
}

// production errors handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    title: err.message,
    page: 'error'
  });
});


module.exports = app;

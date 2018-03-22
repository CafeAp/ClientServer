global.__basedir = __dirname;
let dir = __basedir.split('\\')
dir.pop()
global.__staticDir = `${dir.join('\\')}\\client\\static\\upload`;

var formData = require("express-form-data");
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var categories = require('./routes/categories');
var ingredients = require('./routes/ingredients');
var goods = require('./routes/goods');
var techCards = require('./routes/tech_cards');
var supplies = require('./routes/supplies');
var rooms = require('./routes/rooms');
var tables = require('./routes/tables');
var orders = require('./routes/orders');
var warehouse = require('./routes/warehouse');

var app = express();
var cors = require('cors')
var sequelize = require('./db/sequelize.js')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/', index);
app.use('/api/categories', categories);
app.use('/api/ingredients', ingredients);
app.use('/api/goods', goods);
app.use('/api/tech_cards', techCards);
app.use('/api/supplies', supplies);
app.use('/api/warehouse', warehouse);
app.use('/api/rooms', rooms);
app.use('/api/tables', tables);
app.use('/api/orders', orders);
app.use('/api/warehouse', warehouse);

// catch 404 and forward to error handler
  app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

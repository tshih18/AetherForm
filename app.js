// require node package modules
var express = require('express');
var session = require('express-session');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// to use html as template engine with express
var templ = require('simple-html-template');

// require route files
var index = require('./routes/index');
var forgot = require('./routes/forgot');
var form = require('./routes/form');
var dashboard = require('./routes/dashboard');

// express is web application framework to build web APIs
var app = express();

// Middleware setup
// view engine setup
app.set('views', path.join(__dirname, 'views'));
// tell app that files with .html will be rendered with this template engine
app.engine('html', templ);
// register template engine
app.set('view engine', 'html');
// html template tags
app.set('open_tag','<?');
app.set('close_tag','/?>');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// secret used to encrypt session data
app.use(session({secret:"asdfasdfasdf", resave:false, saveUninitialized:true}));
app.use(express.static(path.join(__dirname, 'public')));

// routes to use these files
app.use('/', index);
app.use('/forgotPassword', forgot);
app.use('/form', form);
app.use('/dashboard', dashboard);

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

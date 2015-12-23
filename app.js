var express = require('express'),
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	fs = require('fs'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	cron = require('./utils/cron.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

function _mkdirSync(path) {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path);
	}
}
_mkdirSync(__dirname + '/log');
_mkdirSync(__dirname + '/uploads');

// about Util
cron.setup();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('combined', {
	stream: fs.createWriteStream(__dirname + '/log/access_log.txt', {
		flags: 'a'
	})
}));
app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

// set routing
app.use('', require('./routes/root.js'));
app.use('/api/v1', require('./routes/v1.js'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
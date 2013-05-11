
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , music = require('./routes/music')
  , http = require('http')
  , flash = require('connect-flash')
  , MongoStore = require('connect-mongo')(express)
  , path = require('path');

var app = express();

app.configure(function() {
	// all environments
	app.set('port', process.env.PORT || 80);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({
	    secret: 'mplayer',
	    store: new MongoStore({
	      	db: 'mplayer'
	    })
	}));
	app.use(flash());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  	app.use(express.errorHandler());
});

music(app);
routes(app);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port %d in %s mode", app.get('port'), app.get('env'));
});

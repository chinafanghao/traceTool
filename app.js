
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var routes = require('./routes');

var settings = require('./settings');

var MongoStore = require('connect-mongo')(express);

var partials = require('express-partials');
var flash = require('connect-flash');

var sessionStore = new MongoStore({
						db : settings.db
					}, function() {
							console.log('connect mongodb success...');
					});


var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');

	app.use(partials());
	app.use(flash());

	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	app.use(express.cookieParser());
	
	app.use(express.session({
		secret : settings.cookie_secret,
		cookie : {
			maxAge : 60000 * 20	//20 minutes
		},
		store : sessionStore
	}));

	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/u/:user', routes.user);
app.post('/post', routes.post);
app.post('/del', routes.del);
app.get('/reg', routes.reg);
app.post('/reg', routes.doReg);
app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/logout', routes.logout);
app.get('/featuremodel',routes.featuremodel);
app.get('/modeltree',routes.modeltree);
app.get('/showtree',routes.showtree);
app.get('/showrelation',routes.showrelation);
app.get('/showinfo',routes.showinfo);
app.get('/traceability',routes.traceability);
app.get('/guardname',routes.guardname);
app.get('/showguard',routes.showguard);
app.get('/configuration',routes.configuration);
app.get('/configuratemodeltree',routes.configuratemodeltree);
app.get('/editfeaturetree',routes.editfeaturetree);
app.get('/F',routes.F);
app.get('/T',routes.T);
//app.post('/doT',routes.doT);

app.get('/T/:current_guard',routes.T);
app.get('/doT/:content',routes.doT);
app.get('/C',routes.C);
app.get('/createActivity/:content',routes.createActivity);
app.get('/createUseCase/:content',routes.createUseCase);
app.get('/createDecision/:content',routes.createDecision);
app.get('/createCondition/:content',routes.createCondition);
app.get('/InsertBetween/:content',routes.insertBetween);
app.get('/InsertActAfterPre/:content',routes.insertActAfterPre);
app.get('/InsertActBeforePost/:content',routes.insertActBeforePost);
app.get('/InsertActAfterDecCon/:content',routes.insertActAfterDecCon);
app.get('/InsertActBeforeActCon/:content',routes.insertActBeforeActCon);
app.get('/InsertDecAfterAct/:content',routes.insertDecAfterAct);
app.get('/InsertDecAfterDecCon/:content',routes.insertDecAfterDecCon);
app.get('/InsertDecBeforeAct/:content',routes.insertDecBeforeAct);
app.get('/InsertDecBeforeActWith/:content',routes.insertDecBeforeActWith);
app.get('/InsertDecBeforeDecCon/:content',routes.insertDecBeforeDecCon);
app.get('/InsertDecBeforeActCon/:content',routes.insertDecBeforeActCon);
app.get('/DeleteActivity/:content',routes.deleteActivity);
app.get('/DeleteDecision/:content',routes.deleteDecision);
app.get('/DeleteCondition/:content',routes.deleteCondition);
app.get('/DeleteUseCase/:content',routes.deleteUseCase);
app.get('/DeleteInsertActAfterPre/:content',routes.deleteInsertActAfterPre);
app.get('/DeleteInsertActBeforePost/:content',routes.deleteInsertActBeforePost);
app.get('/DeleteInsertActAfterDecCon/:content',routes.deleteInsertActAfterDecCon);
app.get('/DeleteInsertActBeforeActCon/:content',routes.deleteInsertActBeforeActCon);
app.get('/DeleteInsertDecAfterAct/:content',routes.deleteInsertDecAfterAct);
app.get('/DeleteInsertDecAfterDecCon/:content',routes.deleteInsertDecAfterDecCon);
app.get('/DeleteInsertDecBeforeAct/:content',routes.deleteInsertDecBeforeAct);
app.get('/DeleteInsertDecBeforeActWith/:content',routes.deleteInsertDecBeforeActWith);
app.get('/DeleteInsertDecBeforeActCon/:content',routes.deleteInsertDecBeforeActCon);

app.post('/EditUseCase',routes.editUseCase);
app.post('/EditActivity',routes.EditActivity);

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});


/**
* node-mongodb-native   https://github.com/christkv/node-mongodb-native
* 
* ejs	https://github.com/visionmedia/ejs
* 
* express-Migrating from 2.x to 3.x		https://github.com/visionmedia/express/wiki/Migrating-from-2.x-to-3.x
* 
* Express 3.x + Socket.IO		http://blog.lyhdev.com/2012/07/nodejs-express-3x-socketio.html
* 
* express-partials		https://github.com/publicclass/express-partials
* 
* connect-flash		https://github.com/jaredhanson/connect-flash
*
* connect-mongodb		https://github.com/masylum/connect-mongodb
*
* 
*/

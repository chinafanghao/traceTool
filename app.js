
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
			maxAge : 60000 * 200	//20 minutes
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
app.get('/F/:content',routes.F);
app.get('/T',routes.T);
app.get('/T/:content',routes.T);
//app.post('/doT',routes.doT);

//app.get('/T/:current_guard',routes.T);

app.get('/doT/:content',routes.doT);
app.get('/C',routes.C);
app.get('/C/:current_guard',routes.C);
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
app.get('/InsertActAfterPreDialog/:content',routes.insertActAfterPreDialog);
app.get('/InsertActBeforePostDialog/:content',routes.insertActBeforePostDialog);
app.get('/InsertActAfterDecConDialog/:content',routes.insertActAfterDecConDialog);
app.get('/InsertActBeforeActConDialog/:content',routes.insertActBeforeActConDialog);
app.get('/InsertDecAfterActDialog/:content',routes.insertDecAfterActDialog);
app.get('/InsertDecAfterDecConDialog/:content',routes.insertDecAfterDecConDialog);
app.get('/InsertDecBeforeActDialog/:content',routes.insertDecBeforeActDialog);
app.get('/InsertDecBeforeActWithDialog/:content',routes.insertDecBeforeActWithDialog);
app.get('/InsertDecBeforeDecConDialog/:content',routes.insertDecBeforeDecConDialog);
app.get('/InsertDecBeforeActConDialog/:content',routes.insertDecBeforeActConDialog);
app.get('/ConfigurationTree',routes.configurationTree);
app.get('/addTraceRule/:content',routes.addTraceRule);
app.get('/addTraceRuleZero/:content',routes.addTraceRuleZero);
app.get('/editTraceRule/:content',routes.editTraceRule);
app.get('/DeleteTraceRule/:content',routes.deleteTraceRule);


app.post('/EditUseCase',routes.editUseCase);
app.post('/EditActivity',routes.editActivity);
app.post('/EditDecision',routes.editDecision);
app.post('/EditCondition',routes.editCondition);

app.post('/addNewFeature',routes.addNewFeature);
app.post('/loadFeatureModel', routes.loadFeatureModel);
app.post('/removeFeature', routes.removeFeature);
app.post('/updateText', routes.updateText);
app.post('/updateDescription', routes.updateDescription);
app.post('/updateOptionality', routes.updateOptionality);
app.post('/updateParent_id', routes.updateParent_id);
app.post('/updateVP', routes.updateVP);
app.post('/removeSubtree', routes.removeSubtree);

app.get('/newConfiguration/:content',routes.newConfiguration);
app.get('/DeleteConfiguration/:content',routes.deleteConfiguration);

app.post('/EditConfigName',routes.EditConfigName);
app.post('/EditConfig',routes.EditConfig);
app.post('/GenerateUseCase',routes.GenerateUseCase);

app.get('/newProject/:content',routes.newProject);
app.get('/DeleteProject/:content',routes.DeleteProject);
app.post('/updateProjectName',routes.updateProjectName);
app.post('/showInformation',routes.showInformation);
app.post('/EditProject',routes.editProject);

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


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
			maxAge : 7*24*60*60*1000	
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

app.post('/doT',routes.doT);
app.post('/doTZero',routes.doTZero);
app.get('/C',routes.C);
app.get('/C/:content',routes.C);
app.post('/createActivity',routes.createActivity);
app.post('/createUseCase',routes.createUseCase);
app.post('/createDecision',routes.createDecision);
app.post('/createCondition',routes.createCondition);
app.get('/InsertBetween/:content',routes.insertBetween);
app.post('/InsertActAfterPre',routes.insertActAfterPre);
app.post('/InsertActBeforePost',routes.insertActBeforePost);
app.post('/InsertActAfterDecCon',routes.insertActAfterDecCon);
app.post('/InsertActBeforeActCon',routes.insertActBeforeActCon);
app.post('/InsertDecAfterAct',routes.insertDecAfterAct);
app.post('/InsertDecAfterDecCon',routes.insertDecAfterDecCon);
app.post('/InsertDecBeforeAct',routes.insertDecBeforeAct);
app.post('/InsertDecBeforeActWith',routes.insertDecBeforeActWith);
app.get('/InsertDecBeforeDecCon/:content',routes.insertDecBeforeDecCon);
app.post('/InsertDecBeforeActCon',routes.insertDecBeforeActCon);
app.post('/DeleteActivity',routes.deleteActivity);
app.post('/DeleteDecision',routes.deleteDecision);
app.post('/DeleteCondition',routes.deleteCondition);
app.post('/DeleteUseCase',routes.deleteUseCase);
app.post('/DeleteInsertActAfterPre',routes.deleteInsertActAfterPre);
app.post('/DeleteInsertActBeforePost',routes.deleteInsertActBeforePost);
app.post('/DeleteInsertActAfterDecCon',routes.deleteInsertActAfterDecCon);
app.post('/DeleteInsertActBeforeActCon',routes.deleteInsertActBeforeActCon);
app.post('/DeleteInsertDecAfterAct',routes.deleteInsertDecAfterAct);
app.post('/DeleteInsertDecAfterDecCon',routes.deleteInsertDecAfterDecCon);
app.post('/DeleteInsertDecBeforeAct',routes.deleteInsertDecBeforeAct);
app.post('/DeleteInsertDecBeforeActWith',routes.deleteInsertDecBeforeActWith);
app.post('/DeleteInsertDecBeforeActCon',routes.deleteInsertDecBeforeActCon);
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
app.post('/addTraceRule',routes.addTraceRule);
app.post('/addTraceRuleZero',routes.addTraceRuleZero);
app.post('/editTraceRule',routes.editTraceRule);
app.post('/DeleteTraceRule',routes.deleteTraceRule);
app.post('/DeleteTraceRuleZero',routes.deleteTraceRuleZero);


app.post('/EditUseCase',routes.editUseCase);
app.post('/EditActivity',routes.editActivity);
app.post('/EditDecision',routes.editDecision);
app.post('/EditCondition',routes.editCondition);
app.post('/EditInsertActAfterPre',routes.editInsertActAfterPre);
app.post('/EditInsertActBeforePost',routes.editInsertActBeforePost);
app.post('/EditInterAfterDecCon',routes.editInterAfterDecCon);
app.post('/EditInterBeforeActConCon',routes.editInterBeforeActConCon);
app.post('/EditInsertDecAfterAct',routes.editInsertDecAfterAct);
app.post('/EditInsertDecAfterDecCon',routes.editInsertDecAfterDecCon);
app.post('/EditInsertDecBeforeAct',routes.editInsertDecBeforeAct);
app.post('/EditInsertDecBeforeActWith',routes.editInsertDecBeforeActWith);
app.post('/EditInsertDecBeforeActCon',routes.editInsertDecBeforeActCon);

app.post('/addNewFeature',routes.addNewFeature);
app.post('/loadFeatureModel', routes.loadFeatureModel);
app.post('/removeFeature', routes.removeFeature);
app.post('/updateText', routes.updateText);
app.post('/updateDescription', routes.updateDescription);
app.post('/updateOptionality', routes.updateOptionality);
app.post('/updateParent_id', routes.updateParent_id);
app.post('/updateVP', routes.updateVP);
app.post('/removeSubtree', routes.removeSubtree);
app.post('/addNewConstraint', routes.addNewConstraint);
app.post('/getFeatureById', routes.getFeatureById);
app.post('/getSonsById',routes.getSonsById); //输入一个id，返回子节点id数组
app.post('/loadConstraints', routes.loadConstraints);
app.post('/removeConstraint', routes.removeConstraint);

app.post('/newConfiguration',routes.newConfiguration);
app.post('/DeleteConfiguration',routes.deleteConfiguration);

app.post('/EditConfigName',routes.EditConfigName);
app.post('/EditConfig',routes.EditConfig);
app.post('/GenerateUseCase',routes.GenerateUseCase);
app.post('/GetUseCase',routes.GetUseCase);

app.get('/newProject/:content',routes.newProject);
app.get('/DeleteProject/:content',routes.DeleteProject);
app.post('/updateProjectName',routes.updateProjectName);
app.post('/showInformation',routes.showInformation);
app.post('/EditProject',routes.editProject);

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

var db = require('./models/db.js');
var mongodb = new db();

mongodb.trueBase(function(err,db){
    //console.log("DB.inited");
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

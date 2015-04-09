/*
var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection =  require('mongodb').Connection;
var Server = require('mongodb').Server;

module.exports = new Db(settings.db, new Server(settings.host, settings.port, {
	auto_reconnect : true
}));
*/
var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection =  require('mongodb').Connection;
var Server = require('mongodb').Server;

var m_connection = 0;
var m_collection = {};
var m_db;

module.exports = function(){
    this.trueBase = function(callback){
        m_db = new Db(settings.db, new Server(settings.host, settings.port, {auto_reconnect : true}));
        console.log("connection_open:"+m_connection);
        m_connection++;
        if(m_connection === 1){
            console.log("db_open");
            m_db.open(function(err, db) {
                if (err) {
                    m_connection--;
                    return callback(err,db);
                }
                else{
                    collection_init();
                    return callback(err,db);
                }
            });
        }
        return callback(null,m_db);
    };

    this.getCollection = function(collectionName,callback){
    	console.log("hello~ "+collectionName);
        return callback(m_collection[collectionName]);
    }


    collection_init = function(callback){
        console.log("collection.init");

        m_db.collection('users', function(err, collection) {
            collection.ensureIndex('mail', {unique: true});
            m_collection["users"] = collection;
            console.log("users");
        });


        m_db.collection('configuration', function(err, collection) {
            m_collection["configuration"] = collection;
            console.log("configuration");
        });

        m_db.collection('constraints', function(err, collection) {
            m_collection["constraints"] = collection;
            console.log("constraints");
        });

        m_db.collection('elementdepency', function(err, collection) {
            m_collection["elementdepency"] = collection;
            console.log("elementdepency");
        });

        m_db.collection('fmtree', function(err, collection) {
            m_collection["fmtree"] = collection;
            console.log("fmtree");
        });

        m_db.collection('guardlist', function(err, collection) {
            m_collection["guardlist"] = collection;
            console.log("guardlist");
        });

        m_db.collection('Project', function(err, collection) {
            m_collection["Project"] = collection;
            console.log("project");
        });

        m_db.collection('tracerule', function(err, collection) {
            m_collection["tracerule"] = collection;
            console.log("tracerule");
        });
          m_db.collection('posts', function(err, collection) {
            m_collection["posts"] = collection;
            console.log("posts");
        });
    };
};

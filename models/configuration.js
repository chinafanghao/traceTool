var mongodb = require('./db');

function Configuration(username,name,time,configuration,usecase,_id) { //post means refinements list
	this.user = username;
	this.name=name;
	if (time) {
		this.time = time;
	} else {
		this.time = new Date();
	}
	this.configuration=configuration;
	this.usecase=usecase;
	this._id=_id;
};
module.exports = Configuration;

Configuration.prototype.save = function save(callback) {
	// 存入 Mongodb 的文檔
	var configuration = {
		user: this.user,
		name:this.name,
		time: this.time,
		configuration:this.configuration,
		usecase:this.usecase
	};

	mongodb.open(function(err, db) {
		if (err) {
		  return callback(err);
		}
		
		db.collection('configuration', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
			collection.insert(configuration, {safe: true}, function(err, configuration) {
				mongodb.close();
				callback(err, configuration);
			});
		});
	});
};

Configuration.addNewConfiguration = function addNewConfiguration(username,name,callback) {
	// 存入 Mongodb 的文檔
// 存入 Mongodb 的文檔
	var newConfiguration = {
				user: username,
				name:name,
				configuration:"",
				usecase:{}
			};
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
	   
	   db.collection('configuration', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
			collection.ensureIndex('user');
			collection.insert(newConfiguration, {safe: true},function(err){
					if(err) {
						console.warn(err.message);
						mongodb.close();
					}
					else {
						console.log("insert new configuration success");

						var query = {};
						if (username) {
				
							query={"user":username};
						}
						collection.ensureIndex('user');
						collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
							mongodb.close();

							if (err) {
								callback(err, null,null);
							}

							var configurations = [];
							var $newConfigurationID;
							docs.forEach(function(doc, index) {
								var configuration = new Configuration(doc.user, doc.name,doc.time,doc.configuration,doc.usecase,doc._id);
								configurations.push(configuration);
								if(doc.name==name){
									$newConfigurationID=doc._id;
								}
							});

							callback(null, configurations,$newConfigurationID);
						});
					}
				});


			

		  });
		
	});
};



Configuration.get = function get(username,id,callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('configuration', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var ObjectID = require("mongodb").ObjectID;
			//查找user属性为username的文档，如果username为null则匹配全部
			var query = {};
			if (id) {
				
				query={"user":username,"_id":ObjectID(id)};
			}
			else{
				query={"user":username};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
							mongodb.close();

							if (err) {
								callback(err, null);
							}

							var configurations = [];
				
							docs.forEach(function(doc, index) {
								var configuration = new Configuration(doc.user, doc.name,doc.time,doc.configuration,doc.usecase,doc._id);
								configurations.push(configuration);
							});

							callback(null, configurations);
						});
		});
	});
};

Configuration.removeConfiguration = function removeConfiguration(user,deleteID,callback){
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('configuration', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var ObjectID = require("mongodb").ObjectID;
			//查找user属性为username的文档，如果username为null则匹配全部
			var query = {};
			if (deleteID) {
				
				query={"user":user,"_id":ObjectID(deleteID)};
			}
			collection.remove(query,function(err){
								if(err) {console.warn(err.message);
										mongodb.close();}
								else {
									console.log("delete element success");
									
									var query = {};
									if (user) {
				
										query={"user":user};
									}
									collection.ensureIndex('user');
									collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
										mongodb.close();

										if (err) {
											callback(err, null);
										}

										var configurations = [];
										
										docs.forEach(function(doc, index) {
											var configuration = new Configuration(doc.user, doc.name,doc.time,doc.configuration,doc.usecase,doc._id);
											configurations.push(configuration);
										
										});

							callback(null, configurations);
						});
									}
							});
		});
	});
}
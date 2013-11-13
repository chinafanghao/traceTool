var mongodb = require('./db');

function Elementlist(username, name,description,type,executor,theparent,time,is_virtual,_id) { //post means refinements list
	this.user = username;
	this.name=name;
	this.description=description;
	this.type = type;
	this.executor=executor;
	this.theparent=theparent;
	if (time) {
		this.time = time;
	} else {
		this.time = new Date();
	}
	this.is_virtual=is_virtual;
	this._id=_id;
};
module.exports = Elementlist;

Elementlist.prototype.save = function save(callback) {
	// 存入 Mongodb 的文檔
	var tracelist = {
		user: this.user,
		name:this.name,
		description:this.description,
		type:this.type,
		executor:this.executor,
		theparent:this.theparent,
		time: this.time,
		is_virtual: this.is_virtual
	};

	mongodb.open(function(err, db) {
		if (err) {
		  return callback(err);
		}
		
		db.collection('elementlist', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.ensureIndex('user');
			
			collection.insert(elementlist, {safe: true}, function(err, elementlist) {
				mongodb.close();
				callback(err, elementlist);
			});
		});
	});
};


Elementlist.get = function get(username, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('elementlist', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			//查找user属性为username的文档，如果username为null则匹配全部
			var query = {};
			if (username) {
				query.user = username;
			}

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementlists = [];
				
				docs.forEach(function(doc, index) {
					var elementlist = new Elementlist(doc.user, doc.name,doc.description,doc.type,doc.executor,doc.theparent,doc.time, doc.is_virtual,doc._id);
					elementlists.push(elementlist);
				});

				callback(null, elementlists);
			});
		});
	});
};


Elementlist.del = function del(username, name,callback) {
	console.log(username+" "+name+"#");
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('elementlist', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
			//查找user属性为username的文档，如果username为null则匹配全部
			
			//console.log(ids);

			var query_del = {"user":username,"name":name};
			console.log(query_del);
			collection.remove(query_del);

			var query = {};
			if (username) {
				query.user = username;
			}

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementlists = [];
				
				docs.forEach(function(doc, index) {
					var elementlist = new Elementlist(doc.user, doc.name,doc.description,doc.type,doc.executor,doc.theparent,doc.time,doc.is_virtual,doc._id);
					elementlists.push(elementlist);
				});

				callback(null, elementlists);
			});
		});
	});
};
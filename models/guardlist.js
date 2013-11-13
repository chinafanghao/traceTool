var mongodb = require('./db');

function Guardlist(username, guard,guard_selfname,child,time,_id) { //post means refinements list
	this.user = username;
	this.guard = guard;
	this.guard_selfname=guard_selfname;
	this.child=child;
	if (time) {
		this.time = time;
	} else {
		this.time = new Date();
	}
	this._id=_id;
};
module.exports = Guardlist;

Guardlist.prototype.save = function save(callback) {
	// 存入 Mongodb 的文檔
	var guardlist = {
		user: this.user,
		guard:this.guard,
		guard_selfname:this.guard_selfname,
		child:this.child,
		time: this.time,
	};

	mongodb.open(function(err, db) {
		if (err) {
		  return callback(err);
		}
		
		db.collection('guardlist', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.ensureIndex('user');
			
			collection.insert(guardlist, {safe: true}, function(err, guardlist) {
				mongodb.close();
				callback(err, guardlist);
			});
		});
	});
};


Guardlist.get = function get(user, callback) {
	console.log(user+"#");
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('guardlist', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			//查找user属性为username的文档，如果username为null则匹配全部

			var query = {};
			if (user) {
				
				query={"user":user};
			}

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var guardlists = [];
				
				docs.forEach(function(doc, index) {
					var guardlist = new Guardlist(doc.user, doc.guard,doc.guard_selfname,doc.child,doc.time,doc._id);
					guardlists.push(guardlist);
				});

				callback(null, guardlists);
			});
		});
	});
};

Guardlist.del = function del(username, guard,callback) {
	console.log(username+" "+guard);
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('guardlist', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
			//查找user属性为username的文档，如果username为null则匹配全部
			
			//console.log(ids);

			var query_del = {"user":username,"guard":guard};
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

				var guardlists = [];
				
				docs.forEach(function(doc, index) {
					var guardlist = new Tracelist(doc.user, doc.guard,doc.guard_selfname,doc.child,doc.time);
					guardlists.push(guardlist);
				});

				callback(null, guardlists);
			});
		});
	});
};
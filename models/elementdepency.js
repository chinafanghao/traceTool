var mongodb = require('./db');

function ElementDepency(username, element,dependee,depender,_id) { //post means refinements list
	this.user = username;
	this.element = element;
	this.dependee=dependee;
	this.depender=depender;
	this._id=_id;
};
module.exports = ElementDepency;

ElementDepency.prototype.save = function save(callback) {
	// 存入 Mongodb 的文檔
	var elementdepency = {
		user: this.user,
		element:this.element,
		dependee:this.dependee,
		depender:this.depender
	};

	mongodb.open(function(err, db) {
		if (err) {
		  return callback(err);
		}
		
		db.collection('elementdepency', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.ensureIndex('user');
			
			collection.insert(elementdepency, {safe: true}, function(err, elementdepency) {
				mongodb.close();
				callback(err, elementdepency);
			});
		});
	});
};


ElementDepency.get = function get(user, callback) {
	console.log(user+"#");
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('elementdepency', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			//查找user属性为username的文档，如果username为null则匹配全部

			var query = {};
			if (user) {
				
				query={"user":user};
			}
			collection.ensureIndex('user');

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc._id);
					elementdepencys.push(elementdepencys);
				});

				callback(null, elementdepencys);
			});
		});
	});
};

ElementDepency.saveDependee = function saveDependee(user,elementname,dependee,callback){
	// 存入 Mongodb 的文檔
	var elementdepency = {
				user: user,
				element:elementname,
				dependee:dependee,
				depender:[]
			};
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('elementdepency', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
				db.collection('elementdepency', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.ensureIndex('user');
			
			collection.insert(elementdepency, {safe: true}, function(err, elementdepency) {
				mongodb.close();
				callback(err, elementdepency);
			});
		  });
		});
	});
};

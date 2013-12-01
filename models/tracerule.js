var mongodb = require('./db');

function Tracerule(username,name,selfname,time,operations,elements,_id) { //post means refinements list
	this.user = username;
	this.name=name;
	this.selfname=selfname;
	if (time) {
		this.time = time;
	} else {
		this.time = new Date();
	}
	this.operations=operations;
	this.elements=elements;
	this._id=_id;
};
module.exports = Tracerule;

Tracerule.prototype.save = function save(callback) {
	// 存入 Mongodb 的文檔
	var tracelist = {
		user: this.user,
		name:this.name,
		selfname:this.selfname,
		time: this.time,
		operations:this.operations,
		elements:this.elements
	};

	mongodb.open(function(err, db) {
		if (err) {
		  return callback(err);
		}
		
		db.collection('tracerule', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.ensureIndex('user');
			
			collection.insert(tracerule, {safe: true}, function(err, tracerule) {
				mongodb.close();
				callback(err, tracerule);
			});
		});
	});
};


Tracerule.get = function get(username, guard_id,callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('tracerule', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var ObjectID = require("mongodb").ObjectID;
			//查找user属性为username的文档，如果username为null则匹配全部
			var query = {};
			if (guard_id) {
				
				query={"user":username,"_id":ObjectID(guard_id)};
			}
			else{
				query={"user":username};
			}

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
};
/*
Tracelist.getChild = function get(featurename, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('tracelist', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			//查找user属性为username的文档，如果username为null则匹配全部
			var query = {};
			featurename="On-line activity diagram editor";
			if (featurename) {
				query.featurename = featurename;
			}

			collection.find(query, {limit:9}).sort({time: -1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var posts = [];
				
				docs.forEach(function(doc, index) {
					var post = new Post(doc.user, doc.featurename,doc.descriptions,doc.optionality,doc.post,doc.level,doc.parents, doc.time, doc.types,doc.contents, doc._id);
					posts.push(post);
				});

				callback(null, posts);
			});
		});
	});
};
*/
/*
Post.getChild= function get(featurename, callback) {
	var posts = [];
	var postss=[];
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			//查找user属性为username的文档，如果username为null则匹配全部
			var query = {};
			featurename="On-line activity diagram editor";
			if (featurename) {
				query.featurename = featurename;
				//query.level="0";
			}
		
			collection.find(query, {limit:9}).sort({time: -1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}
				console.log("&"+docs);
				docs.forEach(function(doc, index) {
					var post = new Post(doc.user, doc.featurename,doc.descriptions,doc.optionality,doc.post,doc.level,doc.parents, doc.time);
					
					postss.push(post);
				});

			//	callback(null, posts);
			if (err) {
			return callback(err);
		}
		
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			//查找user属性为username的文档，如果username为null则匹配全部
			postss.forEach(function(pos,ind){
				var query = {};
			if (pos.post) {
				var myArray=pos.post.split(',');
				console.log(myArray);
				myArray=['Login','Move figure'];
				var ind;
				for(ind=0;ind<myArray.length;ind++)
				{
					query.featurename = myArray[ind];console.log("$"+query.featurename);
					//console.log(collection.find(query));
					collection.find(query).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				console.log(docs);	 
					var post = new Post(docs.user, docs.featurename,docs.descriptions,docs.optionality,docs.post,docs.level,docs.parents, docs.time);
					posts[ind]=post;
				
				})	
			}
			callback(null, posts);
		}})
			
		});
		//
			});
		});
	});
};
*/
Tracerule.del = function del(username, operation_name,callback) {
	console.log(username+" "+operation_name+"#");
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('tracerule', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
			//查找user属性为username的文档，如果username为null则匹配全部
			
			//console.log(ids);

			var query_del = {"user":username,"operation_name":operation_name};
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

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
};


Tracerule.updateSelfname = function updateSelfname(selfname, user,name,id,callback) {
	// 存入 Mongodb 的文檔
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('tracerule', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var ObjectID = require("mongodb").ObjectID;
			//查找user属性为username的文档，如果username为null则匹配全部
			var query1 = {};
			var query2 = {};
				
			query1={"user":user,"_id":ObjectID(id),"name":name};
			query2={$set:{"selfname":selfname}};
			
			collection.update(query1,query2);

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
};
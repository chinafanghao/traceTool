var mongodb = require('./db');

function Tracelist(username, operation_name,operation_type,theparent,position,element,post,pre,time,is_virtual,_id) { //post means refinements list
	this.user = username;
	this.operation_name=operation_name;
	this.operation_type=operation_type;
	this.theparent = theparent;
	this.position=position;
	this.element=element;
	this.post=post;
	this.pre=pre;
	if (time) {
		this.time = time;
	} else {
		this.time = new Date();
	}
	this.is_virtual=is_virtual;
	this._id=_id;
};
module.exports = Tracelist;

Tracelist.prototype.save = function save(callback) {
	// 存入 Mongodb 的文檔
	var tracelist = {
		user: this.user,
		operation_name:this.operation_name,
		operation_type:this.operation_type,
		theparent:this.theparent,
		position:this.position,
		element:this.element,
		post: this.post,
		pre:this.pre,
		time: this.time,
		is_virtual: this.is_virtual
	};

	mongodb.open(function(err, db) {
		if (err) {
		  return callback(err);
		}
		
		db.collection('tracelist', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.ensureIndex('user');
			
			collection.insert(tracelist, {safe: true}, function(err, tracelist) {
				mongodb.close();
				callback(err, tracelist);
			});
		});
	});
};


Tracelist.get = function get(username, guard_id,callback) {
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
			if (guard_id) {
				
				query={"user":username,"theparent":guard_id};
			}
			else{
				query={"user":username};
			}

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracelists = [];
				
				docs.forEach(function(doc, index) {
					var tracelist = new Tracelist(doc.user, doc.operation_name,doc.operation_type,doc.theparent,doc.position,doc.element,doc.post,doc.pre,doc.time, doc.is_virtual, doc._id);
					tracelists.push(tracelist);
				});

				callback(null, tracelists);
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
Tracelist.del = function del(username, operation_name,callback) {
	console.log(username+" "+operation_name+"#");
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

				var tracelists = [];
				
				docs.forEach(function(doc, index) {
					var tracelist = new Tracelist(doc.user, doc.operation_name,doc.operation_type,doc.theparent,doc.position,doc.element,doc.post,doc.pre,doc.time, doc.is_virtual);
					tracelists.push(tracelist);
				});

				callback(null, tracelists);
			});
		});
	});
};
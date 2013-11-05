var mongodb = require('./db');

function Post(username, featurename,descriptions,optionality,post,level,parents,time,types,contents,_id) { //post means refinements list
	this.user = username;
	this.featurename=featurename;
	this.descriptions=descriptions;
	this.optionality=optionality;
	this.post = post;
	this.level=level;
	this.parents=parents;
	if (time) {
		this.time = time;
	} else {
		this.time = new Date();
	}
	
	this.types=types;
	this.contents=contents;
	this._id=_id;
};
module.exports = Post;

Post.prototype.save = function save(callback) {
	// 存入 Mongodb 的文檔
	var post = {
		user: this.user,
		featurename:this.featurename,
		descriptions:this.descriptions,
		optionality:this.optionality,
		post: this.post,
		level:this.level,
		parents:this.parents,
		time: this.time,
		types: this.types,
		contents: this.contents
	};

	mongodb.open(function(err, db) {
		if (err) {
		  return callback(err);
		}
		
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.ensureIndex('user');
			
			collection.insert(post, {safe: true}, function(err, post) {
				mongodb.close();
				callback(err, post);
			});
		});
	});
};
/*
Post.get = function get(username, callback) {
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
			if (username) {
				query.user = username;
			}

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var posts = [];
				
				docs.forEach(function(doc, index) {
					var post = new Post(doc.user, doc.featurename,doc.descriptions,doc.optionality,doc.post,doc.level,doc.parents, doc.time, doc._id);
					posts.push(post);
				});

				callback(null, posts);
			});
		});
	});
};
*/

Post.get = function get(username, callback) {
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
			if (username) {
				query.user = username;
			}

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var posts = [];
				
				docs.forEach(function(doc, index) {
					var post = new Post(doc.user, doc.featurename,doc.descriptions,doc.optionality,doc.post,doc.level,doc.parents, doc.time, doc.types, doc.contents, doc._id);
					posts.push(post);
				});

				callback(null, posts);
			});
		});
	});
};

Post.getChild = function get(featurename, callback) {
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
Post.del = function del(username, featurename,types,callback) {
	console.log(username+" "+featurename+" "+types+"#");
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
			
			//console.log(ids);

			var query_del = {"user":username,"featurename":featurename,"types":types};
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

				var posts = [];
				
				docs.forEach(function(doc, index) {
					var post = new Post(doc.user, doc.featurename,doc.descriptions,doc.optionality,doc.post,doc.level,doc.parents, doc.time, doc.types, doc.contents, doc._id);
					posts.push(post);
				});

				callback(null, posts);
			});
		});
	});
};
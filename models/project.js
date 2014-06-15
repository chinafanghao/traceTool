var mongodb = require('./db');

function Project(username,name,time,trace_rule_id,info,_id) { //post means refinements list
	this.user = username;
	this.name = name;
	if (time) {
		this.time = time;
	} else {
		this.time = new Date();
	}
	this._id=_id;
	this.trace_rule_id=trace_rule_id;
	this.info=info;
};
module.exports = Project;

Project.prototype.save = function save(callback) {
	// 存入 Mongodb 的文檔
	var Project = {
		user: this.user,
		name:this.name,
		time: this.time,
		trace_rule_id: this.trace_rule_id,
		info: this.info,
	};

	mongodb.open(function(err, db) {
		if (err) {
		  return callback(err);
		}
		
		db.collection('Project', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.ensureIndex('user');
			
			collection.insert(Project, {safe: true}, function(err, Project) {
				mongodb.close();
				callback(err, Project);
			});
		});
	});
};

Project.addNewProject = function addNewProject(username,projectname,info,callback) {
	// 存入 Mongodb 的文檔
	var newProject = {
				user: username,
				name:projectname,
				time:new Date(),
				trace_rule_id:[],
				info:info
			};
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
	   
	   db.collection('Project', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
		  
			collection.ensureIndex('user');
			collection.insert(newProject, {safe: true},function(err){
					if(err) console.warn(err.message);
					else {
						console.log("insert new Project success");
						var query = {};
						if (username) {
				
							query={"user":username};
						}
						collection.ensureIndex('user');

						collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
							mongodb.close();

							if (err) {
								callback(err, null);
							}

							var Projects = [];
							var current_id;
							docs.forEach(function(doc, index) {
								var project = new Project(doc.user, doc.name,doc.time,doc.trace_rule_id,doc.info,doc._id);
								Projects.push(project);
								if(doc.name==projectname)
									current_id=doc._id;
							});

							callback(null, Projects,current_id);
						});
					}
				});

		  });
		
	});
};

Project.get = function get(user, callback) {
	
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('Project', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			//查找user属性为username的文档，如果username为null则匹配全部

			var query = {};
			if (user) {
				
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var Projects = [];
				
				docs.forEach(function(doc, index) {
					var project = new Project(doc.user, doc.name,doc.time,doc.trace_rule_id,doc.info,doc._id);
					Projects.push(project);
					console.log(doc._id);
				});
				
				callback(null, Projects);
			});
		});
	});
};

Project.getByName = function getByName(user, projectname,callback) {
	console.log(user+"#");
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('Project', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			//查找user属性为username的文档，如果username为null则匹配全部

			var query = {};
			if (user) {
				
				query={"user":user,"name":projectname};
			}

			collection.find(query).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var theproject;
				
				docs.forEach(function(doc, index) {
					var project = new Project(doc.user, doc.name,doc.time,doc.trace_rule_id,doc.info,doc._id);
					theproject=project;
				});
				
				callback(null, theproject);
			});
		});
	});
};

Project.getByID = function getByID(user, ID,callback) {
	console.log(user+"#");
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('Project', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			//查找user属性为username的文档，如果username为null则匹配全部

			var query = {};
			var ObjectID = require("mongodb").ObjectID;
			if (user) {
				
				query={"user":user,"_id":ObjectID(ID)};
			}

			

			collection.find(query).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var theproject;
				
				docs.forEach(function(doc, index) {
					var project = new Project(doc.user, doc.name,doc.time,doc.trace_rule_id,doc.info,doc._id);
					theproject=project;
				});
				
				callback(null, theproject);
			});
		});
	});
};




Project.del = function del(username,id,callback) {
	
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('Project', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
			//查找user属性为username的文档，如果username为null则匹配全部
			
			//console.log(ids);
			var ObjectID = require("mongodb").ObjectID;
			var query_del = {"user":username,"_id":ObjectID(id)};
		
			collection.remove(query_del);

			var query = {};
			if (username) {
				query.user = username;
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var Projects = [];
				
				docs.forEach(function(doc, index) {
					var Project = new Tracelist(doc.user, doc.user,doc.name,doc.trace_rule_id,doc.time,doc._id,doc.info);
					Projects.push(Project);
				});

				callback(null, Projects);
			});
		});
	});
};


Project.updateProjectname = function updateProjectname(user,id,editname, callback) {
	
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('Project', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			//查找user属性为username的文档，如果username为null则匹配全部
			

			var query1={};
			var query2={};
			var ObjectID = require("mongodb").ObjectID;
			query1={"user":user,"_id":ObjectID(id)};
			query2={$set:{"name":editname}};

			collection.update(query1,query2,{safe:true},function(err){
				var query = {};
				if (user) {
				
					query={"user":user};
				}
				collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var Projects = [];
				
				docs.forEach(function(doc, index) {
					var project = new Project(doc.user, doc.name,doc.trace_rule_id,doc.time,doc._id);
					Projects.push(project);
				});

				callback(null, Projects,id);
				});
			});

			

			
		});
	});
};

Project.deleteProject = function deleteProject(user,deleteID, callback) {
	console.log("deleteProject");
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('Project', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			//查找user属性为username的文档，如果username为null则匹配全部
			

			var query1={};
			var query2={};
			var ObjectID = require("mongodb").ObjectID;
			query1={"user":user,"_id":ObjectID(deleteID)};
			

			collection.remove(query1,function(err){
								if(err) {console.warn(err.message);
												mongodb.close();}
								else {
										console.log("delete element success");
										var query = {};
										if (user) {
				
											query={"user":user};
										}
										collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
											mongodb.close();

											if (err) {
												callback(err, null);
											}

											var Projects = [];
				
											docs.forEach(function(doc, index) {
												var project = new Project(doc.user,doc.name,doc.time,doc.trace_rule_id,doc.info,doc._id);
												Projects.push(project);
											});

											callback(null, Projects);
										});
									}
								});
			
		});
	});
};

Project.editProject = function editProject(user,id,newname,newdescription, callback) {
	
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('Project', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			//查找user属性为username的文档，如果username为null则匹配全部
			

			var query1={};
			var query2={};
			var ObjectID = require("mongodb").ObjectID;
			query1={"user":user,"_id":ObjectID(id)};
			query2={$set:{"name":newname,"info":newdescription,"time":new Date()}};

			collection.update(query1,query2,{safe:true},function(err){
				var query = {};
				if (user) {
				
					query={"user":user,"_id":ObjectID(id)};
				}
				collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var theproject;
				
				docs.forEach(function(doc, index) {
					var project = new Project(doc.user, doc.name,doc.trace_rule_id,doc.time,doc._id);
					theproject=project;
				});

				callback(null, theproject,id);
				});
			});

			

			
		});
	});
};

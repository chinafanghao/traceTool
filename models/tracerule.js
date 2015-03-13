var mongodb = require('./db');
var async = require('async');  

function Tracerule(username,name,selfname,time,operations,elements,positions,projectID,_id) { //post means refinements list
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
	this.positions=positions;
	this.projectID=projectID;
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
		elements:this.elements,
		positions:this.positions,
		projectID:this.projectID
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
			
			collection.insert(tracelist, {safe: true}, function(err, tracelist) {
				mongodb.close();
				callback(err, tracelist);
			});
		});
	});
};

Tracerule.addNewTraceRule = function addNewTraceRule(username,guardname,selfname,projectID,callback) {
	// 存入 Mongodb 的文檔
// 存入 Mongodb 的文檔
	var newTraceRule = {
				user: username,
				name:guardname,
				selfname:selfname,
				positions:"",
				operations:{},
				elements:{},
				projectID:projectID
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
			collection.insert(newTraceRule, {safe: true},function(err){
					if(err) console.warn(err.message);
					else {
						console.log("insert new tracerule success");
						var query = {};
						if (username) {
				
							query={"user":username,"projectID":projectID};
						}
							collection.ensureIndex('user');
							collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
								mongodb.close();

								if (err) {
									callback(err, null);
								}

								var tracerules = [];
				
								docs.forEach(function(doc, index) {
									var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
									tracerules.push(tracerule);
								});

								callback(null, tracerules);
							});
					}
				});
		  });
		
	});
};



Tracerule.get = function get(username, projectID,guard_id,callback) {
	
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
				
				query={"user":username,"projectID":projectID,"_id":ObjectID(guard_id)};
			}
			else{
				query={"user":username,"projectID":projectID};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
};

Tracerule.getByName = function getByName(usernames, projectID,guardnames ,callback) {
	console.log(usernames+"###"+guardnames+"#####");
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
			var query = {};

				query={"user":usernames,"name":guardnames,"projectID":projectID};
		
				collection.findOne(query, function(err, doc) {
				mongodb.close();
				if (doc) {
					var tracerule = new Tracerule(doc);
					console.log("hahahahha "+doc._id);
					callback(null, tracerule);
				} else {
					callback(err, null);
				}
			});
			
		});
	});
};

Tracerule.returnIDByName = function returnIDByName(usernames, projectID,guardnames ,callback) {
	console.log(usernames+"###"+guardnames+"#####");
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
			var query = {};

				query={"user":usernames,"projectID":projectID,"name":guardnames};
		
				collection.findOne(query, function(err, doc) {
				mongodb.close();
				if (doc) {
					var tracerule = new Tracerule(doc);
					
					callback(null, doc._id);
				} else {
					callback(err, null);
				}
			});
			
		});
	});
};

Tracerule.returnElements = function returnElements(username, deleteID ,callback) {

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

				query={"user":username,"_id":ObjectID(deleteID)};
		
				collection.findOne(query, function(err, doc) {
				mongodb.close();
				if (doc) {
					
					callback(null, doc.elements);
				} else {
					callback(err, null);
				}
			});
			
		});
	});
};


Tracerule.getBySelfName = function getBySelfName(username, projectID,selfname ,callback) {
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
			var query = {};

				query={"user":username,"selfname":selfname,"projectID":projectID};
		

			collection.findOne(query, function(err, doc) {
				mongodb.close();
				if (doc) {
					var tracerule = new Tracerule(doc);
					callback(err, tracerule);
				} else {
					callback(err, null);
				}
			});
		});
	});
};


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

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
};


Tracerule.updateSelfname = function updateSelfname(selfname, user,id,callback) {
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
				
			query1={"user":user,"_id":ObjectID(id)};
			query2={$set:{"selfname":selfname}};
			
			collection.update(query1,query2);

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
};

Tracerule.SavePositions = function SavePositions(user,id,positions,callback) {
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
				
			query1={"_id":ObjectID(id)};
			query2={$set:{"positions":positions}};
			
			collection.update(query1,query2);

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
};


Tracerule.removeTraceRule = function removeTraceRule(user,deleteID,callback){
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
			if (deleteID) {
				
				query={"user":user,"_id":ObjectID(deleteID)};
			}
			collection.remove(query,function(err){
								if(err) {console.warn(err.message);
										mongodb.close();}
								else {
									console.log("delete element success");
									query={"user":user};
									collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
										mongodb.close();

										if (err) {
											callback(err, null);
										}

										var tracerules = [];
				
										docs.forEach(function(doc, index) {
											var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
											tracerules.push(tracerule);
										});

										callback(null, tracerules);
									});
									}
							});
		});
	});
}

Tracerule.createActivity = function createActivity(user,id,activityname,activitydescription,activityexecutor,current_accordion,positions,callback){
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
			var flag=true;
			var num;
			var insert_position;
			/*
			for(keys in positions){
				num=keys;
				if(flag){
					if(positions[keys]==current_accordion){
						flag=false;
						insert_position=keys+1;
					}
					num=num-1;
				}
				num=num+1;

			} 
			*/
				query1={"user":user,"_id":ObjectID(id)};
				//query1={"$where":"function(){for(key in this.operations){if(this.operations[key].position=="+positions[keys]+"){return true};}}"};
				console.log(query1);
				var keyValue="Create Activity "+activityname;
				console.log(keyValue);
				var operationName="operations."+keyValue+".name";
				var operationType="operations."+keyValue+".type";
				var operationPosition="operations."+keyValue+".position";
				var operationElement="operations."+keyValue+".element";
				var operationTime="operations."+keyValue+".time";
				var operations={};
					operations[operationName] = keyValue;
					operations[operationType] = "C2";
					operations[operationPosition]=current_accordion;
					operations[operationElement]=id+".element."+activityname;
					operations[operationTime]=new Date();
					
				var elementName="elements."+activityname+".name";
				var elementDescription="elements."+activityname+".description";
				var elementType="elements."+activityname+".type";
				var elementExecutor="elements."+activityname+".executor";
				var elementTime="elements."+activityname+".time";
				//var elementIsVirtual="elements."+activityname+".is_virtual";
				var elements={};
					
					elements[elementName]=activityname;
					elements[elementDescription]=activitydescription;
					elements[elementType]="activity";
					elements[elementExecutor]=activityexecutor;
					elements[elementTime]=new Date();
				//	elements[elementIsVirtual]=activityvirtual;
			
				query2={
					"$set":
							operations
							//infor.dir:activityname,
							//elements:elements[activityname]
						
					};
				collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else {
						console.log("createActivity success");
						query2={"$set":elements}
						
						collection.update(query1,query2,function(err){
							if(err) console.warn(err.message);
							else {
								console.log("createActivity success");
								query2={$set:{"positions":positions}};
								collection.update(query1,query2,function(err){
									if(err) console.warn(err.message);
									else {
										console.log("createActivity success");

										var query = {};
										if (id) {
				
											query={"user":user,"_id":ObjectID(id)};
										}
										else{
											query={"user":user};
										}

										collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
											mongodb.close();

											if (err) {
												callback(err, null);
											}

											var tracerules = [];
				
											docs.forEach(function(doc, index) {
												var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
												tracerules.push(tracerule);
											});

											callback(null, tracerules);
										});
									}
								});
							}
						});
					}
				});
				

				
			//query1={"user":user,"_id":ObjectID(id)};
			
				
			//query1={"user":user,"_id":ObjectID(id),"name":name};
			//query2={$set:{"selfname":selfname}};
			
			//collection.update(query1,query2);

		});
	});
}




Tracerule.createUseCase = function createUseCase(user,id,usecasename,usecasedescription,startname,endname,positions,callback){
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
	
				query1={"user":user,"_id":ObjectID(id)};
				//query1={"$where":"function(){for(key in this.operations){if(this.operations[key].position=="+positions[keys]+"){return true};}}"};
				//console.log(query1);
				var keyValue="Create Use Case "+usecasename;
				//console.log(keyValue);
				var operationName="operations."+keyValue+".name";
				var operationType="operations."+keyValue+".type";
				var operationPosition="operations."+keyValue+".position";
				var operationElement="operations."+keyValue+".element";
				var operationTime="operations."+keyValue+".time";
				var operations={};
					operations[operationName] = keyValue;
					operations[operationType] = "C1";
					operations[operationElement]=id+".element."+usecasename;
					operations[operationTime]=new Date();
					
				var elementName="elements."+usecasename+".name";
				var elementDescription="elements."+usecasename+".description";
				var elementType="elements."+usecasename+".type";
				var elementExecutor="elements."+usecasename+".executor";
				var elementTime="elements."+usecasename+".time";
				var elementIsVirtual="elements."+usecasename+".is_virtual";
				var elements={};
					
					elements[elementName]=usecasename;
					elements[elementDescription]=usecasedescription;
					elements[elementType]="usecase";		
					elements[elementTime]=new Date();

				var StartelementName="elements."+startname+".name";
				var StartelementDescription="elements."+startname+".description";
				var StartelementType="elements."+startname+".type";
				var StartelementTime="elements."+startname+".time";
				var Startelements={};
					
					Startelements[StartelementName]=startname;
					Startelements[StartelementDescription]="use case start";
					Startelements[StartelementType]="activity";		
					Startelements[StartelementTime]=new Date();

				var EndelementName="elements."+endname+".name";
				var EndelementDescription="elements."+endname+".description";
				var EndelementType="elements."+endname+".type";
				var EndelementTime="elements."+endname+".time";
				var Endelements={};
					
					Endelements[EndelementName]=endname;
					Endelements[EndelementDescription]="use case end";
					Endelements[EndelementType]="activity";		
					Endelements[EndelementTime]=new Date();	
			
				query2={
					"$set":
							operations
							//infor.dir:activityname,
							//elements:elements[activityname]
						
					};
				collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else {
						//console.log("createUseCase success");
						query2={"$set":elements}
						collection.update(query1,query2,function(err){
							if(err) console.warn(err.message);
							else {
								//console.log("createUseCase success");
								query2={$set:{"positions":positions}};
									collection.update(query1,query2,function(err){
										if(err) console.warn(err.message);
										else {
											//console.log("createUseCase success");
						query2={"$set":Startelements}
						collection.update(query1,query2,function(err){
							if(err) console.warn(err.message);
							else {
								query2={"$set":Endelements}
								collection.update(query1,query2,function(err){
									if(err) console.warn(err.message);
									else {

											var query = {};
											if (id) {
				
												query={"user":user,"_id":ObjectID(id)};
											}
											else{
												query={"user":user};
											}

											collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
												mongodb.close();

												if (err) {
													callback(err, null);
												}

												var tracerules = [];
				
												docs.forEach(function(doc, index) {
													var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
													tracerules.push(tracerule);
												});

												callback(null, tracerules);
											});
										   }
										 })
										}
								});
							}
						});
					}
				});
			}	
		});
	});
  })
};

Tracerule.createDecision = function createActivity(user,id,decisionname,decisiondescription,decisionexecutor,positions,callback){
	// 存入 Mongodb 的文檔
	console.log("create Decision");
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
			
				query1={"user":user,"_id":ObjectID(id)};
				
				var keyValue="Create Decision "+decisionname;
				
				var operationName="operations."+keyValue+".name";
				var operationType="operations."+keyValue+".type";
				var operationElement="operations."+keyValue+".element";
				var operationTime="operations."+keyValue+".time";
				var operations={};
					operations[operationName] = keyValue;
					operations[operationType] = "C3";
					operations[operationElement]=id+".element."+decisionname;
					operations[operationTime]=new Date();
					
				var elementName="elements."+decisionname+".name";
				var elementDescription="elements."+decisionname+".description";
				var elementType="elements."+decisionname+".type";
				var elementExecutor="elements."+decisionname+".executor";
				var elementTime="elements."+decisionname+".time";
				var elements={};
					
					elements[elementName]=decisionname;
					elements[elementDescription]=decisiondescription;
					elements[elementType]="decision";
					elements[elementExecutor]=decisionexecutor;
					elements[elementTime]=new Date();
					
			
				query2={
					"$set":
							operations
							//infor.dir:activityname,
							//elements:elements[activityname]
						
					};
				collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else {
						//console.log("create Decision success");
						query2={"$set":elements}
						collection.update(query1,query2,function(err){
							if(err) console.warn(err.message);
							else {
								//console.log("create Decision success");
								query2={$set:{"positions":positions}};
								collection.update(query1,query2,function(err){
									if(err) console.warn(err.message);
									else {
										//console.log("create Decision success");

										var query = {};
										if (id) {
				
											query={"user":user,"_id":ObjectID(id)};
										}
										else{
											query={"user":user};
										}

										collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
											mongodb.close();

											if (err) {
												callback(err, null);
											}

											var tracerules = [];
				
											docs.forEach(function(doc, index) {
												var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
												tracerules.push(tracerule);
											});

											callback(null, tracerules);
										});
									}
								});
							}
						});
					}
				});
				

				
			//query1={"user":user,"_id":ObjectID(id)};
			
				
			//query1={"user":user,"_id":ObjectID(id),"name":name};
			//query2={$set:{"selfname":selfname}};
			
			//collection.update(query1,query2);

		});
	});
}

Tracerule.createCondition = function createCondition(user,id,conditionname,conditiondescription,positions,callback){
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
	
				query1={"user":user,"_id":ObjectID(id)};
				//query1={"$where":"function(){for(key in this.operations){if(this.operations[key].position=="+positions[keys]+"){return true};}}"};
				//console.log(query1);
				var keyValue="Create Condition "+conditionname;
				//console.log(keyValue);
				var operationName="operations."+keyValue+".name";
				var operationType="operations."+keyValue+".type";
				var operationPosition="operations."+keyValue+".position";
				var operationElement="operations."+keyValue+".element";
				var operationTime="operations."+keyValue+".time";
				var operations={};
					operations[operationName] = keyValue;
					operations[operationType] = "C4";
					operations[operationElement]=id+".element."+conditionname;
					operations[operationTime]=new Date();
					
				var elementName="elements."+conditionname+".name";
				var elementDescription="elements."+conditionname+".description";
				var elementType="elements."+conditionname+".type";
				var elementExecutor="elements."+conditionname+".executor";
				var elementTime="elements."+conditionname+".time";
				
				var elements={};
					
					elements[elementName]=conditionname;
					elements[elementDescription]=conditiondescription;
					elements[elementType]="condition";		
					elements[elementTime]=new Date();
					
			
				query2={
					"$set":operations
					};
				collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else {
						
						query2={"$set":elements}
						collection.update(query1,query2,function(err){
							if(err) console.warn(err.message);
							else {
						
								query2={$set:{"positions":positions}};
								collection.update(query1,query2,function(err){
									if(err) console.warn(err.message);
									else {

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
									}
								});
							}
						});
					}
				});
				

				

		});
	});
}

Tracerule.saveInsertBetween = function saveInsertBetween(user,id,TarAct,PreAct,PostAct,UseCase,positions,callback){
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
	
				query1={"user":user,"_id":ObjectID(id)};
				//query1={"$where":"function(){for(key in this.operations){if(this.operations[key].position=="+positions[keys]+"){return true};}}"};
				//console.log(query1);
				var TargetActivity=TarAct.split('_');
				var PreActivity=PreAct.split('_');
				var PostActivity=PostAct.split('_');
				var Usecase=UseCase.split('_');
				var keyValue="Insert "+TargetActivity[1]+" between "+PreActivity[1]+" and "+PostActivity[1]+" in "+Usecase[1];
				//console.log(keyValue);
				var operationName="operations."+keyValue+".name";
				var operationType="operations."+keyValue+".type";
				var operationElement="operations."+keyValue+".element";
				var operationTime="operations."+keyValue+".time";
				var PreOperationElement="operations."+keyValue+".preElement";
				var PostOperationElement="operations."+keyValue+".postElement";
				var UseCaseElement="operations."+keyValue+".usecaseElement";
				var operations={};
					operations[operationName] = keyValue;
					operations[operationType] = "I1";
					operations[operationElement]=TargetActivity[0]+".element."+TargetActivity[1];
					operations[PreOperationElement]=PreActivity[0]+".element."+PreActivity[1];
					operations[PostOperationElement]=PostActivity[0]+".element."+PostActivity[1];
					operations[UseCaseElement]=Usecase[0]+".element."+Usecase[1];
					operations[operationTime]=new Date();
				
					
			
				query2={
					"$set":
							operations
					};
				collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("createCondition success");
				});

				query2={$set:{"positions":positions}};
				collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("createCondition success");
				});

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}

Tracerule.saveInsertActAfterPre = function saveInsertActAfterPre(user,id,TarAct,PreAct,UseCase,positions,callback){
	// 存入 Mongodb 的文檔
	if(TarAct.indexOf(".")>0){
			TarAct=TarAct.split(".")[0]+"_"+TarAct.split(".")[1];
			PreAct=PreAct.split(".")[0]+"_"+PreAct.split(".")[1];
			UseCase=UseCase.split(".")[0]+"_"+UseCase.split(".")[1];
		}
	console.log("saveInsertActAfterPre:"+TarAct+" "+PreAct+" "+UseCase);
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
	
				query1={"user":user,"_id":ObjectID(id)};
				//query1={"$where":"function(){for(key in this.operations){if(this.operations[key].position=="+positions[keys]+"){return true};}}"};
				//console.log(query1);
				var TargetActivity=TarAct.split('_');
				var PreActivity=PreAct.split('_');
				var Usecase=UseCase.split('_');
				if(TargetActivity[2]=="Start"||TargetActivity[2]=="End"){
					TargetActivity[1]=TargetActivity[1]+"_"+TargetActivity[2];
				}
				if(PreActivity[2]=="Start"||PreActivity[2]=="End"){
					PreActivity[1]=PreActivity[1]+"_"+PreActivity[2];
				}
				if(Usecase[2]=="Start"||Usecase[2]=="End"){
					Usecase[1]=Usecase[1]+"_"+Usecase[2];
				}
				var keyValue="Insert "+TargetActivity[1]+" after "+PreActivity[1]+" in "+Usecase[1];
				//console.log(keyValue);
				var operationName="operations."+keyValue+".name";
				var operationType="operations."+keyValue+".type";
				var operationElement="operations."+keyValue+".element";
				var operationTime="operations."+keyValue+".time";
				var PreOperationElement="operations."+keyValue+".preElement";
				var UseCaseElement="operations."+keyValue+".usecaseElement";
				var operations={};
					operations[operationName] = keyValue;
					operations[operationType] = "I2";
					operations[operationElement]=TargetActivity[0]+".element."+TargetActivity[1];
					operations[PreOperationElement]=PreActivity[0]+".element."+PreActivity[1];
					operations[UseCaseElement]=Usecase[0]+".element."+Usecase[1];
					operations[operationTime]=new Date();
				
					
			
				query2={
					"$set":
							operations
							//infor.dir:activityname,
							//elements:elements[activityname]
						
					};
				collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("createCondition success");
				});

				query2={$set:{"positions":positions}};
				collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("createCondition success");
				});

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}

Tracerule.saveInsertActBeforePost = function saveInsertActBeforePost(user,id,TarAct,PostAct,UseCase,positions,callback){
	// 存入 Mongodb 的文檔
	if(TarAct.indexOf(".")>0){
			TarAct=TarAct.split(".")[0]+"_"+TarAct.split(".")[1];
			PostAct=PostAct.split(".")[0]+"_"+PostAct.split(".")[1];
			UseCase=UseCase.split(".")[0]+"_"+UseCase.split(".")[1];
		}
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
	
				query1={"user":user,"_id":ObjectID(id)};
				//query1={"$where":"function(){for(key in this.operations){if(this.operations[key].position=="+positions[keys]+"){return true};}}"};
				//console.log(query1);
				var TargetActivity=TarAct.split('_');
				var PostActivity=PostAct.split('_');
				var Usecase=UseCase.split('_');
				if(TargetActivity[2]=="Start"||TargetActivity[2]=="End"){
					TargetActivity[1]=TargetActivity[1]+"_"+TargetActivity[2];
				}
				if(PostActivity[2]=="Start"||PostActivity[2]=="End"){
					PostActivity[1]=PostActivity[1]+"_"+PostActivity[2];
				}
				if(Usecase[2]=="Start"||Usecase[2]=="End"){
					Usecase[1]=Usecase[1]+"_"+Usecase[2];
				}
				var keyValue="Insert "+TargetActivity[1]+" before "+PostActivity[1]+" in "+Usecase[1];
				//console.log(keyValue);
				var operationName="operations."+keyValue+".name";
				var operationType="operations."+keyValue+".type";
				var operationElement="operations."+keyValue+".element";
				var operationTime="operations."+keyValue+".time";
				var PostOperationElement="operations."+keyValue+".postElement";
				var UseCaseElement="operations."+keyValue+".usecaseElement";
				var operations={};
					operations[operationName] = keyValue;
					operations[operationType] = "I3";
					operations[operationElement]=TargetActivity[0]+".element."+TargetActivity[1];
					operations[PostOperationElement]=PostActivity[0]+".element."+PostActivity[1];
					operations[UseCaseElement]=Usecase[0]+".element."+Usecase[1];
					operations[operationTime]=new Date();
				
					
			
				query2={
					"$set":
							operations
							//infor.dir:activityname,
							//elements:elements[activityname]
						
					};
				collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("createCondition success");
				});

				query2={$set:{"positions":positions}};
				collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("createCondition success");
				});

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}

Tracerule.saveInsertActAfterDecCon = function saveInsertActAfterDecCon(user,id,TarAct,Decision,Condition,UseCase,positions,callback){
	// 存入 Mongodb 的文檔
	if(TarAct.indexOf(".")>0){
			TarAct=TarAct.split(".")[0]+"_"+TarAct.split(".")[1];
			Decision=Decision.split(".")[0]+"_"+Decision.split(".")[1];
			Condition=Condition.split(".")[0]+"_"+Condition.split(".")[1];
			UseCase=UseCase.split(".")[0]+"_"+UseCase.split(".")[1];
		}
		console.log("saveInsertActAfterDecCon:"+TarAct+" "+Decision+" "+Condition+" "+UseCase);
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
	
				query1={"user":user,"_id":ObjectID(id)};
				//query1={"$where":"function(){for(key in this.operations){if(this.operations[key].position=="+positions[keys]+"){return true};}}"};
				//console.log(query1);
				var TargetActivity=TarAct.split('_');
				var TheCondition=Condition.split('_');
				var TheDecision=Decision.split('_');
				var Usecase=UseCase.split('_');
				if(TargetActivity[2]=="Start"||TargetActivity[2]=="End"){
					TargetActivity[1]=TargetActivity[1]+"_"+TargetActivity[2];
				}
				var keyValue="Insert "+TargetActivity[1]+" after "+TheDecision[1]+" , "+TheCondition[1]+" in "+Usecase[1];
				//console.log(keyValue);
				var operationName="operations."+keyValue+".name";
				var operationType="operations."+keyValue+".type";
				var operationElement="operations."+keyValue+".element";
				var operationTime="operations."+keyValue+".time";
				var decisionname="operations."+keyValue+".decision";
				var conditionname="operations."+keyValue+".condition";
				var UseCaseElement="operations."+keyValue+".usecaseElement";
				var operations={};
					operations[operationName] = keyValue;
					operations[operationType] = "I4";
					operations[operationElement]=TargetActivity[0]+".element."+TargetActivity[1];
					operations[decisionname]=TheDecision[0]+".element."+TheDecision[1];
					operations[conditionname]=TheCondition[0]+".element."+TheCondition[1];
					operations[UseCaseElement]=Usecase[0]+".element."+Usecase[1];
					operations[operationTime]=new Date();
				
					
			
				query2={
					"$set":
							operations
							//infor.dir:activityname,
							//elements:elements[activityname]
						
					};
				collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("InsertActAfterDecCon success");
				});

				query2={$set:{"positions":positions}};
				collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("InsertActAfterDecCon success");
				});

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}

Tracerule.saveInsertActBeforeActCon = function saveInsertActBeforeActCon(user,id,TarAct,PostAct,Condition,UseCase,positions,callback){
	// 存入 Mongodb 的文檔
	if(TarAct.indexOf(".")>0){
			TarAct=TarAct.split(".")[0]+"_"+TarAct.split(".")[1];
			PostAct=PostAct.split(".")[0]+"_"+PostAct.split(".")[1];
			Condition=Condition.split(".")[0]+"_"+Condition.split(".")[1];
			UseCase=UseCase.split(".")[0]+"_"+UseCase.split(".")[1];
		}
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
	
				query1={"user":user,"_id":ObjectID(id)};
				//query1={"$where":"function(){for(key in this.operations){if(this.operations[key].position=="+positions[keys]+"){return true};}}"};
				//console.log(query1);
				var TargetActivity=TarAct.split('_');
				var TheCondition=Condition.split('_');
				var PostActivity=PostAct.split('_');
				var Usecase=UseCase.split('_');
				if(TargetActivity[2]=="Start"||TargetActivity[2]=="End"){
					TargetActivity[1]=TargetActivity[1]+"_"+TargetActivity[2];
				}
				var keyValue="Insert "+TargetActivity[1]+" before "+PostActivity[1]+" , "+TheCondition[1]+" in "+Usecase[1];
				//console.log(keyValue);
				var operationName="operations."+keyValue+".name";
				var operationType="operations."+keyValue+".type";
				var operationElement="operations."+keyValue+".element";
				var operationTime="operations."+keyValue+".time";
				var postactivityname="operations."+keyValue+".postactivity";
				var conditionname="operations."+keyValue+".condition";
				var UseCaseElement="operations."+keyValue+".usecaseElement";
				var operations={};
					operations[operationName] = keyValue;
					operations[operationType] = "I5";
					operations[operationElement]=TargetActivity[0]+".element."+TargetActivity[1];
					operations[postactivityname]=PostActivity[0]+".element."+PostActivity[1];
					operations[conditionname]=TheCondition[0]+".element."+TheCondition[1];
					operations[UseCaseElement]=Usecase[0]+".element."+Usecase[1];
					operations[operationTime]=new Date();
				
					
			
				query2={
					"$set":
							operations
							//infor.dir:activityname,
							//elements:elements[activityname]
						
					};
				collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("InsertActBeforeActCon success");
				});

				query2={$set:{"positions":positions}};
				collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("InsertActBeforeActCon success");
				});

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}

Tracerule.saveInsertDecAfterActCon = function saveInsertDecAfterActCon(user,id,TarDec,PreAct,MainBranchCon,SupBranchCon,InserAct,TargetAct,UseCase,positions,callback){
	if(TarDec.indexOf(".")>0){
			TarDec=TarDec.split(".")[0]+"_"+TarDec.split(".")[1];
			PreAct=PreAct.split(".")[0]+"_"+PreAct.split(".")[1];
			MainBranchCon=MainBranchCon.split(".")[0]+"_"+MainBranchCon.split(".")[1];
			SupBranchCon=SupBranchCon.split(".")[0]+"_"+SupBranchCon.split(".")[1];
			InserAct=InserAct.split(".")[0]+"_"+InserAct.split(".")[1];
			TargetAct=TargetAct.split(".")[0]+"_"+TargetAct.split(".")[1];
			UseCase=UseCase.split(".")[0]+"_"+UseCase.split(".")[1];
		}
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
	
				query1={"user":user,"_id":ObjectID(id)};
				//query1={"$where":"function(){for(key in this.operations){if(this.operations[key].position=="+positions[keys]+"){return true};}}"};
				//console.log(query1);
				var TargetDecision=TarDec.split('_');
				var PreActivity=PreAct.split('_');
				var MainBranchCondition=MainBranchCon.split('_');
				var SupBranchCondition=SupBranchCon.split('_');
				var InserActivity=InserAct.split('_');
				var TargetActivity=TargetAct.split('_');
				var Usecase=UseCase.split('_');
				if(PreActivity[2]=="Start"||PreActivity[2]=="End"){
					PreActivity[1]=PreActivity[1]+"_"+PreActivity[2];
				}
				if(InserActivity[2]=="Start"||InserActivity[2]=="End"){
					InserActivity[1]=InserActivity[1]+"_"+InserActivity[2];
				}
				if(TargetActivity[2]=="Start"||TargetActivity[2]=="End"){
					TargetActivity[1]=TargetActivity[1]+"_"+TargetActivity[2];
				}
				var keyValue="Insert "+TargetDecision[1]+" after "+PreActivity[1]+" with ( "+MainBranchCondition[1]+" ),( "+SupBranchCondition[1]+" , ";
					if(InserActivity[0]!="none")
						keyValue=keyValue+InserActivity[1]+" , ";
					keyValue=keyValue+TargetActivity[1]+" ) in "+Usecase[1];
				//console.log(keyValue);
				var operationName="operations."+keyValue+".name";
				var operationType="operations."+keyValue+".type";
				var operationElement="operations."+keyValue+".element";
				var operationTime="operations."+keyValue+".time";
				var preactivityname="operations."+keyValue+".preactivity";
				var MainBranchConditionname="operations."+keyValue+".maincondition";
				var SupBranchConditionname="operations."+keyValue+".supcondition";
				var insertactivity="operations."+keyValue+".insertactivity";
				var targetactivity="operations."+keyValue+".targetactivity";
				var UseCaseElement="operations."+keyValue+".usecaseElement";

				var operations={};
					operations[operationName] = keyValue;
					operations[operationType] = "I6";
					operations[operationElement]=TargetDecision[0]+".element."+TargetDecision[1];
					operations[preactivityname]=PreActivity[0]+".element."+PreActivity[1];
					operations[MainBranchConditionname]=MainBranchCondition[0]+".element."+MainBranchCondition[1];
					operations[SupBranchConditionname]=SupBranchCondition[0]+".element."+SupBranchCondition[1];
					if(InserActivity[1]=="none")
						operations[insertactivity]=[];
					else
						operations[insertactivity]=InserActivity[0]+".element."+InserActivity[1];
					operations[targetactivity]=TargetActivity[0]+".element."+TargetActivity[1];
					operations[UseCaseElement]=Usecase[0]+".element."+Usecase[1];
					operations[operationTime]=new Date();
				
					
			
				query2={
					"$set":
							operations
							//infor.dir:activityname,
							//elements:elements[activityname]
						
					};
				collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("saveInsertDecAfterActCon success");
				});

				query2={$set:{"positions":positions}};
				collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("saveInsertDecAfterActCon success");
				});

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}

Tracerule.saveInsertDecAfterDecCon = function saveInsertDecAfterDecCon(user,id,TarDec,InserDec,InserCon,MainBranchCon,SupBranchCon,InserAct,TargetDec,UseCase,positions,callback){
	if(TarDec.indexOf(".")>0){
			TarDec=TarDec.split(".")[0]+"_"+TarDec.split(".")[1];
			InserDec=InserDec.split(".")[0]+"_"+InserDec.split(".")[1];
			InserCon=InserCon.split(".")[0]+"_"+InserCon.split(".")[1];
			MainBranchCon=MainBranchCon.split(".")[0]+"_"+MainBranchCon.split(".")[1];
			SupBranchCon=SupBranchCon.split(".")[0]+"_"+SupBranchCon.split(".")[1];
			InserAct=InserAct.split(".")[0]+"_"+InserAct.split(".")[1];
			TargetDec=TargetDec.split(".")[0]+"_"+TargetDec.split(".")[1];
			UseCase=UseCase.split(".")[0]+"_"+UseCase.split(".")[1];
		}
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
	
				query1={"user":user,"_id":ObjectID(id)};
				//query1={"$where":"function(){for(key in this.operations){if(this.operations[key].position=="+positions[keys]+"){return true};}}"};
				//console.log(query1);
				var TargetDecision=TarDec.split('_');
				var InsertDecison=InserDec.split('_');
				var InsertConditon=InserCon.split('_');
				var MainBranchCondition=MainBranchCon.split('_');
				var SupBranchCondition=SupBranchCon.split('_');
				var InserActivity=InserAct.split('_');
				var TargetDecisions=TargetDec.split('_');
				var Usecase=UseCase.split('_');
				if(InserActivity[2]=="Start"||InserActivity[2]=="End"){
					InserActivity[1]=InserActivity[1]+"_"+InserActivity[2];
				}

				var keyValue="Insert "+TargetDecision[1]+" after ( "+InsertDecison[1]+" , "+InsertConditon[1]+" ) with ( "+MainBranchCondition[1]+" ),( "+SupBranchCondition[1]+" , "+InserActivity[1]+" , "+TargetDecisions[1]+" ) in "+Usecase[1];
				//console.log(keyValue);
				var operationName="operations."+keyValue+".name";
				var operationType="operations."+keyValue+".type";
				var operationElement="operations."+keyValue+".element";
				var operationTime="operations."+keyValue+".time";
				var insertdecisionname="operations."+keyValue+".insertdecision";
				var insertconditionname="operations."+keyValue+".insertcondition";
				var MainBranchConditionname="operations."+keyValue+".maincondition";
				var SupBranchConditionname="operations."+keyValue+".supcondition";
				var insertactivity="operations."+keyValue+".insertactivity";
				var targetdecision="operations."+keyValue+".targetdecision";
				var UseCaseElement="operations."+keyValue+".usecaseElement";

				var operations={};
					operations[operationName] = keyValue;
					operations[operationType] = "I7";
					operations[operationElement]=TargetDecision[0]+".element."+TargetDecision[1];
					operations[insertdecisionname]=InsertDecison[0]+".element."+InsertDecison[1];
					operations[insertconditionname]=InsertConditon[0]+".element."+InsertConditon[1];
					operations[MainBranchConditionname]=MainBranchCondition[0]+".element."+MainBranchCondition[1];
					operations[SupBranchConditionname]=SupBranchCondition[0]+".element."+SupBranchCondition[1];
					operations[insertactivity]=InserActivity[0]+".element."+InserActivity[1];
					operations[targetdecision]=TargetDecisions[0]+".element."+TargetDecisions[1];
					operations[UseCaseElement]=Usecase[0]+".element."+Usecase[1];
					operations[operationTime]=new Date();
				
					
			
				query2={
					"$set":
							operations
							//infor.dir:activityname,
							//elements:elements[activityname]
						
					};
				collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("saveInsertDecAfterDecCon success");
				});

				query2={$set:{"positions":positions}};
				collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("saveInsertDecAfterDecCon success");
				});

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}

Tracerule.saveInsertDecBeforeAct = function saveInsertDecBeforeAct(user,id,TarDec,PostAct,Con1,Tar1,Con2,Tar2,UseCase,positions,callback){
	if(TarDec.indexOf(".")>0){
			TarDec=TarDec.split(".")[0]+"_"+TarDec.split(".")[1];
			PostAct=PostAct.split(".")[0]+"_"+PostAct.split(".")[1];
			Con1=Con1.split(".")[0]+"_"+Con1.split(".")[1];
			Tar1=Tar1.split(".")[0]+"_"+Tar1.split(".")[1];
			Con2=Con2.split(".")[0]+"_"+Con2.split(".")[1];
			Tar2=Tar2.split(".")[0]+"_"+Tar2.split(".")[1];
			UseCase=UseCase.split(".")[0]+"_"+UseCase.split(".")[1];
		}
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
	
				query1={"user":user,"_id":ObjectID(id)};
				//query1={"$where":"function(){for(key in this.operations){if(this.operations[key].position=="+positions[keys]+"){return true};}}"};
				//console.log(query1);
				var TargetDecision=TarDec.split('_');
				var PostActivity=PostAct.split('_');
				var Condition1=Con1.split('_');
				var Target1=Tar1.split('_');
				var Condition2=Con2.split('_');
				var Target2=Tar2.split('_');
				var Usecase=UseCase.split('_');
				if(PostActivity[2]=="Start"||PostActivity[2]=="End"){
					PostActivity[1]=PostActivity[1]+PostActivity[2];
				}
				if(Target1[2]=="Start"||Target1[2]=="End"){
					Target1[1]=Target1[1]+"_"+Target1[2];
				}
				if(Target2[2]=="Start"||Target2[2]=="End"){
					Target2[1]=Target2[1]+"_"+Target2[2];
				}

				var keyValue="Insert "+TargetDecision[1]+" before "+PostActivity[1]+" with ( "+Condition1[1]+" , "+Target1[1]+" ),( "+Condition2[1]+" , "+Target2[1]+" ) in "+Usecase[1];
				
				//console.log(keyValue);
				var operationName="operations."+keyValue+".name";
				var operationType="operations."+keyValue+".type";
				var operationElement="operations."+keyValue+".element";
				var operationTime="operations."+keyValue+".time";
				var postactivityname="operations."+keyValue+".postactivity";
				var Condition1name="operations."+keyValue+".condition1";
				var Target1name="operations."+keyValue+".target1";
				var Condition2name="operations."+keyValue+".condition2";
				var Target2name="operations."+keyValue+".target2";
				var UseCaseElement="operations."+keyValue+".usecaseElement";

				var operations={};
					operations[operationName] = keyValue;
					operations[operationType] = "I8";
					operations[operationElement]=TargetDecision[0]+".element."+TargetDecision[1];
					operations[postactivityname]=PostActivity[0]+".element."+PostActivity[1];
					operations[Condition1name]=Condition1[0]+".element."+Condition1[1];
					operations[Target1name]=Target1[0]+".element."+Target1[1];	
					operations[Condition2name]=Condition2[0]+".element."+Condition2[1];
					operations[Target2name]=Target2[0]+".element."+Target2[1];
					operations[UseCaseElement]=Usecase[0]+".element."+Usecase[1];
					operations[operationTime]=new Date();
				
					
			
				query2={
					"$set":
							operations
							//infor.dir:activityname,
							//elements:elements[activityname]
						
					};
				collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("saveInsertDecBeforeAct success");
				});

				query2={$set:{"positions":positions}};
				collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("saveInsertDecBeforeAct success");
				});

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}

Tracerule.saveInsertDecBeforeActWith = function saveInsertDecBeforeActWith(user,id,TarDec,PostAct,MainBranchCon,SupBranchCon,InserAct,TargetDec,UseCase,positions,callback){
	if(TarDec.indexOf(".")>0){
			TarDec=TarDec.split(".")[0]+"_"+TarDec.split(".")[1];
			PostAct=PostAct.split(".")[0]+"_"+PostAct.split(".")[1];
			MainBranchCon=MainBranchCon.split(".")[0]+"_"+MainBranchCon.split(".")[1];
			SupBranchCon=SupBranchCon.split(".")[0]+"_"+SupBranchCon.split(".")[1];
			InserAct=InserAct.split(".")[0]+"_"+InserAct.split(".")[1];
			TargetDec=TargetDec.split(".")[0]+"_"+TargetDec.split(".")[1];
			UseCase=UseCase.split(".")[0]+"_"+UseCase.split(".")[1];
		}
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
	
				query1={"user":user,"_id":ObjectID(id)};
				//query1={"$where":"function(){for(key in this.operations){if(this.operations[key].position=="+positions[keys]+"){return true};}}"};
				//console.log(query1);
				var TargetDecision=TarDec.split('_');
				var PostActivity=PostAct.split('_');
				var MainBranchCondition=MainBranchCon.split('_');
				var SupBranchCondition=SupBranchCon.split('_');
				var InserActivity=InserAct.split('_');
				var TargetDecisions=TargetDec.split('_');
				var Usecase=UseCase.split('_');
				if(PostActivity[2]=="Start"||PostActivity[2]=="End"){
					PostActivity[1]=PostActivity[1]+"_"+PostActivity[2];
				}
				if(InserActivity[2]=="Start"||InserActivity[2]=="End"){
					InserActivity[1]=InserActivity[1]+"_"+InserActivity[2];
				}
				var keyValue="Insert "+TargetDecision[1]+" before "+PostActivity[1]+" with ( "+MainBranchCondition[1]+" ),( "+SupBranchCondition[1]+" , ";
					if(InserActivity[0]!="none")
						keyValue=keyValue+InserActivity[1]+" , ";
					keyValue=keyValue+TargetDecisions[1]+" ) in "+Usecase[1];
				//console.log(keyValue);
				var operationName="operations."+keyValue+".name";
				var operationType="operations."+keyValue+".type";
				var operationElement="operations."+keyValue+".element";
				var operationTime="operations."+keyValue+".time";
				var postactivityname="operations."+keyValue+".postactivity";
				var MainBranchConditionname="operations."+keyValue+".maincondition";
				var SupBranchConditionname="operations."+keyValue+".supcondition";
				var insertactivity="operations."+keyValue+".insertactivity";
				var targetdecision="operations."+keyValue+".targetdecision";
				var UseCaseElement="operations."+keyValue+".usecaseElement";

				var operations={};
					operations[operationName] = keyValue;
					operations[operationType] = "I9";
					operations[operationElement]=TargetDecision[0]+".element."+TargetDecision[1];
					operations[postactivityname]=PostActivity[0]+".element."+PostActivity[1];
					operations[MainBranchConditionname]=MainBranchCondition[0]+".element."+MainBranchCondition[1];
					operations[SupBranchConditionname]=SupBranchCondition[0]+".element."+SupBranchCondition[1];
					if(InserActivity[1]=="none")
						operations[insertactivity]=[];
					else
						operations[insertactivity]=InserActivity[0]+".element."+InserActivity[1];
					operations[targetdecision]=TargetDecisions[0]+".element."+TargetDecisions[1];
					operations[UseCaseElement]=Usecase[0]+".element."+Usecase[1];
					operations[operationTime]=new Date();
				
					
			
				query2={
					"$set":
							operations
							//infor.dir:activityname,
							//elements:elements[activityname]
						
					};
				collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("saveInsertDecAfterActCon success");
				});

				query2={$set:{"positions":positions}};
				collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("saveInsertDecAfterActCon success");
				});

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}

Tracerule.saveInsertDecBeforeActCon = function saveInsertDecBeforeActCon(user,id,TarDec,PostAct,InserCon,MainBranchCon,SupBranchCon,InserAct,TargetDec,UseCase,positions,callback){
	if(TarDec.indexOf(".")>0){
			TarDec=TarDec.split(".")[0]+"_"+TarDec.split(".")[1];
			PostAct=PostAct.split(".")[0]+"_"+PostAct.split(".")[1];
			InserCon=InserCon.split(".")[0]+"_"+InserCon.split(".")[1];
			MainBranchCon=MainBranchCon.split(".")[0]+"_"+MainBranchCon.split(".")[1];
			SupBranchCon=SupBranchCon.split(".")[0]+"_"+SupBranchCon.split(".")[1];
			InserAct=InserAct.split(".")[0]+"_"+InserAct.split(".")[1];
			TargetDec=TargetDec.split(".")[0]+"_"+TargetDec.split(".")[1];
			UseCase=UseCase.split(".")[0]+"_"+UseCase.split(".")[1];
		}
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
	
				query1={"user":user,"_id":ObjectID(id)};
				//query1={"$where":"function(){for(key in this.operations){if(this.operations[key].position=="+positions[keys]+"){return true};}}"};
				//console.log(query1);
				var TargetDecision=TarDec.split('_');
				var PostActivity=PostAct.split('_');
				var InsertConditon=InserCon.split('_');
				var MainBranchCondition=MainBranchCon.split('_');
				var SupBranchCondition=SupBranchCon.split('_');
				var InserActivity=InserAct.split('_');
				var TargetDecisions=TargetDec.split('_');
				var Usecase=UseCase.split('_');
				if(PostActivity[2]=="Start"||PostActivity[2]=="End"){
					PostActivity[1]=PostActivity[1]+"_"+PostActivity[2];
				}
				if(InserActivity[2]=="Start"||InserActivity[2]=="End"){
					InserActivity[1]=InserActivity[1]+"_"+InserActivity[2];
				}
				var keyValue="Insert "+TargetDecision[1]+" before ( "+PostActivity[1]+" , "+InsertConditon[1]+" ) with ( "+MainBranchCondition[1]+" ),( "+SupBranchCondition[1]+" , "+InserActivity[1]+" , "+TargetDecisions[1]+" ) in "+Usecase[1];
				//console.log(keyValue);
				var operationName="operations."+keyValue+".name";
				var operationType="operations."+keyValue+".type";
				var operationElement="operations."+keyValue+".element";
				var operationTime="operations."+keyValue+".time";
				var postactivityname="operations."+keyValue+".postactivity";
				var insertconditionname="operations."+keyValue+".insertcondition";
				var MainBranchConditionname="operations."+keyValue+".maincondition";
				var SupBranchConditionname="operations."+keyValue+".supcondition";
				var insertactivity="operations."+keyValue+".insertactivity";
				var targetdecision="operations."+keyValue+".targetdecision";
				var UseCaseElement="operations."+keyValue+".usecaseElement";

				var operations={};
					operations[operationName] = keyValue;
					operations[operationType] = "I10";
					operations[operationElement]=TargetDecision[0]+".element."+TargetDecision[1];
					operations[postactivityname]=PostActivity[0]+".element."+PostActivity[1];
					operations[insertconditionname]=InsertConditon[0]+".element."+InsertConditon[1];
					operations[MainBranchConditionname]=MainBranchCondition[0]+".element."+MainBranchCondition[1];
					operations[SupBranchConditionname]=SupBranchCondition[0]+".element."+SupBranchCondition[1];
					operations[insertactivity]=InserActivity[0]+".element."+InserActivity[1];
					operations[targetdecision]=TargetDecisions[0]+".element."+TargetDecisions[1];
					operations[UseCaseElement]=Usecase[0]+".element."+Usecase[1];
					operations[operationTime]=new Date();
				
					
			
				query2={
					"$set":
							operations
							//infor.dir:activityname,
							//elements:elements[activityname]
						
					};
				collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("saveInsertDecAfterDecCon success");
				});

				query2={$set:{"positions":positions}};
				collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("saveInsertDecAfterDecCon success");
				});

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}

Tracerule.deleteActivity = function deleteActivity(user,id,operation_name,positions,callback){
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
			
			query1={"user":user,"_id":ObjectID(id)};
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			console.log(operation_name+"#"+name[length]);
			var elementName="elements."+name[length];
			var elements={};
			     elements[elementName]=name[length];
			collection.update(query1,{"$unset":elements},function(err){
					if(err) console.warn(err.message);
					else console.log("delete element success");
				});

			var operationName="operations."+operation_name;
			var operations={};
					operations[operationName] = operation_name;
			collection.update(query1,{"$unset":operations},function(err){
					if(err) console.warn(err.message);
					else console.log("delete element success");
				});


			query2={$set:{"positions":positions}};
			collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("delete Activity success");
				});
			collection.find({"user":user,"_id":ObjectID(id),"operations":operation_name}).sort({_id: 1}).toArray(function(err, docs) {
				console.log("OK");
				docs.forEach(function(doc, index) {
					console.log(doc.name);
				});
			});

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}

Tracerule.deleteDecision = function deleteDecision(user,id,operation_name,positions,callback){
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
			
				query1={"user":user,"_id":ObjectID(id)};
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			console.log(operation_name+"#"+name[length]);
			var elementName="elements."+name[length];
			var elements={};
			     elements[elementName]=name[length];
			collection.update(query1,{"$unset":elements},function(err){
					if(err) console.warn(err.message);
					else console.log("delete element success");
				});

			var operationName="operations."+operation_name;
			var operations={};
					operations[operationName] = operation_name;
			collection.update(query1,{"$unset":operations},function(err){
					if(err) console.warn(err.message);
					else console.log("delete decision success");
				});


			query2={$set:{"positions":positions}};
			collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("delete Decision success");
				});
			collection.find({"user":user,"_id":ObjectID(id),"operations":operation_name}).sort({_id: 1}).toArray(function(err, docs) {
				console.log("OK");
				docs.forEach(function(doc, index) {
					console.log(doc.name);
				});
			});

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}

Tracerule.deleteCondition = function deleteCondition(user,id,operation_name,positions,callback){
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
			
				query1={"user":user,"_id":ObjectID(id)};
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			console.log(operation_name+"#"+name[length]);
			var elementName="elements."+name[length];
			var elements={};
			     elements[elementName]=name[length];
			collection.update(query1,{"$unset":elements},function(err){
					if(err) console.warn(err.message);
					else console.log("delete element success");
				});

			var operationName="operations."+operation_name;
			var operations={};
					operations[operationName] = operation_name;
			collection.update(query1,{"$unset":operations},function(err){
					if(err) console.warn(err.message);
					else console.log("delete decision success");
				});


			query2={$set:{"positions":positions}};
			collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("delete Decision success");
				});
			collection.find({"user":user,"_id":ObjectID(id),"operations":operation_name}).sort({_id: 1}).toArray(function(err, docs) {
				console.log("OK");
				docs.forEach(function(doc, index) {
					console.log(doc.name);
				});
			});

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}

Tracerule.deleteUseCase = function deleteUseCase(user,id,operation_name,positions,callback){
	// 存入 Mongodb 的文檔
	console.log("deleteUseCase: "+user+" "+id+" "+operation_name);
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
			
				query1={"user":user,"_id":ObjectID(id)};
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			console.log(operation_name+"#"+name[length]);
			var elementName="elements."+name[length];
			var elements={};
			elements[elementName]=name[length];

			var StartelementName="elements."+name[length]+"_Start";
			var Startelements={};
			Startelements[StartelementName]=name[length]+"_Start";

			var EndelementName="elements."+name[length]+"_End";
			var Endelements={};
			Endelements[EndelementName]=name[length]+"_End"; 

			collection.update(query1,{"$unset":elements},function(err){
					if(err) 
					{
						console.warn(err.message);

					}
					else 
					{

						collection.update(query1,{"$unset":Startelements},function(err){
							if(err) 
							{
								console.warn(err.message);

							}
							else 
							{
								collection.update(query1,{"$unset":Endelements},function(err){
									if(err) 
									{
										console.warn(err.message);

									}
									else 
									{

						console.log("delete element success");
						var operationName="operations."+operation_name;
						var operations={};
						operations[operationName] = operation_name;
					
						collection.update(query1,{"$unset":operations},function(err){
							if(err) console.warn(err.message);
							else 
							{
								console.log("delete decision success");

								query2={$set:{"positions":positions}};
							
								collection.update(query1,query2,function(err){
									if(err) console.warn(err.message);
									else {
										console.log("delete Decision success");

										var query = {};
										if (id) {
				
											query={"user":user,"_id":ObjectID(id)};
										}
										else{
											query={"user":user};
										}

										collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
											mongodb.close();

											if (err) {
												callback(err, null);
											}

											var tracerules = [];
				
											docs.forEach(function(doc, index) {
												var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
													tracerules.push(tracerule);
											});

											callback(null, tracerules);
										});
									}
								});
			
							}
						});
					  }
					  });
					 }
					 });//end Startelements
					}
				}); //end elements

			
		});
	});
}

Tracerule.deleteInsertActAfterPre = function deleteInsertActAfterPre(user,id,operation_name,positions,callback){
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
			
				query1={"user":user,"_id":ObjectID(id)};

			var operationName="operations."+operation_name;
			var operations={};
					operations[operationName] = operation_name;
			collection.update(query1,{"$unset":operations},function(err){
					if(err) console.warn(err.message);
					else console.log("delete decision success");
				});


			query2={$set:{"positions":positions}};
			collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("delete Decision success");
				});
			collection.find({"user":user,"_id":ObjectID(id),"operations":operation_name}).sort({_id: 1}).toArray(function(err, docs) {
				console.log("OK");
				docs.forEach(function(doc, index) {
					console.log(doc.name);
				});
			});

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}

Tracerule.deleteInsertActBeforePost = function deleteInsertActBeforePost(user,id,operation_name,positions,callback){
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
			
				query1={"user":user,"_id":ObjectID(id)};

			var operationName="operations."+operation_name;
			var operations={};
					operations[operationName] = operation_name;
			collection.update(query1,{"$unset":operations},function(err){
					if(err) console.warn(err.message);
					else console.log("delete decision success");
				});


			query2={$set:{"positions":positions}};
			collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("delete Decision success");
				});
			collection.find({"user":user,"_id":ObjectID(id),"operations":operation_name}).sort({_id: 1}).toArray(function(err, docs) {
				console.log("OK");
				docs.forEach(function(doc, index) {
					console.log(doc.name);
				});
			});

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}

Tracerule.deleteInsertActAfterDecCon = function deleteInsertActAfterDecCon(user,id,operation_name,positions,callback){
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
			
				query1={"user":user,"_id":ObjectID(id)};

			var operationName="operations."+operation_name;
			var operations={};
					operations[operationName] = operation_name;
			collection.update(query1,{"$unset":operations},function(err){
					if(err) console.warn(err.message);
					else console.log("delete decision success");
				});


			query2={$set:{"positions":positions}};
			collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("delete Decision success");
				});
			collection.find({"user":user,"_id":ObjectID(id),"operations":operation_name}).sort({_id: 1}).toArray(function(err, docs) {
				console.log("OK");
				docs.forEach(function(doc, index) {
					console.log(doc.name);
				});
			});

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}

Tracerule.deleteInsertActBeforeActCon = function deleteInsertActBeforeActCon(user,id,operation_name,positions,callback){
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
			
				query1={"user":user,"_id":ObjectID(id)};

			var operationName="operations."+operation_name;
			var operations={};
					operations[operationName] = operation_name;
			collection.update(query1,{"$unset":operations},function(err){
					if(err) console.warn(err.message);
					else console.log("delete decision success");
				});


			query2={$set:{"positions":positions}};
			collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("delete Decision success");
				});
			collection.find({"user":user,"_id":ObjectID(id),"operations":operation_name}).sort({_id: 1}).toArray(function(err, docs) {
				console.log("OK");
				docs.forEach(function(doc, index) {
					console.log(doc.name);
				});
			});

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}


Tracerule.deleteInsertDecAfterAct = function deleteInsertDecAfterAct(user,id,operation_name,positions,callback){
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
			
				query1={"user":user,"_id":ObjectID(id)};

			var operationName="operations."+operation_name;
			var operations={};
					operations[operationName] = operation_name;
			collection.update(query1,{"$unset":operations},function(err){
					if(err) console.warn(err.message);
					else console.log("delete decision success");
				});


			query2={$set:{"positions":positions}};
			collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("delete Decision success");
				});
			collection.find({"user":user,"_id":ObjectID(id),"operations":operation_name}).sort({_id: 1}).toArray(function(err, docs) {
				console.log("OK");
				docs.forEach(function(doc, index) {
					console.log(doc.name);
				});
			});

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}

Tracerule.deleteInsertDecAfterDecCon = function deleteInsertDecAfterDecCon(user,id,operation_name,positions,callback){
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
			
				query1={"user":user,"_id":ObjectID(id)};

			var operationName="operations."+operation_name;
			var operations={};
					operations[operationName] = operation_name;
			collection.update(query1,{"$unset":operations},function(err){
					if(err) console.warn(err.message);
					else console.log("delete decision success");
				});


			query2={$set:{"positions":positions}};
			collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("delete Decision success");
				});
			collection.find({"user":user,"_id":ObjectID(id),"operations":operation_name}).sort({_id: 1}).toArray(function(err, docs) {
				console.log("OK");
				docs.forEach(function(doc, index) {
					console.log(doc.name);
				});
			});

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}

Tracerule.deleteInsertDecBeforeAct = function deleteInsertDecBeforeAct(user,id,operation_name,positions,callback){
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
			
				query1={"user":user,"_id":ObjectID(id)};

			var operationName="operations."+operation_name;
			var operations={};
					operations[operationName] = operation_name;
			collection.update(query1,{"$unset":operations},function(err){
					if(err) console.warn(err.message);
					else console.log("delete decision success");
				});


			query2={$set:{"positions":positions}};
			collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("delete Decision success");
				});
			collection.find({"user":user,"_id":ObjectID(id),"operations":operation_name}).sort({_id: 1}).toArray(function(err, docs) {
				console.log("OK");
				docs.forEach(function(doc, index) {
					console.log(doc.name);
				});
			});

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}


Tracerule.deleteInsertDecBeforeActWith = function deleteInsertDecBeforeActWith(user,id,operation_name,positions,callback){
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
			
				query1={"user":user,"_id":ObjectID(id)};

			var operationName="operations."+operation_name;
			var operations={};
					operations[operationName] = operation_name;
			collection.update(query1,{"$unset":operations},function(err){
					if(err) console.warn(err.message);
					else console.log("delete decision success");
				});


			query2={$set:{"positions":positions}};
			collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("delete Decision success");
				});
			collection.find({"user":user,"_id":ObjectID(id),"operations":operation_name}).sort({_id: 1}).toArray(function(err, docs) {
				console.log("OK");
				docs.forEach(function(doc, index) {
					console.log(doc.name);
				});
			});

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}


Tracerule.deleteInsertDecBeforeActCon = function deleteInsertDecBeforeActCon(user,id,operation_name,positions,callback){
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
			
				query1={"user":user,"_id":ObjectID(id)};

			var operationName="operations."+operation_name;
			var operations={};
					operations[operationName] = operation_name;
			collection.update(query1,{"$unset":operations},function(err){
					if(err) console.warn(err.message);
					else console.log("delete decision success");
				});


			query2={$set:{"positions":positions}};
			collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else console.log("delete Decision success");
				});
			collection.find({"user":user,"_id":ObjectID(id),"operations":operation_name}).sort({_id: 1}).toArray(function(err, docs) {
				console.log("OK");
				docs.forEach(function(doc, index) {
					console.log(doc.name);
				});
			});

			var query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}

Tracerule.editUseCase = function editUseCase(user,id,nameMark,oldname,newname,descriptionMark,oldusecasedescription,usecasedescription,positions,hidden_field,projectID,callback)
{
	var Oldname=hidden_field+".element."+oldname;
	var Newname=hidden_field+".element."+newname;
	var oldnames=oldname;
	var newnames=newname;
	var refer_num;
	mongodb.open(function(err, db) {
		if (err) {
			console.log("#11");
			return callback(err);
		}
	
		db.collection('tracerule', function(err, collection) {
			if (err) {
				console.log("#22");
				mongodb.close();
				return callback(err);
			}
			//查找user属性为username的文档，如果username为null则匹配全部

			var query = {};
			var ObjectID = require("mongodb").ObjectID;
			if (user) {
				
				query={"user":user,"projectID":projectID};
			}
			collection.find(query).toArray(function(err, docs) {

				if (err) {
					callback(err, null);
				}

			
				
				  docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
				    var ObjectID = require("mongodb").ObjectID;
				    console.log("doc._id:"+doc._id+" id:"+id);
					if(doc._id==id)
				    {
						query2={$set:{"positions":positions}};
							collection.update({"user":user,"_id":ObjectID(id)},query2,function(err){
							  if(err){ console.warn(err.message);}
							  else { console.log("here!");
								
							  }
							  console.log("#444");
							  for(key in doc.elements)
								{
							
									if(doc.elements[key].name==oldnames)
									{
							
										var elementName="elements."+doc.elements[key].name;
										var element={};
			     						element[elementName]=doc.elements[key].name;
			     						var ObjectID = require("mongodb").ObjectID;
			     			
										collection.update({"user":doc.user,"_id":doc._id},{"$unset":element},function(err){
											console.log("usecasedescription!!!:"+usecasedescription);
											elementName="elements."+newnames+".name";
											elementDescription="elements."+newnames+".description";
											elementType="elements."+newnames+".type";
											elementTime="elements."+newnames+".time";
											element={};
			     							element[elementName]=newnames;
			     							element[elementDescription]=usecasedescription;
			     							element[elementType]="usecase";
			     							element[elementTime]=new Date();
											collection.update({"user":doc.user,"_id":doc._id},{"$set":element},function(err){
							
											});
										});
					  				}
								}
								});

					
				}else{
					//bug 4

					var newpositions=doc.positions.replace(new RegExp(oldname,"gm"),newname);
						collection.update({"user":user,"_id":doc._id},{"$set":{"positions":newpositions}},function(err){
							if(err) console.warn(err.message);
							else console.log("yes");
						});
				}
				
					for(key in doc.operations)
					{
						//console.log("operations.key:"+key);
						var spl=doc.operations[key].name.split(" ");
						var newkey="";
						for(keys in spl)
						{
							if(newkey!="")
								newkey=newkey+" ";
							if(spl[keys]==oldnames)
								newkey=newkey+newnames;
							else
								newkey=newkey+spl[keys];
						}
							
							var newOpe;
							
							if(newkey!==doc.operations[key].name){
								
								newOpe={};
								for(sub in doc.operations[key]){
									var string="operations."+newkey+"."+sub;
									if(doc.operations[key][sub]==doc.operations[key].name)
									{
										newOpe[string]=newkey;
									}
									else{
										if(doc.operations[key][sub]==Oldname)
										{
											newOpe[string]=Newname;
										}
										else{
											newOpe[string]=doc.operations[key][sub];
										}
									}

								}
								
								var ObjectID = require("mongodb").ObjectID;
								collection.update({"user":doc.user,"_id":doc._id},{"$set":newOpe},function(err){
									var oldOpe={};
									var oldstring="operations."+doc.operations[key].name;
									oldOpe[oldstring]=doc.operations[key].name;
									
									collection.update({"user":doc.user,"_id":doc._id},{"$unset":oldOpe},function(err){
									})
								});
							}
					}
				
				});
				
				
			});
				
			query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
			
		});
		
		
		
	});
}

Tracerule.editActivity = function editActivity(user,id,nameMark,oldname,newname,descriptionMark,oldactivitydescription,activitydescription,executorMark,oldactivityexecutor,activityexecutor,positions,hidden_field,projectID,callback)
{

	var Oldname=hidden_field+".element."+oldname;
	var Newname=hidden_field+".element."+newname;
	var oldnames=oldname;
	var newnames=newname;
	var refer_num;
	console.log("hallo");
	mongodb.open(function(err, db) {
		if (err) {
			
			return callback(err);
		}
	    console.log("edit1");
		db.collection('tracerule', function(err, collection) {
			if (err) {
				
				mongodb.close();
				return callback(err);
			}

			//查找user属性为username的文档，如果username为null则匹配全部
			console.log("edit2");
			var query = {};
			var ObjectID = require("mongodb").ObjectID;
			console.log(projectID);
			query={"user":user};

			collection.find(query).toArray(function(err, docs) {
				 console.log("edit3");
				  if (err) {
					
					callback(err, null);
				  }

				  docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
				    var ObjectID = require("mongodb").ObjectID;
				    
					if(doc._id==id)
					{   console.log("doc.name:"+doc.name);
						console.log("edit4");
						query2={$set:{"positions":positions}};
						console.log("positions: "+positions);
						collection.update({"user":user,"_id":ObjectID(id)},query2,function(err){
							console.log("edit the elements");
							if(err) console.warn(err.message);
							else 
							{
								console.log("yes!!!");

								for(key in doc.elements)
								{
									console.log("this! name: "+doc.elements[key].name+" "+"oldnames: "+oldnames);
									if(doc.elements[key].name==oldnames)
									{
							
										var elementName="elements."+doc.elements[key].name;
										var element={};
			     						element[elementName]=doc.elements[key].name;
			     						var ObjectID = require("mongodb").ObjectID;
			     						console.log("element edit: "+newnames+" "+oldnames);
										collection.update({"user":doc.user,"_id":doc._id},{"$unset":element},function(err){
							
										});

											elementName="elements."+newnames+".name";
											elementDescription="elements."+newnames+".description";
											elementExecutor="elements."+newnames+".executor";
											elementType="elements."+newnames+".type";
											elementTime="elements."+newnames+".time";
											element={};
			     							element[elementName]=newnames;
			     							element[elementDescription]=activitydescription;
			     							element[elementExecutor]=activityexecutor;
			     							element[elementType]="activity";
			     							element[elementTime]=new Date();
											collection.update({"user":doc.user,"_id":doc._id},{"$set":element},function(err){
							
											});
					  				}
								}
							}
						});

					}else{
					//bug 4

						var newpositions=doc.positions.replace(new RegExp(oldname,"gm"),newname);

						collection.update({"user":user,"_id":doc._id},{"$set":{"positions":newpositions}},function(err){
							if(err) console.warn(err.message);
							else console.log("yes");
						});
					}
				
					for(key in doc.operations)
					{
						//console.log("operations.key:"+key);
						var spl=doc.operations[key].name.split(" ");
						var newkey="";
						for(keys in spl)
						{
							if(newkey!="")
								newkey=newkey+" ";
							if(spl[keys]==oldnames)
								newkey=newkey+newnames;
							else
								newkey=newkey+spl[keys];
						}
							
							var newOpe;
							
							if(newkey!==doc.operations[key].name){
								
								newOpe={};
								for(sub in doc.operations[key]){
									var string="operations."+newkey+"."+sub;
									if(doc.operations[key][sub]==doc.operations[key].name)
									{
										newOpe[string]=newkey;
									}
									else{
										if(doc.operations[key][sub]==Oldname)
										{
											newOpe[string]=Newname;
										}
										else{
											newOpe[string]=doc.operations[key][sub];
										}
									}

								}
								
								var ObjectID = require("mongodb").ObjectID;
								collection.update({"user":doc.user,"_id":doc._id},{"$set":newOpe},function(err){
								
								});
									var oldOpe={};
									var oldstring="operations."+doc.operations[key].name;
									oldOpe[oldstring]=doc.operations[key].name;
									
									collection.update({"user":doc.user,"_id":doc._id},{"$unset":oldOpe},function(err){
									})
							}
					}
				
				 });
				
				
			});
				
			query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
			
		});
		
		
		
	});
}

Tracerule.editDecision = function editDecision(user,id,nameMark,oldname,newname,descriptionMark,olddecisiondescription,decisiondescription,executorMark,olddecisionexecutor,decisionexecutor,positions,hidden_field,callback)
{
	var Oldname=hidden_field+".element."+oldname;
	var Newname=hidden_field+".element."+newname;
	var oldnames=oldname;
	var newnames=newname;
	var refer_num;
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

			var query = {};
			var ObjectID = require("mongodb").ObjectID;
			if (user) {
				
				query={"user":user};
			}
			collection.find(query).toArray(function(err, docs) {

				if (err) {
					
					callback(err, null);
				}

			
				
				  docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc._id);
				    var ObjectID = require("mongodb").ObjectID;
				  
					if(doc._id==id)
				{
						query2={$set:{"positions":positions}};
							collection.update({"user":user,"_id":ObjectID(id)},query2,function(err){
							if(err) console.warn(err.message);
							else {
								for(key in doc.elements)
							{
						
								if(doc.elements[key].name==oldnames)
								{
							
							
							
							var elementName="elements."+doc.elements[key].name;
							var element={};
			     			element[elementName]=doc.elements[key].name;
			     			var ObjectID = require("mongodb").ObjectID;
			     			
							collection.update({"user":doc.user,"_id":doc._id},{"$unset":element},function(err){
									elementName="elements."+newnames+".name";
									elementDescription="elements."+newnames+".description";
									elementExecutor="elements."+newnames+".executor";
									elementType="elements."+newnames+".type";
									elementTime="elements."+newnames+".time";
									element={};
			     					element[elementName]=newnames;
			     					element[elementDescription]=decisiondescription;
			     					element[elementExecutor]=decisionexecutor;
			     					element[elementType]="decision";
			     					element[elementTime]=new Date();
									collection.update({"user":doc.user,"_id":doc._id},{"$set":element},function(err){
							
									});
							});
									
					  			}
							}

							}
						});

				}else{
					//bug 4

					var newpositions=doc.positions.replace(new RegExp(oldname,"gm"),newname);
					
						collection.update({"user":user,"_id":doc._id},{"$set":{"positions":newpositions}},function(err){
							if(err) console.warn(err.message);
							else console.log("yes");
						});
				}
				
					for(key in doc.operations)
					{
						//console.log("operations.key:"+key);
						var spl=doc.operations[key].name.split(" ");
						var newkey="";
						for(keys in spl)
						{
							if(newkey!="")
								newkey=newkey+" ";
							if(spl[keys]==oldnames)
								newkey=newkey+newnames;
							else
								newkey=newkey+spl[keys];
						}
							
							var newOpe;
							
							if(newkey!==doc.operations[key].name){
								
								newOpe={};
								for(sub in doc.operations[key]){
									var string="operations."+newkey+"."+sub;
									if(doc.operations[key][sub]==doc.operations[key].name)
									{
										newOpe[string]=newkey;
									}
									else{
										if(doc.operations[key][sub]==Oldname)
										{
											newOpe[string]=Newname;
										}
										else{
											newOpe[string]=doc.operations[key][sub];
										}
									}

								}
								
								var ObjectID = require("mongodb").ObjectID;
								collection.update({"user":doc.user,"_id":doc._id},{"$set":newOpe},function(err){
									var oldOpe={};
									var oldstring="operations."+doc.operations[key].name;
									oldOpe[oldstring]=doc.operations[key].name;
									
									collection.update({"user":doc.user,"_id":doc._id},{"$unset":oldOpe},function(err){
									})
								});
									
							}
					}
				
				});
				
				
			});
				
			query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id)};
			}
			else{
				query={"user":user};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
			
		});
		
		
		
	});
}

Tracerule.editCondition = function editCondition(user,id,projectID,nameMark,oldname,newname,descriptionMark,oldconditiondescription,conditiondescription,positions,hidden_field,callback)
{
	var Oldname=hidden_field+".element."+oldname;
	var Newname=hidden_field+".element."+newname;
	var oldnames=oldname;
	var newnames=newname;
	var refer_num;
	console.log("editCondition:");
	console.log("id:"+id+" nameMark:"+nameMark+" oldname:"+oldnames+" newname:"+newnames+" descriptionMark:"+descriptionMark+" oldconditiondescription:"+oldconditiondescription+" conditiondescription:"+conditiondescription+" projectID:"+projectID);
	mongodb.open(function(err, db) {
		if (err) {
			console.log("#11");
			return callback(err);
		}
	
		db.collection('tracerule', function(err, collection) {
			if (err) {
				console.log("#22");
				mongodb.close();
				return callback(err);
			}

			//查找user属性为username的文档，如果username为null则匹配全部

			var query = {};
			var ObjectID = require("mongodb").ObjectID;
			if (user) {
				query={"user":user,"projectID":projectID};
			}
			collection.find(query).toArray(function(err, docs) {

				if (err) {
					console.log("#33");
					callback(err, null);
				}
	
				  docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
				    var ObjectID = require("mongodb").ObjectID;
				  
					if(doc._id==id)
					{   
						query2={$set:{"positions":positions}};
							var newpositions=doc.positions.replace(new RegExp(oldname,"gm"),newname);
						
							collection.update({"user":user,"_id":ObjectID(id)},{"$set":{"positions":newpositions}},function(err){
								
								if(err) {
									console.log("here!!!!");
									console.warn(err.message);}
								else{  console.log("hello");
									for(key in doc.elements)
					  				{
										
										if(doc.elements[key].name==oldnames)
										{
							
											var elementName="elements."+doc.elements[key].name;
											var element={};
			     							element[elementName]=doc.elements[key].name;
			     							var ObjectID = require("mongodb").ObjectID;
			     							console.log("conditiondescription:::"+conditiondescription);
											collection.update({"user":doc.user,"_id":doc._id},{"$unset":element});
											elementName="elements."+newnames+".name";
											elementDescription="elements."+newnames+".description";
											elementType="elements."+newnames+".type";
											elementTime="elements."+newnames+".time";
											element={};
			     							element[elementName]=newnames;
			     							element[elementDescription]=conditiondescription;
			     							element[elementType]="condition";
			     							element[elementTime]=new Date();
											collection.update({"user":doc.user,"_id":doc._id},{"$set":element});
					   					}
					  				}
								 }
							});

					  
					}else{
					//bug 4
					console.log("doc._id!=id");
					   if(nameMark){
							var newpositions=doc.positions.replace(new RegExp(oldname,"gm"),newname);
							collection.update({"user":user,"_id":doc._id},{"$set":{"positions":newpositions}},function(err){
								if(err) console.warn(err.message);
								else console.log("yes");
							});
						}
					}
				
					for(key in doc.operations)
					{
						//console.log("operations.key:"+key);
						var spl=doc.operations[key].name.split(" ");
						var newkey="";
						for(keys in spl)
						{
							if(newkey!="")
								newkey=newkey+" ";
							if(spl[keys]==oldnames)
								newkey=newkey+newnames;
							else
								newkey=newkey+spl[keys];
						}
							
							var newOpe;
							
							if(newkey!==doc.operations[key].name){
								
								newOpe={};
								for(sub in doc.operations[key]){
									var string="operations."+newkey+"."+sub;
									if(doc.operations[key][sub]==doc.operations[key].name)
									{
										newOpe[string]=newkey;
									}
									else{
										if(doc.operations[key][sub]==Oldname)
										{
											newOpe[string]=Newname;
										}
										else{
											newOpe[string]=doc.operations[key][sub];
										}
									}

								}
								
								var ObjectID = require("mongodb").ObjectID;
								collection.update({"user":doc.user,"_id":doc._id},{"$set":newOpe});
									var oldOpe={};
									var oldstring="operations."+doc.operations[key].name;
									oldOpe[oldstring]=doc.operations[key].name;
									
									collection.update({"user":doc.user,"_id":doc._id},{"$unset":oldOpe});
							}
					}
				
				});
				
				
			});
			console.log("what??");
			query = {};
			if (id) {
				
				query={"user":user,"_id":ObjectID(id),"projectID":projectID};
			}
			else{
				query={"user":user,"projectID":projectID};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc.projectID,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
			
		});
		
		
		
	});
}

Tracerule.savePositions=function savePositions(user,id,positions,callback){
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
			
				query1={"user":user,"_id":ObjectID(id)};


			query2={$set:{"positions":positions}};
			collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else {mongodb.close();console.log("Update positions success");callback(err);}
				});

		});

	});
}

Tracerule.editTraceRuleGuardSelfname=function editTraceRuleGuardSelfname(user,id,guardname,selfname,positions,callback){
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
			
				query1={"user":user,"_id":ObjectID(id)};


			query2={$set:{"name":guardname,"selfname":selfname,"positions":positions}};
			collection.update(query1,query2,function(err){
					if(err) console.warn(err.message);
					else {
						collection.find(query1).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var tracerules = [];
				
				docs.forEach(function(doc, index) {
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});}
				});


		});

	});
}
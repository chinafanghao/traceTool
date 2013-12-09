var mongodb = require('./db');

function Tracerule(username,name,selfname,time,operations,elements,positions,_id) { //post means refinements list
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
		positions:this.positions
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
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
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

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
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
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
};

Tracerule.createActivity = function createActivity(user,id,activityname,activitydescription,activityexecutor,activityvirtual,current_accordion,positions,callback){
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
				var elementIsVirtual="elements."+activityname+".is_virtual";
				var elements={};
					
					elements[elementName]=activityname;
					elements[elementDescription]=activitydescription;
					elements[elementType]="activity";
					elements[elementExecutor]=activityexecutor;
					elements[elementTime]=new Date();
					elements[elementIsVirtual]=activityvirtual;
			
				query2={
					"$set":
							operations
							//infor.dir:activityname,
							//elements:elements[activityname]
						
					};
				collection.update(query1,query2,{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("createActivity success");
				});
				query2={"$set":elements}
				collection.update(query1,query2,{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("createActivity success");
				});

				query2={$set:{"positions":positions}};
				collection.update(query1,query2,{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("createActivity success");
				});
			//query1={"user":user,"_id":ObjectID(id)};
			
				
			//query1={"user":user,"_id":ObjectID(id),"name":name};
			//query2={$set:{"selfname":selfname}};
			
			//collection.update(query1,query2);

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
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}

Tracerule.EditActivity = function EditActivity(user,operationname,activityname,activitydescription,activityexecutor,activityvirtual,positions,id,callback){
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
				var elementIsVirtual="elements."+activityname+".is_virtual";
				var elements={};
					
					elements[elementName]=activityname;
					elements[elementDescription]=activitydescription;
					elements[elementType]="activity";
					elements[elementExecutor]=activityexecutor;
					elements[elementTime]=new Date();
					elements[elementIsVirtual]=activityvirtual;
			
				query2={
					"$set":
							operations
							//infor.dir:activityname,
							//elements:elements[activityname]
						
					};
				collection.update(query1,query2,{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("createActivity success");
				});
				query2={"$set":elements}
				collection.update(query1,query2,{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("createActivity success");
				});
				
				query2={$set:{"positions":positions}};
				collection.update(query1,query2,{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("createActivity success");
				});
			//query1={"user":user,"_id":ObjectID(id)};
			
				
			//query1={"user":user,"_id":ObjectID(id),"name":name};
			//query2={$set:{"selfname":selfname}};
			
			//collection.update(query1,query2);

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
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}


Tracerule.createUseCase = function createUseCase(user,id,usecasename,usecasedescription,positions,callback){
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
					
			
				query2={
					"$set":
							operations
							//infor.dir:activityname,
							//elements:elements[activityname]
						
					};
				collection.update(query1,query2,{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("createUseCase success");
				});
				query2={"$set":elements}
				collection.update(query1,query2,{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("createUseCase success");
				});

				query2={$set:{"positions":positions}};
				collection.update(query1,query2,{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("createUseCase success");
				});

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
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
		});
	});
}

Tracerule.createDecision = function createActivity(user,id,decisionname,decisiondescription,decisionexecutor,positions,callback){
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
				console.log(query1);
				var keyValue="Create Decision "+decisionname;
				console.log(keyValue);
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
				collection.update(query1,query2,{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("create Decision success");
				});
				query2={"$set":elements}
				collection.update(query1,query2,{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("create Decision success");
				});

				query2={$set:{"positions":positions}};
				collection.update(query1,query2,{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("create Decision success");
				});
			//query1={"user":user,"_id":ObjectID(id)};
			
				
			//query1={"user":user,"_id":ObjectID(id),"name":name};
			//query2={$set:{"selfname":selfname}};
			
			//collection.update(query1,query2);

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
					var tracerule = new Tracerule(doc.user, doc.name,doc.selfname,doc.time,doc.operations,doc.elements,doc.positions,doc._id);
					tracerules.push(tracerule);
				});

				callback(null, tracerules);
			});
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
					"$set":
							operations
							//infor.dir:activityname,
							//elements:elements[activityname]
						
					};
				collection.update(query1,query2,{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("createCondition success");
				});
				query2={"$set":elements}
				collection.update(query1,query2,{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("createCondition success");
				});

				query2={$set:{"positions":positions}};
				collection.update(query1,query2,{safe:true},function(err){
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

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
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

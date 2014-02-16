var mongodb = require('./db');

function ElementDepency(username, element,dependee,depender,type,_id) { //post means refinements list
	this.user = username;
	this.element = element;
	this.dependee=dependee;
	this.depender=depender;
	this.type=type;
	this._id=_id;
};
module.exports = ElementDepency;

ElementDepency.prototype.save = function save(callback) {
	// 存入 Mongodb 的文檔
	var elementdepency = {
		user: this.user,
		element:this.element,
		dependee:this.dependee,
		depender:this.depender,
		type:this.type
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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);

				});

				callback(null, elementdepencys);
			});
		});
	});
};

ElementDepency.saveDependee = function saveDependee(user,elementname,dependee,type,callback){
	// 存入 Mongodb 的文檔
	var elementdepency = {
				user: user,
				element:elementname,
				dependee:dependee,
				depender:[],
				type:type
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
			
			collection.insert(elementdepency, {safe: true},function(err){
					if(err) console.warn(err.message);
					else console.log("insert element between success");
				});

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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};

ElementDepency.saveInsertBetween = function saveInsertBetween(user,TarAct,PreAct,PostAct,UseCase,current_guard_id,callback){
		
		mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		 db.collection('elementdepency', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
		
			var traceruleID1=TarAct.split('_');
			var traceruleID2=PreAct.split('_');
			var traceruleID3=PostAct.split('_');
			var traceruleID4=UseCase.split('_');
			console.log(traceruleID1[1]+"^"+traceruleID2[1]+"^"+traceruleID3[1]+"^"+traceruleID4[1]);
			var query1={"user":user,"element":traceruleID1[1]};
			var query2={};
			if(traceruleID2[0]!=traceruleID1[0])
			{
			 	collection.update(query1,{$push:{"depender":PreAct}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update Pre Act");
				});
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":PostAct}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update Post Act");
				});
			}

			if(traceruleID4[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":UseCase}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update use case");
				});
			}

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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
	});
	}

ElementDepency.saveInsertActAfterPre = function saveInsertActAfterPre(user,TarAct,PreAct,UseCase,current_guard_id,callback){
		
		mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		 db.collection('elementdepency', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
		
			var traceruleID1=TarAct.split('_');
			var traceruleID2=PreAct.split('_');
			var traceruleID3=UseCase.split('_');
			
			var query1={"user":user,"element":traceruleID1[1]};
			var query2={};
			if(traceruleID2[0]!=traceruleID1[0])
			{
			 	collection.update(query1,{$push:{"depender":PreAct}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update Pre Act");
				});
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":UseCase}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update use case");
				});
			}

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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
	});
	}

ElementDepency.saveInsertActBeforePost = function saveInsertActBeforePost(user,TarAct,PostAct,UseCase,current_guard_id,callback){
		
		mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		 db.collection('elementdepency', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
		
			var traceruleID1=TarAct.split('_');
			var traceruleID2=PostAct.split('_');
			var traceruleID3=UseCase.split('_');
			
			var query1={"user":user,"element":traceruleID1[1]};
			var query2={};
			if(traceruleID2[0]!=traceruleID1[0])
			{
			 	collection.update(query1,{$push:{"depender":PostAct}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update Pre Act");
				});
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":UseCase}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update use case");
				});
			}

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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
	});
  }

  ElementDepency.saveInsertActAfterDecCon = function saveInsertActAfterDecCon(user,TarAct,Decision,Condition,UseCase,current_guard_id,callback){
		
		mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		 db.collection('elementdepency', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
		
			var traceruleID1=TarAct.split('_');
			var traceruleID2=Decision.split('_');
			var traceruleID3=Condition.split('_');
			var traceruleID4=UseCase.split('_');
			
			var query1={"user":user,"element":traceruleID1[1]};
			var query2={};
			if(traceruleID2[0]!=traceruleID1[0])
			{
			 	collection.update(query1,{$push:{"depender":Decision}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update decision");
				});
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":Condition}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update condition");
				});
			}

			if(traceruleID4[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":UseCase}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update use case");
				});
			}

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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
	});
  }

ElementDepency.saveInsertActBeforeActCon = function saveInsertActBeforeActCon(user,TarAct,PostAct,Condition,UseCase,current_guard_id,callback){
		
		mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		 db.collection('elementdepency', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
		
			var traceruleID1=TarAct.split('_');
			var traceruleID2=PostAct.split('_');
			var traceruleID3=Condition.split('_');
			var traceruleID4=UseCase.split('_');
			
			var query1={"user":user,"element":traceruleID1[1]};
			var query2={};
			if(traceruleID2[0]!=traceruleID1[0])
			{
			 	collection.update(query1,{$push:{"depender":PostAct}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update PostAct");
				});
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":Condition}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update condition");
				});
			}

			if(traceruleID4[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":UseCase}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update use case");
				});
			}

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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
	});
  }

ElementDepency.saveInsertDecAfterActCon = function saveInsertDecAfterActCon(user,TarDec,PreAct,MainBranchCon,SupBranchCon,InserAct,TargetAct,UseCase,current_guard_id,callback){
		
		mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		 db.collection('elementdepency', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
		
			var traceruleID1=TarDec.split('_');
			var traceruleID2=PreAct.split('_');
			var traceruleID3=MainBranchCon.split('_');
			var traceruleID4=SupBranchCon.split('_');
			var traceruleID5=InserAct.split('_');
			var traceruleID6=TargetAct.split('_');
			var traceruleID7=UseCase.split('_');
			
			var query1={"user":user,"element":traceruleID1[1]};
			var query2={};
			if(traceruleID2[0]!=traceruleID1[0])
			{
			 	collection.update(query1,{$push:{"depender":PreAct}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update PreAct");
				});
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":MainBranchCon}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update MainBranchCon");
				});
			}

			if(traceruleID4[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":SupBranchCon}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update SupBranchCon");
				});
			}

			if(InserAct!="" && traceruleID5[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":InserAct}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update InserAct");
				});
			}

			if(traceruleID6[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":TargetAct}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update TargetAct");
				});
			}

			if(traceruleID7[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":UseCase}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update use case");
				});
			}
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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
	});
  }

ElementDepency.saveInsertDecAfterDecCon = function saveInsertDecAfterActCon(user,TarDec,InserDec,InserCon,MainBranchCon,SupBranchCon,InserAct,TargetDec,UseCase,current_guard_id,callback){
		
		mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		 db.collection('elementdepency', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
		
			var traceruleID1=TarDec.split('_');
			var traceruleID2=InserDec.split('_');
			var traceruleID3=InserCon.split('_');
			var traceruleID4=MainBranchCon.split('_');
			var traceruleID5=SupBranchCon.split('_');
			var traceruleID6=InserAct.split('_');
			var traceruleID7=TargetDec.split('_');
			var traceruleID8=UseCase.split('_');
			
			var query1={"user":user,"element":traceruleID1[1]};
			var query2={};
			if(traceruleID2[0]!=traceruleID1[0])
			{
			 	collection.update(query1,{$push:{"depender":InserDec}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update InserDec");
				});
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
			 	collection.update(query1,{$push:{"depender":InserCon}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update InserCon");
				});
			}

			if(traceruleID4[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":MainBranchCon}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update MainBranchCon");
				});
			}

			if(traceruleID5[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":SupBranchCon}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update SupBranchCon");
				});
			}

			if(InserAct!="none_none" && traceruleID6[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":InserAct}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update InserAct");
				});
			}

			if(traceruleID7[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":TargetDec}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update TargetAct");
				});
			}

			if(traceruleID8[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":UseCase}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update use case");
				});
			}
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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
	});
  }

  ElementDepency.saveInsertDecBeforeAct = function saveInsertDecBeforeAct(user,TarDec,PostAct,Con1,Tar1,Con2,Tar2,UseCase,current_guard_id,callback){
		
		mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		 db.collection('elementdepency', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
		
			var traceruleID1=TarDec.split('_');
			var traceruleID2=PostAct.split('_');
			var traceruleID3=Con1.split('_');
			var traceruleID4=Tar1.split('_');
			var traceruleID5=Con2.split('_');
			var traceruleID6=Tar2.split('_');
			var traceruleID7=UseCase.split('_');
			
			var query1={"user":user,"element":traceruleID1[1]};
			var query2={};
			if(traceruleID2[0]!=traceruleID1[0])
			{
			 	collection.update(query1,{$push:{"depender":PostAct}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update PreAct");
				});
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":Con1}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update MainBranchCon");
				});
			}

			if(traceruleID4[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":Tar1}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update SupBranchCon");
				});
			}

			if(traceruleID5[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":Con2}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update InserAct");
				});
			}

			if(traceruleID6[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":Tar2}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update TargetAct");
				});
			}

			if(traceruleID7[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":UseCase}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update use case");
				});
			}
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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
	});
  }

  ElementDepency.saveInsertDecBeforeActWith = function saveInsertDecBeforeActWith(user,TarDec,PostAct,MainBranchCon,SupBranchCon,InserAct,TargetDec,UseCase,current_guard_id,callback){
		
		mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		 db.collection('elementdepency', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
		
			var traceruleID1=TarDec.split('_');
			var traceruleID2=PostAct.split('_');
			var traceruleID3=MainBranchCon.split('_');
			var traceruleID4=SupBranchCon.split('_');
			var traceruleID5=InserAct.split('_');
			var traceruleID6=TargetDec.split('_');
			var traceruleID7=UseCase.split('_');
			
			var query1={"user":user,"element":traceruleID1[1]};
			var query2={};
			if(traceruleID2[0]!=traceruleID1[0])
			{
			 	collection.update(query1,{$push:{"depender":PostAct}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update PostAct");
				});
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":MainBranchCon}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update MainBranchCon");
				});
			}

			if(traceruleID4[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":SupBranchCon}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update SupBranchCon");
				});
			}

			if(InserAct!="" && traceruleID5[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":InserAct}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update InserAct");
				});
			}

			if(traceruleID6[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":TargetDec}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update TargetDec");
				});
			}

			if(traceruleID7[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":UseCase}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update use case");
				});
			}
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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
	});
  }

ElementDepency.saveInsertDecBeforeActCon = function saveInsertDecBeforeActCon(user,TarDec,PostAct,InserCon,MainBranchCon,SupBranchCon,InserAct,TargetDec,UseCase,current_guard_id,callback){
		
		mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		 db.collection('elementdepency', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
		
			var traceruleID1=TarDec.split('_');
			var traceruleID2=PostAct.split('_');
			var traceruleID3=InserCon.split('_');
			var traceruleID4=MainBranchCon.split('_');
			var traceruleID5=SupBranchCon.split('_');
			var traceruleID6=InserAct.split('_');
			var traceruleID7=TargetDec.split('_');
			var traceruleID8=UseCase.split('_');
			
			var query1={"user":user,"element":traceruleID1[1]};
			var query2={};
			if(traceruleID2[0]!=traceruleID1[0])
			{
			 	collection.update(query1,{$push:{"depender":PostAct}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update InserDec");
				});
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
			 	collection.update(query1,{$push:{"depender":InserCon}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update InserCon");
				});
			}

			if(traceruleID4[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":MainBranchCon}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update MainBranchCon");
				});
			}

			if(traceruleID5[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":SupBranchCon}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update SupBranchCon");
				});
			}

			if(InserAct!="none_none" && traceruleID6[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":InserAct}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update InserAct");
				});
			}

			if(traceruleID7[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":TargetDec}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update TargetAct");
				});
			}

			if(traceruleID8[0]!=traceruleID1[0])
			{
				collection.update(query1,{$push:{"depender":UseCase}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update use case");
				});
			}
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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
	});
  }

ElementDepency.deleteActivityDependee = function deleteActivityDependee(user,id,operation_name,callback){
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
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			console.log(name[length]);
			collection.remove({'element':name[length]},function(err){
					if(err) console.warn(err.message);
					else console.log("delete element success");
				});

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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};

ElementDepency.deleteDecisionDependee = function deleteDecisionDependee(user,id,operation_name,callback){
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
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			console.log(name[length]);
			collection.remove({'element':name[length]},function(err){
					if(err) console.warn(err.message);
					else console.log("delete element success");
				});

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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};

ElementDepency.deleteConditionDependee = function deleteConditionDependee(user,id,operation_name,callback){
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
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			console.log(name[length]);
			collection.remove({'element':name[length]},function(err){
					if(err) console.warn(err.message);
					else console.log("delete element success");
				});

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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};

ElementDepency.deleteUseCaseDependee = function deleteUseCaseDependee(user,id,operation_name,callback){
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
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			console.log(name[length]);
			collection.remove({'element':name[length]},function(err){
					if(err) console.warn(err.message);
					else console.log("delete element success");
				});

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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};


ElementDepency.deleteInsertActAfterPre = function deleteInsertActAfterPre(user,id,operation_name,callback){
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
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			console.log(name[length]);

		    var name=operation_name.split(" ");
			
			var query1={"user":user,"element":name[1]};
			var query2={};
		
			 	collection.update(query1,{$pop:{"depender":new RegExp(name[3]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen Pre Act");
				});
			

				collection.update(query1,{$pop:{"depender":new RegExp(name[5]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});


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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};


ElementDepency.deleteInsertActBeforePost = function deleteInsertActBeforePost(user,id,operation_name,callback){
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
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			console.log(name[length]);

		    var name=operation_name.split(" ");
			
			var query1={"user":user,"element":name[1]};
			var query2={};
		
			 	collection.update(query1,{$pop:{"depender":new RegExp(name[3]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen Pre Act");
				});
			

				collection.update(query1,{$pop:{"depender":new RegExp(name[5]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});


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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};


ElementDepency.deleteInsertActAfterDecCon = function deleteInsertActAfterDecCon(user,id,operation_name,callback){
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
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			console.log(name[length]);

		    var name=operation_name.split(" ");
			
			var query1={"user":user,"element":name[1]};
			var query2={};
		
			 	collection.update(query1,{$pop:{"depender":new RegExp(name[3]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen Pre Act");
				});
			

				collection.update(query1,{$pop:{"depender":new RegExp(name[5]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});


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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};

ElementDepency.deleteInsertActBeforeActCon = function deleteInsertActBeforeActCon(user,id,operation_name,callback){
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
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			console.log(name[length]);

		    var name=operation_name.split(" ");
			
			var query1={"user":user,"element":name[1]};
			var query2={};
		
			 	collection.update(query1,{$pop:{"depender":new RegExp(name[3]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen Pre Act");
				});
			

				collection.update(query1,{$pop:{"depender":new RegExp(name[5]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});

				collection.update(query1,{$pop:{"depender":new RegExp(name[7]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});


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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};

ElementDepency.deleteInsertDecAfterAct = function deleteInsertDecAfterAct(user,id,operation_name,callback){
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
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			console.log(name[length]);

		    var name=operation_name.split(" ");
			
			var query1={"user":user,"element":name[1]};
			var query2={};
		
			 	collection.update(query1,{$pop:{"depender":new RegExp(name[3]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen Pre Act");
				});
			

				collection.update(query1,{$pop:{"depender":new RegExp(name[6]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});

				collection.update(query1,{$pop:{"depender":new RegExp(name[8]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});

				collection.update(query1,{$pop:{"depender":new RegExp(name[10]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});

				collection.update(query1,{$pop:{"depender":new RegExp(name[12]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});

				collection.update(query1,{$pop:{"depender":new RegExp(name[15]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});


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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};

ElementDepency.deleteInsertDecAfterDecCon = function deleteInsertDecAfterDecCon(user,id,operation_name,callback){
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
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			console.log(name[length]);

		    var name=operation_name.split(" ");
			
			var query1={"user":user,"element":name[1]};
			var query2={};
		
			 	collection.update(query1,{$pop:{"depender":new RegExp(name[4]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen Pre Act");
				});
			

				collection.update(query1,{$pop:{"depender":new RegExp(name[6]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});

				collection.update(query1,{$pop:{"depender":new RegExp(name[10]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});

				collection.update(query1,{$pop:{"depender":new RegExp(name[12]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});

				collection.update(query1,{$pop:{"depender":new RegExp(name[14]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});

				collection.update(query1,{$pop:{"depender":new RegExp(name[16]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});

				collection.update(query1,{$pop:{"depender":new RegExp(name[19]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});


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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};

ElementDepency.deleteInsertDecBeforeAct = function deleteInsertDecBeforeAct(user,id,operation_name,callback){
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
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			console.log(name[length]);

		    var name=operation_name.split(" ");
			
			var query1={"user":user,"element":name[1]};
			var query2={};
		
			 	collection.update(query1,{$pop:{"depender":new RegExp(name[3]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen Pre Act");
				});
			

				collection.update(query1,{$pop:{"depender":new RegExp(name[6]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});

				collection.update(query1,{$pop:{"depender":new RegExp(name[8]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});

				collection.update(query1,{$pop:{"depender":new RegExp(name[10]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});

				collection.update(query1,{$pop:{"depender":new RegExp(name[12]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});

				collection.update(query1,{$pop:{"depender":new RegExp(name[15]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});


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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};


ElementDepency.deleteInsertDecBeforeActWith = function deleteInsertDecBeforeActWith(user,id,operation_name,callback){
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
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			console.log(name[length]);

		    var name=operation_name.split(" ");
			
			var query1={"user":user,"element":name[1]};
			var query2={};
		
			 	collection.update(query1,{$pop:{"depender":new RegExp(name[3]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen Pre Act");
				});
			

				collection.update(query1,{$pop:{"depender":new RegExp(name[6]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});

				collection.update(query1,{$pop:{"depender":new RegExp(name[8]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});

				collection.update(query1,{$pop:{"depender":new RegExp(name[10]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});

				collection.update(query1,{$pop:{"depender":new RegExp(name[12]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});

				collection.update(query1,{$pop:{"depender":new RegExp(name[15]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});


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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};


ElementDepency.deleteInsertDecBeforeActCon = function deleteInsertDecBeforeActCon(user,id,operation_name,callback){
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
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			console.log(name[length]);

		    var name=operation_name.split(" ");
			
			var query1={"user":user,"element":name[1]};
			var query2={};
		
			 	collection.update(query1,{$pop:{"depender":new RegExp(name[4]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen Pre Act");
				});
			

				collection.update(query1,{$pop:{"depender":new RegExp(name[6]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});

				collection.update(query1,{$pop:{"depender":new RegExp(name[10]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});

				collection.update(query1,{$pop:{"depender":new RegExp(name[12]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});

				collection.update(query1,{$pop:{"depender":new RegExp(name[14]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});

				collection.update(query1,{$pop:{"depender":new RegExp(name[16]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});

				collection.update(query1,{$pop:{"depender":new RegExp(name[19]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen use case");
				});


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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};

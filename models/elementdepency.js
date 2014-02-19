var mongodb = require('./db');

function ElementDepency(username, element,dependee,depender,todepen,todepenNum,type,_id) { //post means refinements list
	this.user = username;
	this.element = element;
	this.dependee=dependee;
	this.depender=depender;
	this.todepen=todepen;
	this.todepenNum=todepenNum;
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
		todepen:this.todepen,
		todepenNum:this.todepenNum,
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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
					elementdepencys.push(elementdepency);

				});

				callback(null, elementdepencys);
			});
		});
	});
};

ElementDepency.getToDepenNum = function getToDepenNum(user, element,callback) {
	
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
				
				query={"user":user,"element":element};
			}
			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
					elementdepencys.push(elementdepency);

				});

				callback(null, elementdepencys);
			});
		});
	});
};

ElementDepency.replaceDependKeyName = function replaceDependKeyName(user,oldname,newname,callback) {
	
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
			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
					if(doc.element==oldname)
						doc.element=newname;
					for(key in doc.depender)
					{
						if(key==oldname)
						{
							var refer_num=doc.depender[key].refer_num;
							var dependerKey="depender."+key+".refer_num";
							var depender={};
			     			depender[dependerKey]=refer_num;
						collection.update({"user":doc.user,"element":doc.element},{"$unset":depender},function(err){
							
						});

						dependerKey="depender."+newname+".refer_num";
						depender={};
			     			depender[dependerKey]=refer_num;
						collection.update({"user":doc.user,"element":doc.element},{"$set":depender},function(err){
							
						});

						}
					}
					for(key in doc.todepen)
					{
						if(key==oldname)
						{
							var refer_num=doc.todepen[key].refer_num;

							var todepenKey="todepen."+key+".refer_num";
							var todepen={};
			     			todepen[todepenKey]=refer_num;
						collection.update({"user":doc.user,"element":doc.element},{"$unset":todepen},function(err){
							
						});

						
						todepenKey="todepen."+newname+".refer_num";
						todepen={};
			     			todepen[todepenKey]=refer_num;
						collection.update({"user":doc.user,"element":doc.element},{"$set":todepen},function(err){
							
						});
						

						}
					}
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
				depender:{},
				todepen:{},
				todepenNum:0,
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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};
/*
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
				var result=collection.findOne({'depender.name':PreAct});
				if(result){
			 	  collection.update({"depender.name":PreAct},{$inc:{"depender.$.refer_num":1}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update Pre Act");
				  });
			 	}
			    else{
			    	collection.update(query1,{$push:{"depender":{"name":PreAct,"refer_num":0}}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update Pre Act");
				  });

			    }
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
				var result=collection.findOne({'depender.name':PostAct});
				if(result){
			 	  collection.update({"depender.name":PostAct},{$inc:{"depender.$.refer_num":1}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update Pre Act");
				  });
			 	}
			    else{
			    	collection.update(query1,{$push:{"depender":{"name":PostAct,"refer_num":0}}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update Pre Act");
				  });

			    }
			}

			if(traceruleID4[0]!=traceruleID1[0])
			{
				var result=collection.findOne({'depender.name':UseCase});
				if(result){
			 	  collection.update({"depender.name":UseCase},{$inc:{"depender.$.refer_num":1}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update Pre Act");
				  });
			 	}
			    else{
			    	collection.update(query1,{$push:{"depender":{"name":UseCase,"refer_num":0}}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("update Pre Act");
				  });

			    }
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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
	});
	}
*/

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
				var dependerNum="depender."+PreAct+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){	
				});	

				dependerNum="todepen."+TarAct+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});	
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+UseCase+".refer_num";
				var dependerElement="depender."+UseCase+".name";
				var depender={};
			//	depender[dependerElement]=UseCase;
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarAct+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":depender},true,function(){	
				});
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":{"todepenNum":1}},true,function(){	
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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
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
				var dependerNum="depender."+PostAct+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarAct+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});	
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+UseCase+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarAct+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":{"todepenNum":1}},true,function(){	
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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
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
			 	var dependerNum="depender."+Decision+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarAct+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});	
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+Condition+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarAct+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});	
			}

			if(traceruleID4[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+UseCase+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarAct+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":{"todepenNum":1}},true,function(){	
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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
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
			 	var dependerNum="depender."+PostAct+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarAct+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});	
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+Condition+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarAct+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});	
			}

			if(traceruleID4[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+UseCase+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarAct+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":{"todepenNum":1}},true,function(){	
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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
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
			 	var dependerNum="depender."+PreAct+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+MainBranchCon+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(traceruleID4[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+SupBranchCon+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":depender},true,function(){	
				});
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(InserAct!="" && traceruleID5[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+InserAct+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":depender},true,function(){	
				});
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(traceruleID6[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+TargetDec+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarAct+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":depender},true,function(){	
				});
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(traceruleID7[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+UseCase+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":{"todepenNum":1}},true,function(){	
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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
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
			 	var dependerNum="depender."+InserDec+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
			 	var dependerNum="depender."+InserCon+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(traceruleID4[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+MainBranchCon+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":depender},true,function(){	
				});
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});	
			}

			if(traceruleID5[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+SupBranchCon+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(InserAct!="none_none" && traceruleID6[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+InserAct+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(traceruleID7[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+TargetDec+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(traceruleID8[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+UseCase+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID8[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID8[1]},{"$inc":{"todepenNum":1}},true,function(){	
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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
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
			 	var dependerNum="depender."+PostAct+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+Con1+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":depender},true,function(){	
				});
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});	
			}

			if(traceruleID4[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+Tar1+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(traceruleID5[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+Con2+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(traceruleID6[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+Tar2+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(traceruleID7[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+UseCase+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":{"todepenNum":1}},true,function(){	
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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
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
			 	var dependerNum="depender."+PostAct+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+MainBranchCon+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(traceruleID4[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+SupBranchCon+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(InserAct!="" && traceruleID5[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+InserAct+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":depender},true,function(){	
				});		
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(traceruleID6[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+TargetDec+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(traceruleID7[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+UseCase+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":{"todepenNum":1}},true,function(){	
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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
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
			 	var dependerNum="depender."+PostAct+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
			 	var dependerNum="depender."+InserCon+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(traceruleID4[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+MainBranchCon+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(traceruleID5[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+SupBranchCon+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(InserAct!="none_none" && traceruleID6[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+InserAct+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(traceruleID7[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+TargetDec+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":{"todepenNum":1}},true,function(){	
				});
			}

			if(traceruleID8[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+UseCase+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID8[1]},{"$inc":depender},true,function(){	
				});	
				collection.update({"user":user,"element":traceruleID8[1]},{"$inc":{"todepenNum":1}},true,function(){	
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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};

//I2
ElementDepency.deleteInsertActAfterPre = function deleteInsertActAfterPre(user,id,operation_name,hide_field,callback){
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
		
			 /*	collection.update(query1,{$pop:{"depender":new RegExp(name[3]+"$")}},{safe:true},function(err){
					if(err) console.warn(err.message);
					else console.log("delete depen Pre Act");
				});*/
	   		var field=hide_field.split("_");
	   		if(field[0]!==field[1]){
				var dependerNum="depender."+field[1]+"_"+name[3]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					collection.update({"user":user,"element":name[1],dependerNum:0},{"$unset":depender},function(err){
					if(err) console.warn(err.message);
					else console.log("delete decision success");
					})
				});	

				 dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[3]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[3]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[2]){
				var dependerNum="depender."+field[2]+"_"+name[5]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[5]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[5]},{"$inc":{"todepenNum":-1}},true,function(){

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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};

//I3
ElementDepency.deleteInsertActBeforePost = function deleteInsertActBeforePost(user,id,operation_name,hide_field,callback){
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

			var field=hide_field.split("_");
			if(field[0]!==field[1])
			{
				var dependerNum="depender."+field[1]+"_"+name[3]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){

				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[3]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[3]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[2]){
				var dependerNum="depender."+field[2]+"_"+name[5]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[5]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[5]},{"$inc":{"todepenNum":-1}},true,function(){

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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};

//I4
ElementDepency.deleteInsertActAfterDecCon = function deleteInsertActAfterDecCon(user,id,operation_name,hide_field,callback){
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

			var field=hide_field.split("_");

			if(field[0]!==field[3]){
				var dependerNum="depender."+field[1]+"_"+name[3]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
				
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[3]},{"$inc":depender},true,function(){

				});	
				collection.update({"user":user,"element":name[3]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[2]){
				var dependerNum="depender."+field[2]+"_"+name[5]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[5]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[5]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[3]){
				var dependerNum="depender."+field[3]+"_"+name[7]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[7]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[7]},{"$inc":{"todepenNum":-1}},true,function(){

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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};

//I5

ElementDepency.deleteInsertActBeforeActCon = function deleteInsertActBeforeActCon(user,id,operation_name,hide_field,callback){
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
		
			var field=hide_field.split("_");

			if(field[0]!==field[1]){
				var dependerNum="depender."+field[1]+"_"+name[3]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[3]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[3]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[2]){
				var dependerNum="depender."+field[2]+"_"+name[5]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[5]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[5]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[3]){
				var dependerNum="depender."+field[3]+"_"+name[7]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[7]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[7]},{"$inc":{"todepenNum":-1}},true,function(){

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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};

//I6

ElementDepency.deleteInsertDecAfterAct = function deleteInsertDecAfterAct(user,id,operation_name,hide_field,callback){
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
		/*
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
				*/
			var field=hide_field.split("_");

			if(field[0]!==field[1]){
				var dependerNum="depender."+field[1]+"_"+name[3]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
				
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[3]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[3]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[2]){
				var dependerNum="depender."+field[2]+"_"+name[6]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[6]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[6]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[3]){
				var dependerNum="depender."+field[3]+"_"+name[8]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[8]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[8]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}

			if(field[0]!==field[4]){
				var dependerNum="depender."+field[4]+"_"+name[10]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[10]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[10]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[5]){
				var dependerNum="depender."+field[5]+"_"+name[12]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[12]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[12]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[6]){
				var dependerNum="depender."+field[6]+"_"+name[15]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[15]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[15]},{"$inc":{"todepenNum":-1}},true,function(){

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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};

//I7

ElementDepency.deleteInsertDecAfterDecCon = function deleteInsertDecAfterDecCon(user,id,operation_name,hide_field,callback){
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
			

			var field=hide_field.split("_");

			if(field[0]!==field[1]){
				var dependerNum="depender."+field[1]+"_"+name[4]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[4]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[4]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[2]){
				var dependerNum="depender."+field[2]+"_"+name[6]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[6]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[6]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[3]){
				var dependerNum="depender."+field[3]+"_"+name[10]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[10]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[10]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}

			if(field[0]!==field[4]){
				var dependerNum="depender."+field[4]+"_"+name[12]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[12]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[12]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[5]){
				var dependerNum="depender."+field[5]+"_"+name[14]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[14]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[14]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[6]){
				var dependerNum="depender."+field[6]+"_"+name[16]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[16]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[16]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[7]){
				var dependerNum="depender."+field[7]+"_"+name[19]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[19]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[19]},{"$inc":{"todepenNum":-1}},true,function(){

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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};

//I8

ElementDepency.deleteInsertDecBeforeAct = function deleteInsertDecBeforeAct(user,id,operation_name,hide_field,callback){
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
		
			var field=hide_field.split("_");

			if(field[0]!==field[1]){
				var dependerNum="depender."+field[1]+"_"+name[3]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[3]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[3]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[2]){
				var dependerNum="depender."+field[2]+"_"+name[6]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[6]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[6]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[3]){
				var dependerNum="depender."+field[3]+"_"+name[8]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[8]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[8]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}

			if(field[0]!==field[4]){
				var dependerNum="depender."+field[4]+"_"+name[10]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[10]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[10]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[5]){
				var dependerNum="depender."+field[5]+"_"+name[12]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});
				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[12]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[12]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[6]){
				var dependerNum="depender."+field[6]+"_"+name[15]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[15]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[15]},{"$inc":{"todepenNum":-1}},true,function(){

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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};

//I9

ElementDepency.deleteInsertDecBeforeActWith = function deleteInsertDecBeforeActWith(user,id,operation_name,hide_field,callback){
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

			var field=hide_field.split("_");

			if(field[0]!==field[1]){
				var dependerNum="depender."+field[1]+"_"+name[3]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[3]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[3]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[2]){
				var dependerNum="depender."+field[2]+"_"+name[6]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[6]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[6]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[3]){
				var dependerNum="depender."+field[3]+"_"+name[8]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[8]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[8]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}

			if(field[0]!==field[4]){
				var dependerNum="depender."+field[4]+"_"+name[10]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[10]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[10]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[5]){
				var dependerNum="depender."+field[5]+"_"+name[12]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[12]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[12]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[6]){
				var dependerNum="depender."+field[6]+"_"+name[15]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[15]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[15]},{"$inc":{"todepenNum":-1}},true,function(){

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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};

//I10

ElementDepency.deleteInsertDecBeforeActCon = function deleteInsertDecBeforeActCon(user,id,operation_name,hide_field,callback){
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

			var field=hide_field.split("_");

			if(field[0]!==field[1]){
				var dependerNum="depender."+field[1]+"_"+name[4]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[4]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[4]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[2]){
				var dependerNum="depender."+field[2]+"_"+name[6]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[6]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[6]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[3]){
				var dependerNum="depender."+field[3]+"_"+name[10]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[10]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[10]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}

			if(field[0]!==field[4]){
				var dependerNum="depender."+field[4]+"_"+name[12]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[12]},{"$inc":depender},true,function(){

				});	
				collection.update({"user":user,"element":name[12]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[5]){
				var dependerNum="depender."+field[5]+"_"+name[14]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[14]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[14]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[6]){
				var dependerNum="depender."+field[6]+"_"+name[16]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[16]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[16]},{"$inc":{"todepenNum":-1}},true,function(){

				});
			}
			if(field[0]!==field[7]){
				var dependerNum="depender."+field[7]+"_"+name[19]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},true,function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[19]},{"$inc":depender},true,function(){

				});
				collection.update({"user":user,"element":name[19]},{"$inc":{"todepenNum":-1}},true,function(){

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
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
	});
};

ElementDepency.editUseCaseDependee = function editUseCaseDependee(user,elementname,oldelementname,dependee,type,callback){
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
			
			var query1={"user":user,"depender":oldelementname};
			




					var query = {};
		
			collection.ensureIndex('user');


		  });
		
	});
};

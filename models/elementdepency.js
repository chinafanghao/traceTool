var db = require('./db');
var mongodb = new db();
var async = require('async');  

function ElementDepency(username, element,dependee,depender,insidedepender,todepen,todepenNum,insidetodepen,type,projectID,_id) { //post means refinements list
	this.user = username;
	this.element = element;
	this.dependee=dependee;
	this.depender=depender;
	this.insidedepender=insidedepender;
	this.todepen=todepen;
	this.todepenNum=todepenNum;
	this.insidetodepen=insidetodepen;
	this.type=type;
	this.projectID=projectID;
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
		insidedepender:this.insidedepender,
		todepen:this.todepen,
		todepenNum:this.todepenNum,
		insidetodepen:this.insidetodepen,
		type:this.type,
		projectID:this.projectID
	};

	mongodb.getCollection('elementdepency',function(collection){
			collection.ensureIndex('user');
			
			collection.insert(elementdepency, {safe: true}, function(err, elementdepency) {
				//mongodb.close();
				callback(err, elementdepency);
			});
		});
	
};


ElementDepency.get = function get(user, projectID,callback) {
	//console.log(user+"#"+projectID);
	mongodb.getCollection('elementdepency',function(collection){

			//查找user属性为username的文档，如果username为null则匹配全部

			var query = {};
			if (user) {
				
				query={"user":user,"projectID":projectID};
			}
			collection.ensureIndex('user');

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc.projectID,doc._id);
					elementdepencys.push(elementdepency);
					//console.log("#####"+doc.element);
				});

				callback(null, elementdepencys);
			});
		});
};

ElementDepency.returnDeleteDependency = function returnDeleteDependency(username,deleteID, callback) {
	
	mongodb.getCollection('elementdepency',function(collection){

			//查找user属性为username的文档，如果username为null则匹配全部

			var query = {};
			if (username) {
				
				query={"user":username,"dependee":deleteID};
			}
			collection.ensureIndex('user');

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					if(doc.todepenNum>0){
					elementdepencys.push(elementdepency);}

				});

				callback(null, elementdepencys);
			});
		});
};

ElementDepency.removeTraceRule = function removeTraceRule(user,deleteID,callback){
	
	var refer_num;
	mongodb.getCollection('elementdepency',function(collection){
			var elementdepencys = [];
			//查找user属性为username的文档，如果username为null则匹配全部

			var query = {};
			if (user) {
				
				query={"user":user};
			}
			collection.find(query).toArray(function(err, docs) {

				if (err) {
					
					callback(err, null);
				}

				


				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					if(doc.dependee==deleteID){
							collection.remove({'dependee':deleteID},function(err){
								if(err) console.warn(err.message);
								else console.log("delete element success");
							});
					}else{
						for(key in doc.todepen)
						{
							var $path=new Array();
							$path=key.split("_");
							if($path[0]==deleteID)
							{	
							

								dependerNum="todepen."+key+".refer_num";
				 				depender={};
								depender[dependerNum]=-1;
								
								collection.update({"user":user,"element":doc.element},{"$inc":{"todepenNum":-1}},function(){
									collection.update({"user":user,"element":doc.element},{"$inc":depender},function(){

									}); 
								}); 	
					  		}
						}
					}
					/*
					if(doc.dependee==deleteID){
							collection.remove({'dependee':deleteID},function(err){
								if(err) console.warn(err.message);
								else console.log("delete element success");
							});
					}*/
					
				});
				
				
			});
			query={"user":user};
			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					elementdepencys.push(elementdepency);

				});
		
				callback(null, elementdepencys);
			});
			
		});
		
	
};



ElementDepency.getToDepenNum = function getToDepenNum(user,element,callback) {
	//console.log("user:"+user+" projectID:"+projectID+" element:"+element);
		mongodb.getCollection('elementdepency',function(collection){

			//查找user属性为username的文档，如果username为null则匹配全部
			
			var query = {};
			if (user) {
				
				query={"user":user,"element":element};
			}
			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					elementdepencys.push(elementdepency);

				});

				callback(null, elementdepencys);
			});
		});
};

ElementDepency.replaceDependKeyName = function replaceDependKeyName(user,oldname,newname,hide_field,callback) {
	
	var Oldnames=hide_field+"_"+oldname;
	var Newnames=hide_field+"_"+newname;

	var refer_num;
	mongodb.getCollection('elementdepency',function(collection){
	var elementdepencys = [];
		

			//查找user属性为username的文档，如果username为null则匹配全部

			var query = {};
			if (user) {
				
				query={"user":user};
			}
			collection.find(query).toArray(function(err, docs) {

				if (err) {
					//console.log("#3");
					callback(err, null);
				}

				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					
					for(key in doc.depender)
					{
						
						if(key==Oldnames)
						{
							
							var refer_num=doc.depender[key].refer_num;
							
							var dependerKey="depender."+key;
							var depender={};
			     			depender[dependerKey]=key;
							collection.update({"user":doc.user,"element":doc.element},{"$unset":depender},function(err){
								dependerKey="depender."+Newnames+".refer_num";
								depender={};
			     				depender[dependerKey]=refer_num;
								collection.update({"user":doc.user,"element":doc.element},{"$set":depender},function(err){
							
								});
						});

						

						}
					}
					for(key in doc.insidedepender)
					{
						
						if(key==Oldnames)
						{
							
							refer_num=doc.insidedepender[key].refer_num;
							
							var insidedependerKey="insidedepender."+key;
							var insidedepender={};
			     			insidedepender[insidedependerKey]=key;
							collection.update({"user":doc.user,"element":doc.element},{"$unset":insidedepender},function(err){
								insidedependerKey="insidedepender."+Newnames+".refer_num";
								insidedepender={};
			     				insidedepender[insidedependerKey]=refer_num;
								collection.update({"user":doc.user,"element":doc.element},{"$set":insidedepender},function(err){
							
								});
						});

						

						}
					}

					for(key in doc.todepen)
					{
						
						if(key==Oldnames)
						{	
						 	refer_num=doc.todepen[key].refer_num;

							var todepenKey="todepen."+key;
							var todepen={};
			     			todepen[todepenKey]=key;
						collection.update({"user":doc.user,"element":doc.element},{"$unset":todepen},function(err){
							todepenKey="todepen."+Newnames+".refer_num";
							todepen={};
			     			todepen[todepenKey]=refer_num;
							collection.update({"user":doc.user,"element":doc.element},{"$set":todepen},function(err){
							
							});
						});
					  }
					}
					for(key in doc.insidetodepen)
					{
						
						if(key==Oldnames)
						{	
						 	refer_num=doc.insidetodepen[key].refer_num;

							var insidetodepenKey="insidetodepen."+key;
							var insidetodepen={};
			     			insidetodepen[insidetodepenKey]=key;
						collection.update({"user":doc.user,"element":doc.element},{"$unset":insidetodepen},function(err){
							insidetodepenKey="insidetodepen."+Newnames+".refer_num";
							insidetodepen={};
			     			insidetodepen[insidetodepenKey]=refer_num;
							collection.update({"user":doc.user,"element":doc.element},{"$set":insidetodepen},function(err){
							
							});
						});
					  }
					}
					if(doc.element==oldname){

						collection.update({"user":doc.user,"element":doc.element},{"$set":{"element":newname}},function(err){
							
								});
					}
					
				});
				
				
			});
			query={"user":user};
			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					elementdepencys.push(elementdepency);

				});
		
				callback(null, elementdepencys);
			});
			
		});
		
};


ElementDepency.saveDependee = function saveDependee(user,elementname,dependee,type,projectID,callback){
	// 存入 Mongodb 的文檔
	var elementdepency = {
				user: user,
				element:elementname,
				dependee:dependee,
				depender:{},
				insidedepender:{},
				todepen:{},
				todepenNum:0,
				insidetodepen:{},
				type:type,
				projectID:projectID
			};
	mongodb.getCollection('elementdepency',function(collection){
			collection.ensureIndex('user');

			collection.insert(elementdepency, {safe: true},function(err){
					if(err) console.warn(err.message);
					else console.log("insert element between success");
				});

					var query = {};
			if (user) {
				
				query={"user":user,"projectID":projectID};
			}
			collection.ensureIndex('user');

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.todepen,doc.todepenNum,doc.type,doc.projectID,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
};


ElementDepency.saveInsertActAfterPre = function saveInsertActAfterPre(user,TarAct,PreAct,UseCase,current_guard_id,callback){
		//console.log("saveInsertActAfterPre:"+TarAct+" "+PreAct+" "+UseCase);
		if(TarAct.indexOf(".")>0){
			TarAct=TarAct.split(".")[0]+"_"+TarAct.split(".")[1];
			PreAct=PreAct.split(".")[0]+"_"+PreAct.split(".")[1];
			UseCase=UseCase.split(".")[0]+"_"+UseCase.split(".")[1];
		}
		//console.log("saveInsertActAfterPre:"+TarAct+" "+PreAct+" "+UseCase);
		mongodb.getCollection('elementdepency',function(collection){
			
			var traceruleID1=TarAct.split('_');
			var traceruleID2=PreAct.split('_');
			var traceruleID3=UseCase.split('_');
			if(traceruleID2[2]=="Start"){
				traceruleID2[1]=traceruleID2[1]+"_"+traceruleID2[2];
			}
			
			var query1={"user":user,"element":traceruleID1[1]};
			var query2={};

            
			if(traceruleID2[0]!=traceruleID1[0])
			{   
				var dependerNum="depender."+PreAct+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){	
					dependerNum="todepen."+TarAct+".refer_num";
					depender={};
					depender[dependerNum]=1;
					collection.update({"user":user,"element":traceruleID2[1]},{"$inc":depender},function(){	
						collection.update({"user":user,"element":traceruleID2[1]},{"$inc":{"todepenNum":1}},function(){	
						});	
					});	
				});

			}else{
				//console.log("PreAct:"+PreAct+" traceruleID1[1]:"+traceruleID1[1]);
				var insidedependerNum="insidedepender."+PreAct+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){	
					//console.log("TarAct:"+TarAct+" traceruleID2[1]:"+traceruleID2[1]);
					var insidetodepenNum="insidetodepen."+TarAct+".refer_num";
					var insidetodepen={};
					insidetodepen[insidetodepenNum]=1;
					collection.update({"user":user,"element":traceruleID2[1]},{"$inc":insidetodepen},function(){	
				
					});	
				});	

				
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+UseCase+".refer_num";
				var dependerElement="depender."+UseCase+".name";
				var depender={};
			//	depender[dependerElement]=UseCase;
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					dependerNum="todepen."+TarAct+".refer_num";
					depender={};
					depender[dependerNum]=1;
					collection.update({"user":user,"element":traceruleID3[1]},{"$inc":depender},function(){	
						collection.update({"user":user,"element":traceruleID3[1]},{"$inc":{"todepenNum":1}},function(){	
						});	
					});
				
				});	

				
			}else{
				var insidedependerNum="insidedepender."+UseCase+".refer_num";
				var insidedependerElement="insidedepender."+UseCase+".name";
				var insidedepender={};
			//	depender[dependerElement]=UseCase;
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					insidedependerNum="insidetodepen."+TarAct+".refer_num";
					insidedepender={};
					insidedepender[insidedependerNum]=1;
					collection.update({"user":user,"element":traceruleID3[1]},{"$inc":insidedepender},function(){	
					});
				});	

				
				
			}

			var query = {};
			if (user) {
				
				query={"user":user};
			}
			collection.ensureIndex('user');

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
	
	}

ElementDepency.saveInsertActBeforePost = function saveInsertActBeforePost(user,TarAct,PostAct,UseCase,current_guard_id,callback){
		if(TarAct.indexOf(".")>0){
			TarAct=TarAct.split(".")[0]+"_"+TarAct.split(".")[1];
			PostAct=PostAct.split(".")[0]+"_"+PostAct.split(".")[1];
			UseCase=UseCase.split(".")[0]+"_"+UseCase.split(".")[1];
		}
		mongodb.getCollection('elementdepency',function(collection){
			
		
			var traceruleID1=TarAct.split('_');
			var traceruleID2=PostAct.split('_');
			var traceruleID3=UseCase.split('_');
			if(traceruleID2[2]=="End"){
				traceruleID2[1]=traceruleID2[1]+"_"+traceruleID2[2];
			}

			var query1={"user":user,"element":traceruleID1[1]};
			var query2={};
			if(traceruleID2[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+PostAct+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarAct+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":{"todepenNum":1}},function(){	
				});	
			}else{
				var insidedependerNum="insidedepender."+PostAct+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarAct+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":insidedepender},function(){	
				});		
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+UseCase+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarAct+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":{"todepenNum":1}},function(){	
				});	
			}else{
				var insidedependerNum="insidedepender."+UseCase+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarAct+".refer_num";
				insidedepender={};
				insidedepender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":insidedepender},function(){	
				});	
			
			}

			var query = {};
			if (user) {
				
				query={"user":user};
			}
			collection.ensureIndex('user');

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
  }

  ElementDepency.saveInsertActAfterDecCon = function saveInsertActAfterDecCon(user,TarAct,Decision,Condition,UseCase,current_guard_id,callback){
		if(TarAct.indexOf(".")>0){
			TarAct=TarAct.split(".")[0]+"_"+TarAct.split(".")[1];
			Decision=Decision.split(".")[0]+"_"+Decision.split(".")[1];
			Condition=Condition.split(".")[0]+"_"+Condition.split(".")[1];
			UseCase=UseCase.split(".")[0]+"_"+UseCase.split(".")[1];
		}
		//console.log("saveInsertActAfterDecCon:"+TarAct+" "+Decision+" "+Condition+" "+UseCase);
		mongodb.getCollection('elementdepency',function(collection){
			
		
			var traceruleID1=TarAct.split('_');
			var traceruleID2=Decision.split('_');
			var traceruleID3=Condition.split('_');
			var traceruleID4=UseCase.split('_');
			if(traceruleID1[2]=="Start"||traceruleID1[2]=="End"){
				traceruleID1[1]=traceruleID1[1]+"_"+traceruleID1[2];
			}
			
			var query1={"user":user,"element":traceruleID1[1]};
			var query2={};
			if(traceruleID2[0]!=traceruleID1[0])
			{
			 	var dependerNum="depender."+Decision+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarAct+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":{"todepenNum":1}},function(){	
				});	
			}else{
				var insidedependerNum="insidedepender."+Decision+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarAct+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":insidedepender},function(){	
				});	
				
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+Condition+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarAct+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":{"todepenNum":1}},function(){	
				});	
			}else{
				var insidedependerNum="insidedepender."+Condition+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarAct+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":insidedepender},function(){	
				});	
			}

			if(traceruleID4[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+UseCase+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarAct+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":{"todepenNum":1}},function(){	
				});	
			}else{
				var insidedependerNum="insidedepender."+UseCase+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarAct+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":insidedepender},function(){	
				});	
			}

			var query = {};
			if (user) {
				
				query={"user":user};
			}
			collection.ensureIndex('user');

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });

  }

ElementDepency.saveInsertActBeforeActCon = function saveInsertActBeforeActCon(user,TarAct,PostAct,Condition,UseCase,current_guard_id,callback){
		if(TarAct.indexOf(".")>0){
			TarAct=TarAct.split(".")[0]+"_"+TarAct.split(".")[1];
			PostAct=PostAct.split(".")[0]+"_"+PostAct.split(".")[1];
			Condition=Condition.split(".")[0]+"_"+Condition.split(".")[1];
			UseCase=UseCase.split(".")[0]+"_"+UseCase.split(".")[1];
		}
		mongodb.getCollection('elementdepency',function(collection){

			var traceruleID1=TarAct.split('_');
			var traceruleID2=PostAct.split('_');
			var traceruleID3=Condition.split('_');
			var traceruleID4=UseCase.split('_');
			if(traceruleID1[2]=="Start"||traceruleID1[2]=="End"){
				traceruleID1[1]=traceruleID1[1]+"_"+traceruleID1[2];
			}
			if(traceruleID2[2]=="Start"||traceruleID2[2]=="End"){
				traceruleID2[1]=traceruleID2[1]+"_"+traceruleID2[2];
			}
			var query1={"user":user,"element":traceruleID1[1]};
			var query2={};
			if(traceruleID2[0]!=traceruleID1[0])
			{
			 	var dependerNum="depender."+PostAct+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarAct+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":{"todepenNum":1}},function(){	
				});	
			}else{
				var insidedependerNum="insidedepender."+PostAct+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarAct+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":insidedepender},function(){	
				});
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+Condition+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarAct+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":{"todepenNum":1}},function(){	
				});	
			}else{
				var insidedependerNum="insidedepender."+Condition+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarAct+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":insidedepender},function(){	
				});	
			}

			if(traceruleID4[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+UseCase+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarAct+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":{"todepenNum":1}},function(){	
				});	
			}else{
				var insidedependerNum="insidedepender."+UseCase+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarAct+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":insidedepender},function(){	
				});	
			}

			var query = {};
			if (user) {
				
				query={"user":user};
			}
			collection.ensureIndex('user');

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
  }

ElementDepency.saveInsertDecAfterActCon = function saveInsertDecAfterActCon(user,TarDec,PreAct,MainBranchCon,SupBranchCon,InserAct,TargetAct,UseCase,current_guard_id,callback){
		if(TarDec.indexOf(".")>0){
			TarDec=TarDec.split(".")[0]+"_"+TarDec.split(".")[1];
			PreAct=PreAct.split(".")[0]+"_"+PreAct.split(".")[1];
			MainBranchCon=MainBranchCon.split(".")[0]+"_"+MainBranchCon.split(".")[1];
			SupBranchCon=SupBranchCon.split(".")[0]+"_"+SupBranchCon.split(".")[1];
			InserAct=InserAct.split(".")[0]+"_"+InserAct.split(".")[1];
			TargetAct=TargetAct.split(".")[0]+"_"+TargetAct.split(".")[1];
			UseCase=UseCase.split(".")[0]+"_"+UseCase.split(".")[1];
		}
		mongodb.getCollection('elementdepency',function(collection){
			
			var markInserAct=false;
			if(InserAct!="0")
				markInserAct=true;

			var traceruleID1=TarDec.split('_');
			var traceruleID2=PreAct.split('_');
			var traceruleID3=MainBranchCon.split('_');
			var traceruleID4=SupBranchCon.split('_');

			var traceruleID5;
			if(InserAct!="0")
			   traceruleID5=InserAct.split('_');
			
			var traceruleID6=TargetAct.split('_');
			var traceruleID7=UseCase.split('_');
			if(traceruleID2[2]=="Start"||traceruleID2[2]=="End"){
				traceruleID2[1]=traceruleID2[1]+"_"+traceruleID2[2];
			}
			if(traceruleID5[2]=="Start"||traceruleID5[2]=="End"){
				traceruleID5[1]=traceruleID5[1]+"_"+traceruleID5[2];
			}
			if(traceruleID6[2]=="Start"||traceruleID6[2]=="End"){
				traceruleID6[1]=traceruleID6[1]+"_"+traceruleID6[2];
			}
			
			var query1={"user":user,"element":traceruleID1[1]};
			var query2={};
			if(traceruleID2[0]!=traceruleID1[0])
			{
			 	var dependerNum="depender."+PreAct+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+PreAct+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":insidedepender},function(){	
				});	
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+MainBranchCon+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+MainBranchCon+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":insidedepender},function(){	
				});	
			}

			if(traceruleID4[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+SupBranchCon+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":depender},function(){	
				});
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+SupBranchCon+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":insidedepender},function(){	
				});
			}

		  if(InserAct!="0"){
			if(traceruleID5[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+InserAct+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":depender},function(){	
				});
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+InserAct+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":insidedepender},function(){	
				});
			}
		}

			if(traceruleID6[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+TargetAct+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":depender},function(){	
				});
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+TargetAct+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":insidedepender},function(){	
				});
			}

			if(traceruleID7[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+UseCase+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+UseCase+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":insidedepender},function(){	
				});
			}
			var query = {};
			if (user) {
				
				query={"user":user};
			}
			collection.ensureIndex('user');

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
  }

ElementDepency.saveInsertDecAfterDecCon = function saveInsertDecAfterActCon(user,TarDec,InserDec,InserCon,MainBranchCon,SupBranchCon,InserAct,TargetDec,UseCase,current_guard_id,callback){
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

		mongodb.getCollection('elementdepency',function(collection){
			
		
			var traceruleID1=TarDec.split('_');
			var traceruleID2=InserDec.split('_');
			var traceruleID3=InserCon.split('_');
			var traceruleID4=MainBranchCon.split('_');
			var traceruleID5=SupBranchCon.split('_');
			var traceruleID6=InserAct.split('_');
			var traceruleID7=TargetDec.split('_');
			var traceruleID8=UseCase.split('_');
			if(traceruleID6[2]=="Start"||traceruleID6[2]=="End"){
				traceruleID6[1]=traceruleID6[1]+"_"+traceruleID6[2];
			}
			
			var query1={"user":user,"element":traceruleID1[1]};
			var query2={};
			if(traceruleID2[0]!=traceruleID1[0])
			{
			 	var dependerNum="depender."+InserDec+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+InserDec+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":insidedepender},function(){	
				});	
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
			 	var dependerNum="depender."+InserCon+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+InserCon+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":insidedepender},function(){	
				});
			}

			if(traceruleID4[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+MainBranchCon+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":depender},function(){	
				});
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":{"todepenNum":1}},function(){	
				});	
			}else{
				var insidedependerNum="insidedepender."+MainBranchCon+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":insidedepender},function(){	
				});
			}

			if(traceruleID5[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+SupBranchCon+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+SupBranchCon+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":insidedepender},function(){	
				});
			}

			if(InserAct!="none_none" && traceruleID6[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+InserAct+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				if(traceruleID6[0]==traceruleID1[0]){
					var insidedependerNum="insidedepender."+InserAct+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":insidedepender},function(){	
				});
				}
			}

			if(traceruleID7[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+TargetDec+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+TargetDec+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":insidedepender},function(){	
				});	
			}

			if(traceruleID8[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+UseCase+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID8[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID8[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+UseCase+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID8[1]},{"$inc":insidedepender},function(){	
				});	
			}
			var query = {};
			if (user) {
				
				query={"user":user};
			}
			collection.ensureIndex('user');

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
  }

  ElementDepency.saveInsertDecBeforeAct = function saveInsertDecBeforeAct(user,TarDec,PostAct,Con1,Tar1,Con2,Tar2,UseCase,current_guard_id,callback){
		if(TarDec.indexOf(".")>0){
			TarDec=TarDec.split(".")[0]+"_"+TarDec.split(".")[1];
			PostAct=PostAct.split(".")[0]+"_"+PostAct.split(".")[1];
			Con1=Con1.split(".")[0]+"_"+Con1.split(".")[1];
			Tar1=Tar1.split(".")[0]+"_"+Tar1.split(".")[1];
			Con2=Con2.split(".")[0]+"_"+Con2.split(".")[1];
			Tar2=Tar2.split(".")[0]+"_"+Tar2.split(".")[1];
			UseCase=UseCase.split(".")[0]+"_"+UseCase.split(".")[1];
		}

		mongodb.getCollection('elementdepency',function(collection){
			
		
			var traceruleID1=TarDec.split('_');
			var traceruleID2=PostAct.split('_');
			var traceruleID3=Con1.split('_');
			var traceruleID4=Tar1.split('_');
			var traceruleID5=Con2.split('_');
			var traceruleID6=Tar2.split('_');
			var traceruleID7=UseCase.split('_');
			if(traceruleID2[2]=="Start"||traceruleID2[2]=="End"){
				traceruleID2[1]=traceruleID2[1]+"_"+traceruleID2[2];
			}
			if(traceruleID4[2]=="Start"||traceruleID4[2]=="End"){
				traceruleID4[1]=traceruleID4[1]+"_"+traceruleID4[2];
			}
			if(traceruleID6[2]=="Start"||traceruleID6[2]=="End"){
				traceruleID6[1]=traceruleID6[1]+"_"+traceruleID6[2];
			}
			
			var query1={"user":user,"element":traceruleID1[1]};
			var query2={};
			if(traceruleID2[0]!=traceruleID1[0])
			{
			 	var dependerNum="depender."+PostAct+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+PostAct+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":insidedepender},function(){	
				});
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+Con1+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":depender},function(){	
				});
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":{"todepenNum":1}},function(){	
				});	
			}else{
				var insidedependerNum="insidedepender."+Con1+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":insidedepender},function(){	
				});
			}

			if(traceruleID4[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+Tar1+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+Tar1+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":insidedepender},function(){	
				});
			}

			if(traceruleID5[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+Con2+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+Con2+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":insidedepender},function(){	
				});
			}

			if(traceruleID6[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+Tar2+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+Tar2+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":insidedepender},function(){	
				});
			}

			if(traceruleID7[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+UseCase+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+UseCase+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":insidedepender},function(){	
				});	
			}
			var query = {};
			if (user) {
				
				query={"user":user};
			}
			collection.ensureIndex('user');

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
  }

  ElementDepency.saveInsertDecBeforeActWith = function saveInsertDecBeforeActWith(user,TarDec,PostAct,MainBranchCon,SupBranchCon,InserAct,TargetDec,UseCase,current_guard_id,callback){
		if(TarDec.indexOf(".")>0){
			TarDec=TarDec.split(".")[0]+"_"+TarDec.split(".")[1];
			PostAct=PostAct.split(".")[0]+"_"+PostAct.split(".")[1];
			MainBranchCon=MainBranchCon.split(".")[0]+"_"+MainBranchCon.split(".")[1];
			SupBranchCon=SupBranchCon.split(".")[0]+"_"+SupBranchCon.split(".")[1];
			InserAct=InserAct.split(".")[0]+"_"+InserAct.split(".")[1];
			TargetDec=TargetDec.split(".")[0]+"_"+TargetDec.split(".")[1];
			UseCase=UseCase.split(".")[0]+"_"+UseCase.split(".")[1];
		}
	mongodb.getCollection('elementdepency',function(collection){
			
		
			var traceruleID1=TarDec.split('_');
			var traceruleID2=PostAct.split('_');
			var traceruleID3=MainBranchCon.split('_');
			var traceruleID4=SupBranchCon.split('_');
			var traceruleID5=InserAct.split('_');
			var traceruleID6=TargetDec.split('_');
			var traceruleID7=UseCase.split('_');
			if(traceruleID2[2]=="Start"||traceruleID2[2]=="End"){
				traceruleID2[1]=traceruleID2[1]+"_"+traceruleID2[2];
			}
			if(traceruleID5[2]=="Start"||traceruleID5[2]=="End"){
				traceruleID5[1]=traceruleID5[1]+"_"+traceruleID5[2];
			}

			var query1={"user":user,"element":traceruleID1[1]};
			var query2={};
			if(traceruleID2[0]!=traceruleID1[0])
			{
			 	var dependerNum="depender."+PostAct+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+PostAct+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":insidedepender},function(){	
				});
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+MainBranchCon+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+MainBranchCon+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":insidedepender},function(){	
				});
			}

			if(traceruleID4[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+SupBranchCon+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+SupBranchCon+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":insidedepender},function(){	
				});
			}

			if(InserAct!="" && traceruleID5[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+InserAct+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":depender},function(){	
				});		
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+InserAct+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":insidedepender},function(){	
				});	
			}

			if(traceruleID6[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+TargetDec+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+TargetDec+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":insidedepender},function(){	
				});	
			}

			if(traceruleID7[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+UseCase+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+UseCase+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":insidedepender},function(){	
				});	
			}
			var query = {};
			if (user) {
				
				query={"user":user};
			}
			collection.ensureIndex('user');

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });

  }

ElementDepency.saveInsertDecBeforeActCon = function saveInsertDecBeforeActCon(user,TarDec,PostAct,InserCon,MainBranchCon,SupBranchCon,InserAct,TargetDec,UseCase,current_guard_id,callback){
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
		mongodb.getCollection('elementdepency',function(collection){
			
		
			var traceruleID1=TarDec.split('_');
			var traceruleID2=PostAct.split('_');
			var traceruleID3=InserCon.split('_');
			var traceruleID4=MainBranchCon.split('_');
			var traceruleID5=SupBranchCon.split('_');
			var traceruleID6=InserAct.split('_');
			var traceruleID7=TargetDec.split('_');
			var traceruleID8=UseCase.split('_');
			if(traceruleID2[2]=="Start"||traceruleID2[2]=="End"){
				traceruleID2[1]=traceruleID2[1]+"_"+traceruleID2[2];
			}
			if(traceruleID6[2]=="Start"||traceruleID6[2]=="End"){
				traceruleID6[1]=traceruleID6[1]+"_"+traceruleID6[2];
			}
			var query1={"user":user,"element":traceruleID1[1]};
			var query2={};
			if(traceruleID2[0]!=traceruleID1[0])
			{
			 	var dependerNum="depender."+PostAct+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+PostAct+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID2[1]},{"$inc":insidedepender},function(){	
				});
			}

			if(traceruleID3[0]!=traceruleID1[0])
			{
			 	var dependerNum="depender."+InserCon+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+InserCon+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID3[1]},{"$inc":insidedepender},function(){	
				});
			}

			if(traceruleID4[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+MainBranchCon+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+MainBranchCon+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID4[1]},{"$inc":insidedepender},function(){	
				});
			}

			if(traceruleID5[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+SupBranchCon+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+SupBranchCon+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID5[1]},{"$inc":insidedepender},function(){	
				});
			}

			if(InserAct!="none_none" && traceruleID6[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+InserAct+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+InserAct+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID6[1]},{"$inc":insidedepender},function(){	
				});	
			}

			if(traceruleID7[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+TargetDec+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+TargetDec+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID7[1]},{"$inc":insidedepender},function(){	
				});	
			}

			if(traceruleID8[0]!=traceruleID1[0])
			{
				var dependerNum="depender."+UseCase+".refer_num";
				var depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+TarDec+".refer_num";
				depender={};
				depender[dependerNum]=1;
				collection.update({"user":user,"element":traceruleID8[1]},{"$inc":depender},function(){	
				});	
				collection.update({"user":user,"element":traceruleID8[1]},{"$inc":{"todepenNum":1}},function(){	
				});
			}else{
				var insidedependerNum="insidedepender."+UseCase+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID1[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+TarDec+".refer_num";
				insidedepender={};
				insidedepender[insidedependerNum]=1;
				collection.update({"user":user,"element":traceruleID8[1]},{"$inc":insidedepender},function(){	
				});
			}
			var query = {};
			if (user) {
				
				query={"user":user};
			}
			collection.ensureIndex('user');

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
  }

ElementDepency.deleteActivityDependee = function deleteActivityDependee(user,id,operation_name,callback){
	mongodb.getCollection('elementdepency',function(collection){
			collection.ensureIndex('user');
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			//console.log(name[length]);
			collection.remove({'element':name[length]},function(err){
					if(err) console.warn(err.message);
					else console.log("delete element success");
				});

			var query = {};
			if (user) {
				
				query={"user":user};
			}
			collection.ensureIndex('user');

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
};

ElementDepency.deleteDecisionDependee = function deleteDecisionDependee(user,id,operation_name,callback){
	mongodb.getCollection('elementdepency',function(collection){
			collection.ensureIndex('user');
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			//console.log(name[length]);
			collection.remove({'element':name[length]},function(err){
					if(err) console.warn(err.message);
					else console.log("delete element success");
				});

			var query = {};
			if (user) {
				
				query={"user":user};
			}
			collection.ensureIndex('user');

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });

};

ElementDepency.deleteConditionDependee = function deleteConditionDependee(user,id,operation_name,callback){
	mongodb.getCollection('elementdepency',function(collection){
			collection.ensureIndex('user');
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			//console.log(name[length]);
			collection.remove({'element':name[length]},function(err){
					if(err) console.warn(err.message);
					else console.log("delete element success");
				});

			var query = {};
			if (user) {
				
				query={"user":user};
			}
			collection.ensureIndex('user');

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
};

ElementDepency.deleteUseCaseDependee = function deleteUseCaseDependee(user,id,operation_name,callback){
	mongodb.getCollection('elementdepency',function(collection){
			collection.ensureIndex('user');
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			//console.log(name[length]);
			var $startname=name[length]+"_Start";
			var $endname=name[length]+"_End";
			collection.remove({'element':name[length]},function(err){
					if(err) console.warn(err.message);
					else{ 
						//console.log("delete element success");
						collection.remove({'element':$startname},function(err){
							if(err) console.warn(err.message);
							else{
								collection.remove({'element':$endname},function(err){
								if(err) console.warn(err.message);
								else{
											var query = {};
											if (user) {
				
												query={"user":user};
											}
											collection.ensureIndex('user');

												collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
												//mongodb.close();

												if (err) {
													callback(err, null);
												}

												var elementdepencys = [];
				
												docs.forEach(function(doc, index) {
													var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
													elementdepencys.push(elementdepency);
												});

												callback(null, elementdepencys);
											});
									}
								});
							}
						});
					}
				});

		


		  });

};

//I2
ElementDepency.deleteInsertActAfterPre = function deleteInsertActAfterPre(user,id,operation_name,hide_field,callback){
	mongodb.getCollection('elementdepency',function(collection){
			collection.ensureIndex('user');
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			//console.log("deleteInsertActAfterPre:"+name[length]);
			
			var query1={"user":user,"element":name[1]};
			var query2={};
		
	   		var field=hide_field.split("_");
	   		if(field[0]!==field[1]){
				var dependerNum="depender."+field[1]+"_"+name[3]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					collection.update({"user":user,"element":name[1],dependerNum:0},{"$unset":depender},function(err){
					if(err) console.warn(err.message);
					else {
						//console.log("delete decision success");

				 dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[3]},{"$inc":depender},function(){
					collection.update({"user":user,"element":name[3]},{"$inc":{"todepenNum":-1}},function(){

					});
				});
				
						}
					})
				});	

			}else{
				var insidedependerNum="insidedepender."+field[1]+"_"+name[3]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					collection.update({"user":user,"element":name[1],insidedependerNum:0},{"$unset":insidedepender},function(err){
					if(err) console.warn(err.message);
					else {
						//console.log("delete decision success");
						 insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 		 insidedepender={};
						 insidedepender[insidedependerNum]=-1;
						 collection.update({"user":user,"element":name[3]},{"$inc":insidedepender},function(){

							});
						}
					})
				});	

				
				
			}
			if(field[0]!==field[2]){
				var dependerNum="depender."+field[2]+"_"+name[5]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[5]},{"$inc":depender},function(){
					collection.update({"user":user,"element":name[5]},{"$inc":{"todepenNum":-1}},function(){

				});
				});
				
				});	

				
			}else{
				var insidedependerNum="insidedepender."+field[2]+"_"+name[5]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[5]},{"$inc":insidedepender},function(){

				});
				});	

				
				
			}

			var query = {};
			if (user) {
				
				query={"user":user};
			}
			collection.ensureIndex('user');

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
};

//I3
ElementDepency.deleteInsertActBeforePost = function deleteInsertActBeforePost(user,id,operation_name,hide_field,callback){
	mongodb.getCollection('elementdepency',function(collection){
			collection.ensureIndex('user');
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			//console.log(name[length]);

		    var name=operation_name.split(" ");
			
			var query1={"user":user,"element":name[1]};
			var query2={};

			var field=hide_field.split("_");
			if(field[0]!==field[1])
			{
				var dependerNum="depender."+field[1]+"_"+name[3]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){

				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[3]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[3]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[1]+"_"+name[3]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){

				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[3]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[2]){
				var dependerNum="depender."+field[2]+"_"+name[5]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[5]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[5]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[2]+"_"+name[5]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[5]},{"$inc":insidedepender},function(){

				});
			}

			var query = {};
			if (user) {
				
				query={"user":user};
			}
			collection.ensureIndex('user');

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
};

//I4
ElementDepency.deleteInsertActAfterDecCon = function deleteInsertActAfterDecCon(user,id,operation_name,hide_field,callback){
	mongodb.getCollection('elementdepency',function(collection){
			collection.ensureIndex('user');
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			//console.log(name[length]);

		    var name=operation_name.split(" ");
			
			var query1={"user":user,"element":name[1]};
			var query2={};

			var field=hide_field.split("_");

			if(field[0]!==field[3]){
				var dependerNum="depender."+field[1]+"_"+name[3]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
				
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[3]},{"$inc":depender},function(){

				});	
				collection.update({"user":user,"element":name[3]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[1]+"_"+name[3]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
				
				});

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[3]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[2]){
				var dependerNum="depender."+field[2]+"_"+name[5]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[5]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[5]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[2]+"_"+name[5]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[5]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[3]){
				var dependerNum="depender."+field[3]+"_"+name[7]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[7]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[7]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[3]+"_"+name[7]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[7]},{"$inc":insidedepender},function(){

				});
			}

			var query = {};
			if (user) {
				
				query={"user":user};
			}
			collection.ensureIndex('user');

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
};

//I5

ElementDepency.deleteInsertActBeforeActCon = function deleteInsertActBeforeActCon(user,id,operation_name,hide_field,callback){
	mongodb.getCollection('elementdepency',function(collection){
			collection.ensureIndex('user');
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			//console.log(name[length]);

		    var name=operation_name.split(" ");
			
			var query1={"user":user,"element":name[1]};
			var query2={};
		
			var field=hide_field.split("_");

			if(field[0]!==field[1]){
				var dependerNum="depender."+field[1]+"_"+name[3]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[3]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[3]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[1]+"_"+name[3]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[3]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[2]){
				var dependerNum="depender."+field[2]+"_"+name[5]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[5]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[5]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[2]+"_"+name[5]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[5]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[3]){
				var dependerNum="depender."+field[3]+"_"+name[7]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[7]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[7]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[3]+"_"+name[7]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[7]},{"$inc":insidedepender},function(){

				});
			}

			var query = {};
			if (user) {
				
				query={"user":user};
			}
			collection.ensureIndex('user');

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });

};

//I6

ElementDepency.deleteInsertDecAfterAct = function deleteInsertDecAfterAct(user,id,operation_name,hide_field,callback){
	mongodb.getCollection('elementdepency',function(collection){
			collection.ensureIndex('user');
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			//console.log(name[length]);

		    var name=operation_name.split(" ");
			
			var query1={"user":user,"element":name[1]};
			var query2={};
	
			var field=hide_field.split("_");

			if(field[0]!==field[1]){
				var dependerNum="depender."+field[1]+"_"+name[3]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
				
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[3]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[3]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[1]+"_"+name[3]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
				
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[3]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[2]){
				var dependerNum="depender."+field[2]+"_"+name[6]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[6]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[6]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[2]+"_"+name[6]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[6]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[3]){
				var dependerNum="depender."+field[3]+"_"+name[8]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[8]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[8]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[3]+"_"+name[8]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[8]},{"$inc":insidedepender},function(){

				});
			}

			if(field[0]!==field[4]){
				var dependerNum="depender."+field[4]+"_"+name[10]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[10]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[10]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[4]+"_"+name[10]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[10]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[5]){
				var dependerNum="depender."+field[5]+"_"+name[12]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[12]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[12]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[5]+"_"+name[12]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[12]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[6]){
				var dependerNum="depender."+field[6]+"_"+name[15]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[15]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[15]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[6]+"_"+name[15]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[15]},{"$inc":insidedepender},function(){

				});
			}

			var query = {};
			if (user) {
				
				query={"user":user};
			}
			collection.ensureIndex('user');

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
};

//I7

ElementDepency.deleteInsertDecAfterDecCon = function deleteInsertDecAfterDecCon(user,id,operation_name,hide_field,callback){
	mongodb.getCollection('elementdepency',function(collection){
			collection.ensureIndex('user');
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			//console.log(name[length]);

		    var name=operation_name.split(" ");
			
			var query1={"user":user,"element":name[1]};
			var query2={};
			

			var field=hide_field.split("_");

			if(field[0]!==field[1]){
				var dependerNum="depender."+field[1]+"_"+name[4]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[4]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[4]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[1]+"_"+name[4]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[4]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[2]){
				var dependerNum="depender."+field[2]+"_"+name[6]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[6]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[6]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[2]+"_"+name[6]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[6]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[3]){
				var dependerNum="depender."+field[3]+"_"+name[10]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[10]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[10]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[3]+"_"+name[10]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[10]},{"$inc":insidedepender},function(){

				});
			}

			if(field[0]!==field[4]){
				var dependerNum="depender."+field[4]+"_"+name[12]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[12]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[12]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[4]+"_"+name[12]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[12]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[5]){
				var dependerNum="depender."+field[5]+"_"+name[14]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[14]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[14]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[5]+"_"+name[14]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[14]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[6]){
				var dependerNum="depender."+field[6]+"_"+name[16]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[16]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[16]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[6]+"_"+name[16]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[16]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[7]){
				var dependerNum="depender."+field[7]+"_"+name[19]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[19]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[19]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[7]+"_"+name[19]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[19]},{"$inc":insidedepender},function(){

				});
			}


			var query = {};
			if (user) {
				
				query={"user":user};
			}
			collection.ensureIndex('user');

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });

};

//I8

ElementDepency.deleteInsertDecBeforeAct = function deleteInsertDecBeforeAct(user,id,operation_name,hide_field,callback){
	mongodb.getCollection('elementdepency',function(collection){
			collection.ensureIndex('user');
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			//console.log(name[length]);

		    var name=operation_name.split(" ");
			
			var query1={"user":user,"element":name[1]};
			var query2={};
		
			var field=hide_field.split("_");

			if(field[0]!==field[1]){
				var dependerNum="depender."+field[1]+"_"+name[3]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[3]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[3]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[1]+"_"+name[3]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[3]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[2]){
				var dependerNum="depender."+field[2]+"_"+name[6]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[6]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[6]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[2]+"_"+name[6]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[6]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[3]){
				var dependerNum="depender."+field[3]+"_"+name[8]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[8]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[8]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[3]+"_"+name[8]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[8]},{"$inc":insidedepender},function(){

				});
			}

			if(field[0]!==field[4]){
				var dependerNum="depender."+field[4]+"_"+name[10]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[10]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[10]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[4]+"_"+name[10]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[10]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[5]){
				var dependerNum="depender."+field[5]+"_"+name[12]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});
				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[12]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[12]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[5]+"_"+name[12]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});
				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[12]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[6]){
				var dependerNum="depender."+field[6]+"_"+name[15]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[15]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[15]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[6]+"_"+name[15]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[15]},{"$inc":insidedepender},function(){

				});
			}

			var query = {};
			if (user) {
				
				query={"user":user};
			}
			collection.ensureIndex('user');

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
		
};

//I9

ElementDepency.deleteInsertDecBeforeActWith = function deleteInsertDecBeforeActWith(user,id,operation_name,hide_field,callback){
	mongodb.getCollection('elementdepency',function(collection){
			collection.ensureIndex('user');
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			//console.log(name[length]);

		    var name=operation_name.split(" ");
			
			var query1={"user":user,"element":name[1]};
			var query2={};

			var field=hide_field.split("_");

			if(field[0]!==field[1]){
				var dependerNum="depender."+field[1]+"_"+name[3]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[3]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[3]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[1]+"_"+name[3]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[3]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[2]){
				var dependerNum="depender."+field[2]+"_"+name[6]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[6]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[6]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[2]+"_"+name[6]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[6]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[3]){
				var dependerNum="depender."+field[3]+"_"+name[8]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[8]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[8]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[3]+"_"+name[8]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[8]},{"$inc":insidedepender},function(){

				});
			}

			if(field[0]!==field[4]){
				var dependerNum="depender."+field[4]+"_"+name[10]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[10]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[10]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[4]+"_"+name[10]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[10]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[5]){
				var dependerNum="depender."+field[5]+"_"+name[12]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[12]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[12]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[5]+"_"+name[12]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[12]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[6]){
				var dependerNum="depender."+field[6]+"_"+name[15]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[15]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[15]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[6]+"_"+name[15]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[15]},{"$inc":insidedepender},function(){

				});
			}

			var query = {};
			if (user) {
				
				query={"user":user};
			}
			collection.ensureIndex('user');

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
			});

		  });
};

//I10

ElementDepency.deleteInsertDecBeforeActCon = function deleteInsertDecBeforeActCon(user,id,operation_name,hide_field,callback){
	mongodb.getCollection('elementdepency',function(collection){
			collection.ensureIndex('user');
			var name=operation_name.split(" ");
			var length=name.length;
			length=length-1;
			//console.log(name[length]);

		    var name=operation_name.split(" ");
			
			var query1={"user":user,"element":name[1]};
			var query2={};

			var field=hide_field.split("_");

			if(field[0]!==field[1]){
				var dependerNum="depender."+field[1]+"_"+name[4]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[4]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[4]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[1]+"_"+name[4]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[4]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[2]){
				var dependerNum="depender."+field[2]+"_"+name[6]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[6]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[6]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[2]+"_"+name[6]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[6]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[3]){
				var dependerNum="depender."+field[3]+"_"+name[10]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[10]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[10]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[3]+"_"+name[10]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[10]},{"$inc":insidedepender},function(){

				});
			}

			if(field[0]!==field[4]){
				var dependerNum="depender."+field[4]+"_"+name[12]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[12]},{"$inc":depender},function(){

				});	
				collection.update({"user":user,"element":name[12]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[4]+"_"+name[12]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[12]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[5]){
				var dependerNum="depender."+field[5]+"_"+name[14]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[14]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[14]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[5]+"_"+name[14]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[14]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[6]){
				var dependerNum="depender."+field[6]+"_"+name[16]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[16]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[16]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[6]+"_"+name[16]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[16]},{"$inc":insidedepender},function(){

				});
			}
			if(field[0]!==field[7]){
				var dependerNum="depender."+field[7]+"_"+name[19]+".refer_num";
				var depender={};
				depender[dependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":depender},function(){
					
				});	

				dependerNum="todepen."+field[0]+"_"+name[1]+".refer_num";
				 depender={};
				depender[dependerNum]=-1;
				collection.update({"user":user,"element":name[19]},{"$inc":depender},function(){

				});
				collection.update({"user":user,"element":name[19]},{"$inc":{"todepenNum":-1}},function(){

				});
			}else{
				var insidedependerNum="insidedepender."+field[7]+"_"+name[19]+".refer_num";
				var insidedepender={};
				insidedepender[insidedependerNum]=-1;	
				collection.update({"user":user,"element":name[1]},{"$inc":insidedepender},function(){
					
				});	

				insidedependerNum="insidetodepen."+field[0]+"_"+name[1]+".refer_num";
				 insidedepender={};
				insidedepender[insidedependerNum]=-1;
				collection.update({"user":user,"element":name[19]},{"$inc":insidedepender},function(){

				});
			}

			var query = {};
			if (user) {
				
				query={"user":user};
			}
			collection.ensureIndex('user');

			collection.find(query, {limit:9}).sort({_id: 1}).toArray(function(err, docs) {
				//mongodb.close();

				if (err) {
					callback(err, null);
				}

				var elementdepencys = [];
				
				docs.forEach(function(doc, index) {
					var elementdepency = new ElementDepency(doc.user, doc.element,doc.dependee,doc.depender,doc.insidedepender,doc.todepen,doc.todepenNum,doc.insidetodepen,doc.type,doc._id);
					elementdepencys.push(elementdepency);
				});

				callback(null, elementdepencys);
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
	mongodb.getCollection('elementdepency',function(collection){
			collection.ensureIndex('user');
			
			var query1={"user":user,"depender":oldelementname};

					var query = {};
		
			collection.ensureIndex('user');


		  });
		
};

ElementDepency.editUseCase = function editUseCase(user,id,usecasemark,oldusecasename,usecasename,descriptionmark,olddescription,description,positions){

}

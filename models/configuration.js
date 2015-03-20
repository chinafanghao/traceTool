var mongodb = require('./db');

function Configuration(username,name,time,configuration,usecasename,usecase,projectID,_id) { //post means refinements list
	this.user = username;
	this.name=name;
	if (time) {
		this.time = time;
	} else {
		this.time = new Date();
	}
	this.configuration=configuration;
	this.usecasename=usecasename;
	this.usecase=usecase;
	this.projectID=projectID;
	this._id=_id;
};
module.exports = Configuration;

Configuration.prototype.save = function save(callback) {
	// 存入 Mongodb 的文檔
	var configuration = {
		user: this.user,
		name:this.name,
		time: this.time,
		configuration:this.configuration,
		usecasename:this.usecasename,
		usecase:this.usecase,
		projectID:this.projectID
	};

	mongodb.open(function(err, db) {
		if (err) {
		  return callback(err);
		}
		
		db.collection('configuration', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
			collection.insert(configuration, {safe: true}, function(err, configuration) {
				mongodb.close();
				callback(err, configuration);
			});
		});
	});
};

Configuration.addNewConfiguration = function addNewConfiguration(username,projectID,name,callback) {
	// 存入 Mongodb 的文檔
// 存入 Mongodb 的文檔
	var newConfiguration = {
				user: username,
				name:name,
				configuration:"",
				usecasename:"",
				usecase:{},
				projectID:projectID
			};
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
	   
	   db.collection('configuration', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
			collection.ensureIndex('user');
			collection.insert(newConfiguration, {safe: true},function(err){
					if(err) {
						console.warn(err.message);
						mongodb.close();
					}
					else {
						console.log("insert new configuration success");

						var query = {};
						if (username) {
				
							query={"user":username,"projectID":projectID};
						}
						collection.ensureIndex('user');
						collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
							mongodb.close();

							if (err) {
								callback(err, null,null);
							}

							var configurations = [];
							var $newConfigurationID;
							docs.forEach(function(doc, index) {
								var configuration = new Configuration(doc.user, doc.name,doc.time,doc.configuration,doc.usecasename,doc.usecase,doc.projectID,doc._id);
								configurations.push(configuration);
								if(doc.name==name){
									$newConfigurationID=doc._id;
								}
							});

							callback(null, configurations,$newConfigurationID);
						});
					}
				});


			

		  });
		
	});
};



Configuration.get = function get(username,projectID,id,callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('configuration', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var ObjectID = require("mongodb").ObjectID;
			//查找user属性为username的文档，如果username为null则匹配全部
			var query = {};
			if (id) {
				
				query={"user":username,"projectID":projectID,"_id":ObjectID(id)};
			}
			else{
				query={"user":username,"projectID":projectID};
			}

			collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
							mongodb.close();

							if (err) {
								callback(err, null);
							}

							var configurations = [];
				
							docs.forEach(function(doc, index) {
								var configuration = new Configuration(doc.user, doc.name,doc.time,doc.configuration,doc.usecasename,doc.usecase,doc.projectID,doc._id);
								configurations.push(configuration);
							});

							callback(null, configurations);
						});
		});
	});
};

Configuration.getUseCase = function getUseCase(username,projectID,id,callback) {
	
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('configuration', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var ObjectID = require("mongodb").ObjectID;
			//查找user属性为username的文档，如果username为null则匹配全部
			var query = {};
				
				query={"user":username,"projectID":projectID,"_id":ObjectID(id)};
				collection.findOne(query, function(err, doc) {
					mongodb.close();
					if (doc) {
						console.log("doc:"+doc.usecase);
						
						
						callback(null, doc.usecase);
					} else {
						callback(err, null);
					}
			});
		});
	});
};


Configuration.removeConfiguration = function removeConfiguration(user,deleteID,callback){
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('configuration', function(err, collection) {
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
									
									var query = {};
									if (user) {
				
										query={"user":user};
									}
									collection.ensureIndex('user');
									collection.find(query).sort({_id: 1}).toArray(function(err, docs) {
										mongodb.close();

										if (err) {
											callback(err, null);
										}

										var configurations = [];
										
										docs.forEach(function(doc, index) {
											var configuration = new Configuration(doc.user, doc.name,doc.time,doc.configuration,doc.usecasename,doc.usecase,doc._id);
											configurations.push(configuration);
										
										});

							callback(null, configurations);
						});
									}
							});
		});
	});
}

Configuration.editConfigName = function editConfigName(user,configname,editID,callback){
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('configuration', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var ObjectID = require("mongodb").ObjectID;
			//查找user属性为username的文档，如果username为null则匹配全部
			var query1 = {};
			var query2 = {};
			
			console.log("hahahahahhahahaha");
			query1={"user":user,"_id":ObjectID(editID)};
			query2={$set:{"name":configname}};
			collection.update(query1,query2,{safe:true},function(err){mongodb.close()});
				
		});
	});
}

Configuration.editConfig = function editConfig(user,editID,config,callback){
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('configuration', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var ObjectID = require("mongodb").ObjectID;
			//查找user属性为username的文档，如果username为null则匹配全部
			var query1 = {};
			var query2 = {};
			
			
			query1={"user":user,"_id":ObjectID(editID)};
			query2={$set:{"configuration":config}};
			collection.update(query1,query2,{safe:true},function(err){mongodb.close()});
				
		});
	});
}

Configuration.saveUsecase=function saveUsecase(user,projectID,current_configuration_id,casename,result,callback){
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('configuration', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var ObjectID = require("mongodb").ObjectID;
			//查找user属性为username的文档，如果username为null则匹配全部
			var query1 = {};
			var query2 = {};
			
			
			query1={"user":user,"_id":ObjectID(current_configuration_id),"projectID":projectID};
			query2={$set:{"usecasename":casename,"usecase":result}};
			collection.update(query1,query2,{safe:true},function(err){
				mongodb.close();
				callback(null,result);
			});
				
		});
	});
}

	var ucList = [];  
	var content = [];
	var print = [];
	var printStr;
	var num;

Configuration.singlepre=function singlepre(pre, head, uc_index)            // pre直接给出 
{
	if(pre == -1)
		ucList[uc_index].start.next = head;      //pre.next[0] = head 
	else
		{
			if(content[pre].nextsize==0)
				content[pre].nextsize++;
			content[pre].next[0] = head; 

		}           //pre.next[0] = head 	
	              
	content[head].before[0] = pre;              // head.before[0] = pre		
	content[head].beforesize++;
}

Configuration.multipre=function multipre(post, head, uc_index)            // pre是通过post给出，这样pre有可能是多个  multi使用反方向检索
{
	var beforesize;
	if(post == -2)
		beforesize = ucList[uc_index].end.beforesize;
	else 
		beforesize = content[post].beforesize;
	console.log("beforesize:"+beforesize);
	for(var k=0; k<beforesize;k++)  //对于每一个由post推倒出来的可能的前驱
	{
		var pre = content[post].before[k];
		console.log("k: "+k+" pre: "+pre);
		if(pre == -1)
			ucList[uc_index].start.next = head;      //pre.next[0] = head 
		else
			{

				if(content[pre].nextsize==0)
				content[pre].nextsize++;

				content[pre].next[0] = head;
			}             //pre.next[0] = head 
		
		content[head].before[k] = pre;	
		content[head].beforesize++;	
	}
}

Configuration.singlepost=function singlepost(post, tail, uc_index)       // post.before[0] = tail   tail.next[0] = post
{
	var beforesize;
	if(post == -2)
		beforesize = ucList[uc_index].end.beforesize;
	else 
		beforesize = content[post].beforesize;

	for(var k=0; k<beforesize; k++) //可能之前有多个前驱，全部删掉
	{
		if(post == -2)
		{
			ucList[uc_index].end.before.pop();
			ucList[uc_index].end.beforesize--;
		}
		else
		{
			content[post].before.pop();
			content[post].beforesize--;
		}
		
	}		
	
	if(post == -2)
		ucList[uc_index].end.before[0] = tail;
	else 
		{
			if(content[post].beforesize==0)
				content[post].beforesize++;
			content[post].before[0] = tail;
		}

	content[post].beforesize++;
	content[tail].next[0] = post;
	content[tail].nextsize++;
 }

Configuration.multipost=function multipost(post, tail, pre, uc_index)  
{
	var beforesize;
	console.log("post:   "+post);
	if(post == -2)
		beforesize = ucList[uc_index].end.beforesize;
	else 
		{
			if(content[post].beforesize==0)
				content[post].beforesize++;
			beforesize = content[post].beforesize;
		}

	var k;
	for(k=0; k<beforesize; k++)            //找到post的前=pre的那一个分支
	{
		if( post == -2 )
		{
			if(ucList[uc_index].end.before[k] == pre)
			break;
		}
		else
		{
			if(content[post].before[k] == pre)
			break;
		}
		
	}

	if(post == -2)
		{
			ucList[uc_index].end.before[k] = tail;
			content[tail].nextsize--;	
		}
	else
		{
			if(content[post].beforesize==0)
				content[post].beforesize++;
			content[post].before[k] = tail;
		}

	content[tail].next[0] = post;
	content[tail].nextsize++;
}



//////////////这个用于作为第二个branch及之后的post处理，第一branch使用得是之前那个post处理,之后的不用区别多或单入，只要增加就可以了
Configuration.postdec=function postdec(post, tail, uc_index)       // tail 是dec的branch seq的最后一个元素  post.before[0] = tail   tail.next[0] = post
{	
	var beforesize;  
	//console.log("post is" + post);
	console.log("#################");
	console.log(post+" "+tail);
	console.log("#################");
	if(post == -2)
		beforesize = ucList[uc_index].end.beforesize;
	else 
		beforesize = content[post].beforesize;

	if(post == -2)
	{
		ucList[uc_index].end.before[beforesize] = tail;
		ucList[uc_index].end.beforesize++;

	}
	else
	{
		content[post].before[beforesize] = tail;
		content[post].beforesize++;

	} 		

	content[tail].next[0] = post;
	content[tail].nextsize++;
 }

Configuration.printusecase=function printusecase(ele,tracerules)
{
	//console.log("hahaha!!!"+ele);
	var $returnWord="";
	num++;

	//console.log("printusecase: "+tracerules);
	if(ele != -2)
	{	
		if( print[ele]==false )
		{
			var elePath=ele.split(".");
			
			var element;
			for(traceruleElement in tracerules){ 
				//console.log(tracerules[traceruleElement]._id+":"+elePath[0]);
				if(tracerules[traceruleElement]._id==elePath[0])
				{
					//console.log("lalala:"+tracerules[traceruleElement].name);
					element=tracerules[traceruleElement];
					break;
				}
			}
			//console.log(element);
			var thisElement=element.elements[elePath[2]];
			//console.log(thisElement);
			
			if( thisElement.type == "activity" || thisElement.type == "decision")
			{	
				if(thisElement.type == "decision")
				{
					if( thisElement.executor =="User" )						
						{
							console.log( " 【decision "+num+" 】");
							//$returnWord+="User:"+elePath[2]+": 【decision "+num+" 】<br>";
						}
					else
						//console.log( "                            "+ElementList[ele].description+"\n");
						{
							console.log( "                            【decision "+num+" 】");
							//$returnWord+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
							//$returnWord+="System:"+elePath[2]+":【decision "+num+" 】<br>";
						}
				}
					
				if( thisElement.executor =="User" )
					{
						console.log( thisElement.description+"\n");
						$returnWord+="User:"+elePath[2]+":"+thisElement.description;
					}
				else
					{
						console.log( "                            "+thisElement.description+"\n");
						//$returnWord+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
						$returnWord+="System:"+elePath[2]+":"+thisElement.description;
					}
			}
			else
			{
				
				var beforeElement=content[ele].before;
				
				var beforePath=beforeElement.split(".");

				var element;
				for(traceruleElement in tracerules){
				
					if(tracerules[traceruleElement]._id==beforePath[0])
					{	
						element=tracerules[traceruleElement];
						break;
					}
				}
				
				var thisElement=element.elements[beforePath[2]];
				
				if(thisElement.executor=="User"){

					console.log(content[ele].description+"\n");
					$returnWord+="User:"+elePath[2]+":"+content[ele].description;
				}else{
					console.log( "                            "+content[ele].description+"\n");
					//$returnWord+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
					$returnWord+="System:"+elePath[2]+":"+content[ele].description;
				}

			}
			print[ele] = true;
			
			var nextsize=content[ele].next.length;
			if(nextsize!=0){
				
			for(var k=0; k<nextsize; k++)
			{
				if(content[ele].next[k]!="-2")
				{
					var tempstr=content[ele].next[k].split(".");
					$returnWord+="$"+tempstr[2];
				}
			}	
			$returnWord+="<br>";
			for(var k=0; k<nextsize; k++)
			{	
				
				if (content[ele].nextsize>1 && k>0)
				{
					//console.log("next: "+content[ele].next[k]);
					var nextPath=content[ele].next[k].split(".");
					
					var nextElement;
					for(traceruleElement in tracerules){
						if(tracerules[traceruleElement]._id==nextPath[0])
						{
							nextElement=tracerules[traceruleElement];
							break;
						}
					}
			
					var thisNextElement=nextElement.elements[nextPath[2]];

					if( thisNextElement.executor == "User")				
					{
						console.log( "【decision "+num+"'s other branches】");
						//$returnWord+=":【decision "+num+"'s other branches】"+"<br>";
						
					}
					else
					{
						console.log( "                            "+"【decision "+num+"'s other branches】1");
						//$returnWord+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
						//$returnWord+="【decision "+num+"'s other branches】"+"<br>";
					}
					//console.log("content[ele].next[k]:"+content[ele].next[k]);
				}
				
				//console.log("digui: "+Configuration.printusecase(content[ele].next[k],tracerules));
				//console.log(content[ele].id+":"+content[ele].next[k]);
				$returnWord=$returnWord+Configuration.printusecase(content[ele].next[k],tracerules);
			}
		  }
				
		}
	}
	num--;
	
	
	return 	$returnWord;
}


Configuration.generateUseCase = function generateUseCase(user,ID,tracerules,elementdepencys,features,configurations,callback){
	console.log("generateUseCase Start______________");
	var map = {};
	var mapguard_ID={};
	ucList=[];
	for(key in features){
		mapguard_ID[features[key].text]=features[key]._id;
		console.log(features[key].text+":"+mapguard_ID[features[key].text]);
	}
	var fmc = [];
	for(key in features){
		map[features[key]._id]=key;

		if(features[key].optionality=="Mandatory"){
			fmc[key]=true;
		}else{
			fmc[key]=false;
		}
	}
	var selectedElement=configurations[0].configuration.split("$");
	console.log("~~~~~~~~~");
	for(key in selectedElement){
		fmc[map[selectedElement[key]]]=true;
		console.log(selectedElement[key]+":"+map[selectedElement[key]]);
	}
	console.log("~~~~~~~~~");
	console.log("fmc:"+fmc);

	var filtered_Traceability = [];
	//console.log("length:"+tracerules.length+" _____________________");
	var traceruleID_key = {};
	for(key in tracerules){
		traceruleID_key[tracerules[key]._id]=key;
		var guard = tracerules[key].name;
		console.log("guard:"+guard);
		var guardvalue = true;
		var g=guard.split("∨");
		for(j=0;j<g.length;j++)
		{	
			if( g[j][0]=='¬' ){
				g[j]=g[j].substr(1,g[j].length-1);
				guardvalue = guardvalue && !fmc[map[mapguard_ID[g[j]]]];
			}else{
				guardvalue = guardvalue && fmc[map[mapguard_ID[g[j]]]];
			}
		}
		if(guardvalue)
			filtered_Traceability[key] = true;
		else
			filtered_Traceability[key] = false;
		console.log(key+":"+tracerules[key].name+":"+filtered_Traceability[key]);
	}

	var filtered_DList = [];
	console.log("--------------elementdepencys[i].depender-----------------");

	for(i=0;i<elementdepencys.length;i++)  
	{
		console.log("element name:"+elementdepencys[i].element);
		var tr_index = elementdepencys[i].dependee;

		if ( filtered_Traceability[traceruleID_key[tr_index]] )     //要是dependendee没有保留，后面的depender也不用改
		{
			dependency = 
			{
				dependee : tr_index,
				depender : []
			}

			for(key in elementdepencys[i].depender)
			{
				console.log("elementdepencys.key:"+key);
				var dependPath=key.split("_");
				if( filtered_Traceability[ traceruleID_key[dependPath[0]] ] )	
					dependency.depender.push(dependPath[0]);
			}
			filtered_DList.push( dependency );


			for (j=0; j<elementdepencys[i].depender.length; j++ )
			{
				if( filtered_Traceability[ DependencyList[i].depender[j] ] )
					dependency.depender.push( DependencyList[i].depender[j] );
			};

		}	
		
	}

	console.log("elementdepencys:_________________");
	console.log("filtered_DList:");
	for(mm in filtered_DList){
		console.log(filtered_DList[mm]);
	}

	var Graph = [];

	for(var i=0; i<filtered_DList.length; i++)
	{	
			var sizegraph = Graph.length;
			for(var j=0; j<sizegraph; j++)
			{
				if( Graph[j].tr_id == filtered_DList[i].dependee )
					break;				
			}
			
			if( j!=sizegraph )  //Graph中已经有tr_id=dependee的node了
			{
				var sizeoutput = Graph[j].output.length;
				var sizedepender = filtered_DList[i].depender.length;
				for(var k=sizeoutput; k < sizeoutput+sizedepender; k++)
					Graph[j].output[k] = filtered_DList[i].depender[k-sizeoutput]; //没有去重，直接填上的			

			}
			else 
			{
				node = 
				{
					tr_id : filtered_DList[i].dependee,
					output : filtered_DList[i].depender    //post order的，依赖此tr的tr
				}				
				Graph.push(node);
			}
	}

	console.log("Graph:");
	//console.log(Graph);

	var temporder = [];  //最后需要倒置
	var resultorder = [];
	var size = Graph.length;
	console.log("this is test Graph");
	for(i=0;i<size;i++)
	{
		//console.log("this is"+Graph[i].tr_id);
		for(var k=0; k<Graph[i].output.length; k++)
			{
				console.log("Graph["+i+"].output["+k+"]:"+Graph[i].output[k]);
			}	
		console.log("\n\n");
	}
	console.log("this is test Graph Over");

	var size = Graph.length;
	var tempSize;	
	while( temporder.length != size )
	{
		tempSize=temporder.length;
		//console.log(temporder.length+":"+size);
		for(var i=0; i<Graph.length; i++)
		{	
			if( Graph[i].output.length==0 )
			{			

				temporder.push(Graph[i].tr_id);//Graph[i] has changed
				for(var j=0; j<Graph.length; j++)  //删除tr_id作为depender
				{
					var length=Graph[j].output.length;
					for(var k=0; k<length; k++)
					{
						if( Graph[j].output[k] == Graph[i].tr_id )
						{
							for(var n=k; n<Graph[j].output.length-1; n++)
								Graph[j].output[n] = Graph[j].output[n+1];
							Graph[j].output.pop(); 
							k--;
							length--;
						}
					}

				}
				//	去掉所有tr已经排好序的graph[i].
				for(var m=i; m<Graph.length-1; m++)
					Graph[m]=Graph[m+1];
                Graph.pop();  //remove last element
				i--;
			}
		}

		if(tempSize==temporder.length&&temporder.length!=size){
			err="configuration wrong";
			callback(err,printStr);
			break;
		}

	}

	console.log("temporder:");
	console.log(temporder);
	resultorder = temporder;
	//console.log("resultorder:"+resultorder+"\n");

	var sizeorder = resultorder.length;
   
	for(var i=0; i<sizeorder; i++)                         //i
	{	//console.log(resultorder[i]);
		var tr = tracerules[ traceruleID_key[resultorder[i]]];
		var ops = tr.operations;
		var pos=tr.positions.split("$");
		
		for(keys in pos)                       //j
		{
			//console.log(content);
			console.log("keys:"+pos[keys]);
			var op=ops[pos[keys]];
			var type = ops[pos[keys]].type;
			console.log("op type:    "+op.type);
			//type=type+"s";
			switch (type)
			{
				case "C1":
					var usecasename=ops[pos[keys]].element.split(".");
				    var uc = 
				    {
				    	name : usecasename[2],
				    	usecase_id : ops[pos[keys]].element,
				    }
				   
				  console.log("usecasename:"+uc.name+" usecase_id:"+ops[pos[keys]].element);
					
				    
				    var ele;
							ele = 
							{
								
								next : [-2],
								beforesize : 0,
								nextsize : 0
							}	
							ele.id = usecasename[0]+"."+usecasename[1]+"."+usecasename[2]+"_Start";
							var elementList=op.element.split(".");
							ele.description=tr.elements[elementList[2]].description;
							//ele.description = ElementList[ op.element ].description; 
							content[ ele.id ] = ele;  //放入content中	
							 uc.start = 
				    		{
				    			next : ele
				    		}


							ele = 
							{
								before : [uc.start],
								beforesize : 0,
								nextsize : 0
							}	
							ele.id = usecasename[0]+"."+usecasename[1]+"."+usecasename[2]+"_End";
							elementList=op.element.split(".");
							ele.description=tr.elements[elementList[2]].description;
							//ele.description = ElementList[ op.element ].description; 
							content[ ele.id ] = ele;  //放入content中	
							  uc.end = 
				    		 {
				    				before : [ele],
				    				beforesize : 0
				    		 }
				    		 console.log("uc_usecase_id:"+uc.usecase_id);

				    		 ucList.push(uc);  

					break;

				case "C2":
					var ele;
							ele = 
							{
								before : [-1],
								next : [-2],
								beforesize : 0,
								nextsize : 0
							}	
							ele.id = op.element;

							var elementList=op.element.split(".");
							ele.description=tr.elements[elementList[2]].description;
							//ele.description = ElementList[ op.element ].description; 
							content[ ele.id ] = ele;  //放入content中	

					break;

				case "C3":
							var ele;
							ele = 
							{
								before : [-1],
								next : [-2],
								beforesize : 0,
								nextsize : 0
							}	
							ele.id = op.element;
							var elementList=op.element.split(".");
							ele.description=tr.elements[elementList[2]].description;
							//ele.description = ElementList[ op.element ].description; 
							content[ ele.id ] = ele;  //放入content中	
					break;

				case "C4":
							var ele;
							ele = 
							{
								before : [-1],
								next : [-2],
								beforesize : 0,
								nextsize : 0
							}	
							ele.id = op.element;
							var elementList=op.element.split(".");
							ele.description=tr.elements[elementList[2]].description;
							//ele.description = ElementList[ op.element ].description; 
							content[ ele.id ] = ele;  //放入content中	

					break;


				case "I2":     //insert seq after   pre

					var uc_index = 0;
					while( ucList[uc_index].usecase_id != op.usecaseElement )     //先确定是哪个uc当中的
					{
							console.log("usecase_id:"+uc_index);
							uc_index++;  
					}              
					console.log("usecase_id:"+uc_index);
					console.log("op.preElement:"+op.preElement);
					var pre = op.preElement;
					
					var post;
					
					console.log("content[pre].next[0]:"+content[pre].next[0]);

					if(content[pre].next[0]==-2)
						post=-2;
					else{
						post = content[pre].next[0];
						
					}
					

					var head = op.element;
					var tail = op.element;

					
					Configuration.singlepre(pre, head, uc_index);
					
					Configuration.multipost(post, tail, pre, uc_index);														
					

				    break;

				case "I3":   //insert seq before

					var uc_index = 0;
					while( ucList[uc_index].usecase_id != op.usecaseElement )     //先确定是哪个uc当中的
						uc_index++;                

					var post = op.postElement;
					
					var pre;
					
					pre = content[post].before[0];	
												
					var head = op.element;
					var tail = op.element;
              
					Configuration.multipre(post, head, uc_index);	
					//console.log("16  的presize"+content[16].beforesize);				
					Configuration.singlepost(post, tail, uc_index);	
						

				    break;

				case "I4":     //insert seq after with                
					
					var uc_index = 0;
					while( ucList[uc_index].usecase_id != op.usecaseElement )     //先确定是哪个uc当中的
						uc_index++;                
				
					var pre = op.condition;
					var post = content[pre].next[0];	//从condition的方向读next只有一个元素next[0]					

					
					var head = op.element;
					var tail = op.element;
							
	

					Configuration.singlepre(pre, head, uc_index);
					Configuration.multipost(post, tail, pre, uc_index);		

				    break;

				

				case "I5":  //insert seq before post with

					var uc_index = 0;
					while( ucList[uc_index].usecase_id != op.usecaseElement )     //先确定是哪个uc当中的
						uc_index++;                
					
					var post = op.postactivity;
					

					var pre;

					for(keys in content)
					{
						if(content[keys].next[0]==post)
						{
							pre=content[keys].id;
							break;
						}
					}
					
					var head = op.element;
					var tail = op.element;

					Configuration.singlepre(pre, head, uc_index);
					Configuration.multipost(post, tail, pre, uc_index);	
				    break;

				case "I6":  //insert dec after  只是：post可能有多条入边
  
					var uc_index = 0;
					console.log(op);
					while( ucList[uc_index].usecase_id != op.usecaseElement )     //先确定是哪个uc当中的
						uc_index++;   

					var pre = op.preactivity;
					

					var post;
					if( pre ==-1)					
						post = ucList[uc_index].start.next;
					else
						post = content[pre].next[0];   
					
					var last;

					content[op.element].beforesize=0;
					content[op.element].nextsize=0;
					content[op.element].before=[];
					content[op.element].next=[];

 

					Configuration.singlepre(pre, op.element, uc_index);    // dec的连接都放在branches的前边

					content[op.maincondition].before=op.element;
					content[op.maincondition].next=[];
					content[op.maincondition].beforesize=1;
					content[op.maincondition].nextsize=0;

					content[op.element].next[0]=op.maincondition;
					content[op.element].nextsize++;

					Configuration.multipost(post,op.maincondition, pre, uc_index);

					content[op.supcondition].before=op.element;
					content[op.supcondition].next=[];
					content[op.supcondition].beforesize=1;
					content[op.supcondition].nextsize=0;

					content[op.element].next[1]=op.supcondition;
					content[op.element].nextsize++;

					content[op.insertactivity].beforesize=1;
					content[op.insertactivity].nextsize=0;
					content[op.insertactivity].before[0]=op.supcondition;

					content[op.supcondition].next[0]=op.insertactivity;
					content[op.supcondition].nextsize++;

					var bpost = op.targetactivity;
					

					Configuration.postdec(bpost, op.insertactivity, uc_index);
											
				    break;
				
				case "I7":  //insert dec after with

					var uc_index = 0;
					console.log(op);
					while( ucList[uc_index].usecase_id != op.usecaseElement )     //先确定是哪个uc当中的
						uc_index++;                
					
					var pre = op.insertcondition;
					var post = content[pre].next[0];	//从condition的方向读next只有一个元素next[0]					

 					content[op.element].beforesize=0;
					content[op.element].nextsize=0;
					content[op.element].before=[];
					content[op.element].next=[];


					Configuration.singlepre(pre, op.element, uc_index);    // dec的连接都放在branches的前边
					
					content[op.maincondition].beforesize=1;
					content[op.maincondition].nextsize=0;
					content[op.maincondition].before=op.element;
					content[op.maincondition].next=[];

					content[op.element].next[0]=op.maincondition;
					content[op.element].nextsize=1;

					Configuration.multipost(post, op.maincondition, pre, uc_index);
					
					content[op.supcondition].beforesize=1;
					content[op.supcondition].nextsize=0;
					content[op.supcondition].before=op.element;
					content[op.supcondition].next=[];

					content[op.element].next[1]=op.supcondition;
					content[op.element].nextsize=2;
						


					content[op.insertactivity].beforesize=1;
					content[op.insertactivity].nextsize=0;
					content[op.insertactivity].before[0]=op.supcondition;
					content[op.insertactivity].next=[];

					content[op.supcondition].next[0]=op.insertactivity;
					content[op.supcondition].nextsize++;

					var bpost = op.targetdecision;

					Configuration.postdec(bpost, op.insertactivity, uc_index);
									
				    break;

				case "I8":

					var uc_index = 0;
					
					while( ucList[uc_index].usecase_id != op.usecaseElement )     //先确定是哪个uc当中的
						uc_index++;   

					var post = op.postactivity;
					
					
					var pre;
					if( post ==-2)					
						pre = ucList[uc_index].end.before[0];
					else
						pre = content[post].before[0];

					content[op.element].beforesize=0;
					content[op.element].nextsize=0;
					content[op.element].before=[];
					content[op.element].next=[];

 					content[op.element].next[0]=op.condition1;
 					content[op.element].nextsize++;
 					content[op.element].next[1]=op.condition2;
 					content[op.element].nextsize++;

					content[op.condition1].before=op.element;
					content[op.condition1].next=[];
					content[op.condition1].beforesize=1;
					content[op.condition1].nextsize=0;

					content[op.target1].beforesize=1;
					content[op.target1].nextsize=0;
					content[op.target1].before[0]=op.condition1;

					Configuration.singlepost(op.target1, op.condition1, uc_index);

					content[op.target1].next[0]=post;
					content[op.target1].nextsize++;

					content[op.postactivity].next[0]=op.target1;
					content[op.postactivity].beforesize=1;


					content[op.condition2].before=op.element;
					content[op.condition2].next=[];
					content[op.condition2].beforesize=1;
					content[op.condition2].nextsize=0;

					content[op.element].next[1]=op.condition2;
					content[op.element].nextsize++;

				    Configuration.multipost(op.target2,op.condition2,uc_index);



					

					break;

				case "I9":  //insert dec before
  				
					var uc_index = 0;
					console.log(op);
					while( ucList[uc_index].usecase_id != op.usecaseElement )     //先确定是哪个uc当中的
						uc_index++;   

					var post = op.postactivity;
					
					
					var pre;
					if( post ==-2)					
						pre = ucList[uc_index].end.before[0];
					else
						pre = content[post].before[0];

					content[op.element].beforesize=0;
					content[op.element].nextsize=0;
					content[op.element].before=[];
					content[op.element].next=[];

 

					Configuration.multipre(post, op.element, uc_index);    // dec的连接都放在branches的前边


					content[op.maincondition].before=op.element;
					content[op.maincondition].next=[];
					content[op.maincondition].beforesize=1;
					content[op.maincondition].nextsize=0;

					content[op.element].next[0]=op.maincondition;
					content[op.element].nextsize++;

					Configuration.singlepost(post, op.maincondition, uc_index);

					content[op.supcondition].before=op.element;
					content[op.supcondition].next=[];
					content[op.supcondition].beforesize=1;
					content[op.supcondition].nextsize=0;

					content[op.element].next[1]=op.supcondition;
					content[op.element].nextsize++;

					content[op.insertactivity].beforesize=1;
					content[op.insertactivity].nextsize=0;
					content[op.insertactivity].before[0]=op.supcondition;

					content[op.supcondition].next[0]=op.insertactivity;
					content[op.supcondition].nextsize++;
					

					Configuration.postdec(op.targetdecision, op.insertactivity, uc_index);

				    break;

				case "I10":  //insert dec before with
					
					var uc_index = 0;
					console.log(op);
					while( ucList[uc_index].usecase_id != op.usecaseElement )     //先确定是哪个uc当中的
						uc_index++;                
					
					var post = op.postactivity;
					
					var pre;
						for(keys in content)
					{
						if(content[keys].next[0]==post)
						{
							pre=content[keys].id;
							break;
						}
					}

 					content[op.element].beforesize=0;
					content[op.element].nextsize=0;
					content[op.element].before=[];
					content[op.element].next=[];

					Configuration.singlepre(pre, op.element, uc_index);    // dec的连接都放在branches的前边
					
					content[op.maincondition].beforesize=1;
					content[op.maincondition].nextsize=0;
					content[op.maincondition].before=op.element;
					content[op.maincondition].next=[];

					content[op.element].next[0]=op.maincondition;
					content[op.element].nextsize=1;


					Configuration.multipost(post, op.maincondition, pre, uc_index);
					
					content[op.supcondition].beforesize=1;
					content[op.supcondition].nextsize=0;
					content[op.supcondition].before=op.element;
					content[op.supcondition].next=[];

					content[op.element].next[1]=op.supcondition;
					content[op.element].nextsize=2;
						


					content[op.insertactivity].beforesize=1;
					content[op.insertactivity].nextsize=0;
					content[op.insertactivity].before[0]=op.supcondition;
					content[op.insertactivity].next=[];

					content[op.supcondition].next[0]=op.insertactivity;
					content[op.supcondition].nextsize++;

					var bpost = op.targetdecision;

					Configuration.postdec(bpost, op.insertactivity, uc_index);

				default:
			}
		}
	}
	num=0;
	console.log("what-----------------------"+ucList.length);
	printStr="";
	theusecasename="";
	for(var i=0; i<ucList.length; i++)
	{
		console.log("No."+i);
		var uc = ucList[i];
		//var ele = uc.start.next;
		var ele = uc.start.next.id;
		//console.log("ele:"+uc.start);
		var seq=0;
		var first;
		for(key in content)
		{		
			//console.log("content["+key+"]:"+content[key]);
			if(seq==0){
					first=content[key].id;
					seq++;
				}
				print[key] = false;
				
		}
		//ele=first;

		console.log("\n\n\n\nUse case: "+ uc.name);
		console.log("Use Case start:"+ele);
		printStr+="Use case: "+ uc.name+"<br>";
		if(i!=0)
			theusecasename+="$";
		theusecasename+=uc.name;
		console.log("----------------------------------");
		printStr+=Configuration.printusecase(ele,tracerules);
		console.log("----------------------------------");
	}

	var s1="undefined";
	var s2="";
	printStr=printStr.replace(new RegExp(s1,"gm"),s2);

	console.log("---------printStr---------");
	console.log(printStr);
	console.log("--------------------------");
	callback(null,printStr,theusecasename);


}


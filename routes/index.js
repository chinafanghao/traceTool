
/*
 * GET home page.
 */

var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');
var Tracerule = require('../models/tracerule.js');
var Guardlist = require('../models/guardlist.js');
var ElementDepency = require('../models/elementdepency.js');
var Configuration=require('../models/configuration.js');
var async = require('async'); 
var Feature = require('../models/feature.js');
var Constraint = require('../models/constraint.js');
var Project = require('../models/project.js')

exports.index = function(req, res){
	console.log("user:"+req.session.user);
	console.log("exports.index");
	Post.get(null, function(err, posts) {
		console.log("start");
		if (err) {
			posts = [];
		}

		if(req.session.user != null)
		{	
			console.log("11111");
			Project.get(req.session.user.name,function(err,projects){
					if(err){
						projects=[];
					}
						res.render('index', {
							title: '首页',
							posts : posts,
							projects : projects,
							current_id: "",
							user : req.session.user,
							success : req.flash('success').toString(),
							error : req.flash('error').toString()
						});
			});
		}else{
			console.log("222222");
			res.render('index', {
							title: '首页',
							posts : posts,
							current_id: "",
							user : null,
							success : req.flash('success').toString(),
							error : req.flash('error').toString()
						});
		}
	});
};


exports.user = function(req, res) {
	User.get(req.params.user, function(err, user) {
		if (!user) {
			req.flash('error', '用户不存在');
			return res.redirect('/');
		}
		Post.get(user.name, function(err, posts) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			res.render('user', {
				title: user.name,
				posts: posts,
				user : req.session.user,
				success : req.flash('success').toString(),
				error : req.flash('error').toString()
			});
		});
	});
};

exports.post = function(req, res) {
	var currentUser = req.session.user;console.log(req.body.featurename+"$");
	var post = new Post(currentUser.name,req.body.featurename,req.body.selfName,req.body.optionality,req.body.post,req.body.level,req.body.parents,req.body.time,req.body.types,req.body.contents);
	post.save(function(err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		req.flash('success', '发表成功');
		res.redirect('/u/' + currentUser.name);
	});
};

exports.del = function(req,res){
		Post.del(req.session.user.name, req.body.featurename,req.body.types,function(err, posts) {
			
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			res.render('user', {
				title: req.session.user.name,
				posts: posts,
				user : req.session.user,
				success : req.flash('success').toString(),
				error : req.flash('error').toString()
			});
		});
	
}

exports.reg = function(req, res) {
	res.render('reg', {
		title: '用户注册',
		user : req.session.user,
		success : req.flash('success').toString(),
		error : req.flash('error').toString()
    });
};

exports.doReg = function(req, res) {
	//检查密码
    if (req.body['password-repeat'] != req.body['password']) {
		req.flash('error', '两次输入的密码不一致');
		return res.redirect('/reg');
    }
  
    //生成md5的密码
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    
    var newUser = new User({
		name: req.body.username,
		password: password,
    });
    
    //检查用户名是否已经存在
	User.get(newUser.name, function(err, user) {
		if (user)
			err = 'Username already exists.';
		if (err) {
			req.flash('error', err);
			return res.redirect('/reg');
		}
		//如果不存在則新增用戶
		newUser.save(function(err) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/reg');
			}
			req.session.user = newUser;
			req.flash('success', '注册成功');
			res.redirect('/');
		});
	});
};

exports.login = function(req, res) {
	res.render('login', {
		title: 'Login',
		user : req.session.user,
		success : req.flash('success').toString(),
		error : req.flash('error').toString()
    });
};

exports.F = function(req, res) {
	 console.log("exports.F:"+req.params.content);
	 
	res.render('F', {
		title: 'Feature Model',
		user : req.session.user,
		projectID : req.params.content,
		success : req.flash('success').toString(),
		error : req.flash('error').toString()
    });
};

/*
exports.T = function(req, res) {console.log(req.params.current_guard);
	Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		res.render('T', {
			title: 'Traceability',
			posts : posts,
			user : req.session.user,
			current_guard : req.params.current_guard,
			success : req.flash('success').toString(),
			error : req.flash('error').toString()
		});
	});
};
*/
/*
exports.T = function(req, res) {console.log(req.params.current_guard);
	Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
	  ElementDepency.get(req.session.user.name,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}
	  		else{
	  		//	var aaa=JSON.stringify(elementdepencys);
	  		//	console.log(aaa);
	  		}
		Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.get(req.session.user.name,req.params.current_guard, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				//var aaa=JSON.stringify(tracerules[0].operations);
				//console.log(req.session.user.name+"+"+req.params.current_guard+"+"+aaa+"+"+tracerules[0].position);
				if(guardlists.length>0){
					console.log("there");
				   if(req.params.current_guard!=undefined){

					res.render('T', {
						title : 'Traceability',
						posts : posts,
						guardlists : guardlists,
						tracerules : tracerules,
						elementdepencys : elementdepencys,
						user : req.session.user,
						current_guard : req.params.current_guard,
						success : req.flash('success').toString(),
						error : req.flash('error').toString()
						});	
				}else{
					res.render('TTT', {
						title : 'Traceability',
						posts : posts,
						guardlists : guardlists,
						tracerules : tracerules,
						elementdepencys : elementdepencys,
						user : req.session.user,
						current_guard : req.params.current_guard,
						success : req.flash('success').toString(),
						error : req.flash('error').toString()
						});	
				}
			  }else{
			  	console.log("here");
			  		res.render('TT', {
						title : 'Traceability',
						posts : posts,
						guardlists : guardlists,
						tracerules : tracerules,
						elementdepencys : elementdepencys,
						user : req.session.user,
						current_guard : req.params.current_guard,
						success : req.flash('success').toString(),
						error : req.flash('error').toString()
				});
			  }
			});
		});
	});
  });	  
};
*/

exports.T = function(req, res) {
	console.log("T route:"+req.params.content);
	var $temp=req.params.content;
	var $projectID;
	var $current_guard;
	//console.log("index:"+$temp.indexOf("_"));
	if($temp.indexOf("_")==-1)
	 {	
	 	 $projectID=$temp;
	 	 $current_guard=null;
	 }
	else{
		
		var tempContent=$temp.split("_");
		$projectID=tempContent[0];
		$current_guard=tempContent[1];
	}
	//console.log("current_guard:"+$current_guard);
	Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
	  ElementDepency.get(req.session.user.name,$projectID,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}
	  		else{
	  		//	var aaa=JSON.stringify(elementdepencys);
	  		//	console.log(aaa);
	  		}
		Guardlist.get(req.session.user.name,$projectID,function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.get(req.session.user.name,$projectID,req.params.current_guard, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				//var aaa=JSON.stringify(tracerules[0].operations);
				//console.log(req.session.user.name+"+"+req.params.current_guard+"+"+aaa+"+"+tracerules[0].position);
				console.log("guardlists.length:"+guardlists.length);
				if(guardlists.length>0){
					console.log("111111");
				   if($current_guard!=null){

					res.render('T', {
						title : 'Traceability',
						posts : posts,
						guardlists : guardlists,
						tracerules : tracerules,
						elementdepencys : elementdepencys,
						user : req.session.user,
						projectID:$projectID,
						current_guard : $current_guard,
						success : req.flash('success').toString(),
						error : req.flash('error').toString()
						});	
				}else{console.log("222222");
					res.render('TTT', {
						title : 'Traceability',
						posts : posts,
						guardlists : guardlists,
						tracerules : tracerules,
						elementdepencys : elementdepencys,
						user : req.session.user,
						projectID:$projectID,
						current_guard : $current_guard,
						success : req.flash('success').toString(),
						error : req.flash('error').toString()
						});	
				}
			  }else{
			  	console.log("3333333");
			  		res.render('TT', {
						title : 'Traceability',
						posts : posts,
						guardlists : guardlists,
						tracerules : tracerules,
						elementdepencys : elementdepencys,
						user : req.session.user,
						projectID:$projectID,
						current_guard : $current_guard,
						success : req.flash('success').toString(),
						error : req.flash('error').toString()
				});
			  }
			});
		});
	});
  });	  
};



exports.doT = function(req, res) {

 var selfname=req.body.selfname;
 var user=req.session.user.name;
 var editID=req.body.edit_guard_id;
 var current_guard_id=req.body.current_guard_id;
 var positions=req.body.operation_position;
 //console.log("doT: selfname:"+selfname+" user:"+user+" id:"+id+" guard:"+current_guard_id);

	 
		Guardlist.updateSelfname(req.session.user.name, editID,selfname,function(err, guardlists) {
			if (err) {
				guradlists = [];
			}
		 Tracerule.SavePositions(req.session.user.name,current_guard_id,positions,function(err,tracerules){
			Tracerule.updateSelfname(selfname,req.session.user.name,editID, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
					res.send(tracerules);
			});

		  });

		});
	  
	
	//res.redirect('/T');
};

exports.doTZero = function(req, res) {

 var selfname=req.body.selfname;
 var user=req.session.user.name;
 var editID=req.body.edit_guard_id;
 
		Guardlist.updateSelfname(req.session.user.name, editID,selfname,function(err, guardlists) {
			if (err) {
				guradlists = [];
			}
		 
			Tracerule.updateSelfname(selfname,req.session.user.name,editID, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
					res.send(tracerules);
			});

		 

		});
	  
	
	//res.redirect('/T');
};


exports.deleteTraceRule = function(req, res) {

 console.log(req.params.content);
 	
 	var username=req.session.user.name;
 	var deleteID=req.body.deleteID;
 	var positions=req.body.operation_position;
 	var current_guard_id=req.body.current_guard_id;
 	var projectID=req.body.projectID;
 	ElementDepency.returnDeleteDependency(username,deleteID,function(err,showDepend){
 		if(showDepend.length>0){
 			err = 'Certain trace rules depend to this trace rule';
			req.flash('error', err);
			return res.redirect('/T/'+current_guard_id);
 		}else{
 			Post.get(null, function(err, posts) {
				if (err) {
					posts = [];
				}
	 		
	 		 ElementDepency.removeTraceRule(req.session.user.name,deleteID,function(err,elementdepencys){
	  			if(err){
	  				elementdepencys=[];
	  			}
				Guardlist.removeTraceRule(req.session.user.name,deleteID,function(err, guardlists) {
					if (err) {
						guradlists = [];
					}

					Tracerule.removeTraceRule(username,deleteID, function(err, tracerules) {
						if (err) {
							tracerules = [];
						}
				
					res.send(tracerules);
			});
		});
	  });
	})
 		}

 	})
 /*Tracerule.returnElements(username,deleteID,function(err,showElement){
 		var jStr=JSON.stringify(showElement);
 		if(jStr=="{}")
 		{
 			
			return res.redirect('/T/'+current_guard_id);
			
 		}
 		else{
 			err = 'This trace rule still has operations';
			req.flash('error', err);
			return res.redirect('/T/'+current_guard_id);
 		}

 	});*/
};

exports.deleteTraceRuleZero = function(req, res) {

 console.log(req.params.content);
 	
 	var username=req.session.user.name;
 	var deleteID=req.body.deleteID;
 	var projectID=req.body.projectID;
 	ElementDepency.returnDeleteDependency(username,deleteID,function(err,showDepend){
 		if(showDepend.length>0){
 			err = 'Certain trace rules depend to this trace rule';
			req.flash('error', err);
			return res.redirect('/T/'+current_guard_id);
 		}else{
	 		
	 		 ElementDepency.removeTraceRule(req.session.user.name,deleteID,function(err,elementdepencys){
	  			if(err){
	  				elementdepencys=[];
	  			}
				Guardlist.removeTraceRule(req.session.user.name,deleteID,function(err, guardlists) {
					if (err) {
						guradlists = [];
					}

					Tracerule.removeTraceRule(username,deleteID, function(err, tracerules) {
						if (err) {
							tracerules = [];
						}
				
					res.send(tracerules);
			});
		});
	  });
	
 		}

 	})
};


exports.createActivity = function(req, res){
	 //console.log(req.params.content);
 	 //var param=req.params.content.split("分");
 	 var user=req.session.user.name;
 	 
 	 var activityname=req.body.activityname;
 	 var activitydescription=req.body.activitydescription;
 	 var activityexecutor=req.body.activityexecutor;
 	 //var activityvirtual=param[5];
 	 var current_accordion=req.body.current_accordion;
 	 //var positions=param[7].split("位置");
 	 var positions=req.body.operation_position;
	 var current_guard_id=req.body.current_guard_id;
	 var projectID=req.body.projectID;
     var type="activity";
     var id=current_guard_id;
 	 //console.log(user+" "+id+" "+activityname+" "+activitydescription+" "+activityexecutor+" position:"+positions);
 	 
 	 ElementDepency.get(req.session.user.name,projectID,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}
	  		for(key in elementdepencys){
	  			if(elementdepencys[key].element==activityname)
	  			{
	  				err = 'There are duplicate names of this activity name ( '+activityname+' ), please change another name';
	  				break;
	  			}
	  		}
	  		if (err) {
			req.flash('error', err);
			return res.redirect('/T/'+current_guard_id);
		}else{
 	
		 var newDepency = new ElementDepency({
					user: req.session.user.name,
					element:activityname,
					dependee:current_guard_id
    		});
		  ElementDepency.saveDependee(req.session.user.name,activityname,current_guard_id,type,projectID,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
			Tracerule.createActivity(req.session.user.name,id,activityname,activitydescription,activityexecutor,current_accordion,positions, function(err, tracerules) {
				if (err) {
					tracerules = [];
				}
				
				
				res.send({"createActivity":1});	
			});
		
	
   });
 
	}
 }); // elementdepency.get
}

exports.EditActivity=function(req,res){
	Tracerule.EditActivity(req.session.user.name, req.body.operationName,req.body.activityName,req.body.activityDescription,req.body.activityExecutor,req.body.activityVirual,req.body.operation_position,req.body.current_guard_id,function(err, trace) {
		console.log("edit Activity success!");
		});
};

exports.createUseCase = function(req, res){
	
 	 var user=req.session.user.name;
 	
 	 var usecasename=req.body.usecasename;
 	 var usecasedescription=req.body.usecasedescription;
 	 var positions=req.body.operation_position;
	 var current_guard_id=req.body.current_guard_id;
	 var projectID=req.body.projectID;
	 var type="UseCase";

	 ElementDepency.get(req.session.user.name,projectID,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}
	  		for(key in elementdepencys){
	  			if(elementdepencys[key].element==usecasename)
	  			{
	  				err = 'There are duplicate names of this use case name ( '+usecasename+' ), please change another name';
	  				break;
	  			}
	  		}
	  		if (err) {
			req.flash('error', err);
			return res.redirect('/T/'+current_guard_id);
			}else{

	  ElementDepency.saveDependee(req.session.user.name,usecasename,current_guard_id,type,projectID,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		var $startname=usecasename+"_Start";
	  		var $endname=usecasename+"_End";
	  		type="activity";
	  	ElementDepency.saveDependee(req.session.user.name,$startname,current_guard_id,type,projectID,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}

	  	  ElementDepency.saveDependee(req.session.user.name,$endname,current_guard_id,type,projectID,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}
			Tracerule.createUseCase(req.session.user.name,current_guard_id,usecasename,usecasedescription,$startname,$endname,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
				res.send({"createusecase":1});
			});
		});
	  });
	});

 	}
 });
}

exports.createDecision = function(req, res){
	 //console.log(req.params.content);
 	 //var param=req.params.content.split("分");
 	 var user=req.session.user.name;
 	 var id=req.body.current_guard_id;
 	 var decisionname=req.body.decisionname;
 	 var decisiondescription=req.body.decisiondescription;
 	 var decisionexecutor=req.body.decisionexecutor;
 	
 	 var positions=req.body.operation_position;
	 var current_guard_id=id;
	 var projectID=req.body.projectID;
	 var type="decision";

 	 //console.log(user+" "+id+" "+decisionname+" "+decisiondescription+" "+decisionexecutor+" "+" position:"+positions);
 	 
 	 ElementDepency.get(req.session.user.name,projectID,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}
	  		for(key in elementdepencys){
	  			if(elementdepencys[key].element==decisionname)
	  			{
	  				err = 'There are duplicate names of this decision name ( '+decisionname+' ), please change another name';
	  				break;
	  			}
	  		}
	  		if (err) {
			req.flash('error', err);
			return res.redirect('/T/'+current_guard_id);
		}else{

 	
	  ElementDepency.saveDependee(req.session.user.name,decisionname,current_guard_id,type,projectID,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}

		Tracerule.createDecision(req.session.user.name,id,decisionname,decisiondescription,decisionexecutor,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
				res.send({"createDecision":1});
			});
		
	});
 
 	}
 });
}

exports.createCondition = function(req, res){
	 //console.log("Condition:"+req.params.content);
 	 //var param=req.params.content.split("分");
 	 console.log("createCondition");
 	 var user=req.session.user.name;
 	 var id=req.body.current_guard_id;
 	 var conditionname=req.body.conditionname;
 	 var conditiondescription=req.body.conditiondescription;
 	 var positions=req.body.operation_position;
	 var current_guard_id=id;
	 var projectID=req.body.projectID;
	 var type="condition";

	 ElementDepency.get(req.session.user.name,projectID,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}
	  		for(key in elementdepencys){
	  			if(elementdepencys[key].element==conditionname)
	  			{
	  				err = 'There are duplicate names of this condition name( '+conditionname+' ), please change another name';
	  				break;
	  			}
	  		}
	  		if (err) {
	  			console.log("err");
			req.flash('error', err);
			return res.redirect('/T/'+current_guard_id);
		}else{

      console.log("here");
	  ElementDepency.saveDependee(req.session.user.name,conditionname,current_guard_id,type,projectID,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}

			Tracerule.createCondition(req.session.user.name,id,conditionname,conditiondescription,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
				res.send({"createCondition":1});	
			});
		
	});

 }
});
}

exports.insertBetween = function(req, res){
	 console.log("insertBetween:"+req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var TarAct=param[2];
 	 var PreAct=param[3];
 	 var PostAct=param[4];
	 var UseCase=param[5];
	 var positions=param[6];
	 var current_guard_id=param[7];
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
	  ElementDepency.saveInsertBetween(req.session.user.name,TarAct,PreAct,PostAct,UseCase,current_guard_id,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}
 	 	Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.saveInsertBetween(req.session.user.name,id,TarAct,PreAct,PostAct,UseCase,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
				
					res.render('T', {
						title : 'Traceability',
						posts : posts,
						guardlists : guardlists,
						tracerules : tracerules,
						elementdepencys : elementdepencys,
						user : req.session.user,
						current_guard : current_guard_id,
						success : req.flash('success').toString(),
						error : req.flash('error').toString()
				});	
			});
		});
	});
  });
}

exports.insertActAfterPre = function(req, res){
	 //console.log("insertActAfterPre:"+req.params.content);
 	 //var param=req.params.content.split("分");
 	 var user=req.session.user.name;
 	 var id=req.body.current_guard_id;
 	 var TarAct=req.body.TarAct;
 	 var PreAct=req.body.PreAct;
	 var UseCase=req.body.UseCase;
	 var positions=req.body.operation_position;
	 var current_guard_id=id;
     
	  ElementDepency.saveInsertActAfterPre(req.session.user.name,TarAct,PreAct,UseCase,current_guard_id,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}

			Tracerule.saveInsertActAfterPre(req.session.user.name,id,TarAct,PreAct,UseCase,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
				res.send({"saveInsertActAfterPre":1});
			});
	});
}

exports.insertActBeforePost = function(req, res){
	 
 	 //var param=req.params.content.split("分");
 	 var user=req.session.user.name;
 	 var id=req.body.current_guard_id;
 	 var TarAct=req.body.TarAct;
 	 var PostAct=req.body.PostAct;
	 var UseCase=req.body.UseCase;
	 var positions=req.body.operation_position;
	 var current_guard_id=id;

	  ElementDepency.saveInsertActBeforePost(req.session.user.name,TarAct,PostAct,UseCase,current_guard_id,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}
 
			Tracerule.saveInsertActBeforePost(req.session.user.name,id,TarAct,PostAct,UseCase,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
			res.send({"saveInsertActBeforePost":1});
			});
	});
}

exports.insertActAfterDecCon = function(req, res){
	 
 	 var user=req.session.user.name;
 	 var id=req.body.current_guard_id;
 	 var TarAct=req.body.TarAct;
 	 var Decision=req.body.Dec;
 	 var Condition=req.body.Con;
	 var UseCase=req.body.UC;
	 var positions=req.body.operation_position;
	 var current_guard_id=id;
 	
	  ElementDepency.saveInsertActAfterDecCon(req.session.user.name,TarAct,Decision,Condition,UseCase,current_guard_id,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}

			Tracerule.saveInsertActAfterDecCon(req.session.user.name,id,TarAct,Decision,Condition,UseCase,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
			res.send({"saveInsertActAfterDecCon":1});
			});
	});
}

exports.insertActBeforeActCon = function(req, res){
	 
 	 var user=req.session.user.name;
 	 var id=req.body.current_guard_id;
 	 var TarAct=req.body.TarAct;
 	 var PostAct=req.body.PostAct;
 	 var Condition=req.body.Con;
	 var UseCase=req.body.UC;
	 var positions=req.body.operation_position;
	 var current_guard_id=id;
 	
	  ElementDepency.saveInsertActBeforeActCon(req.session.user.name,TarAct,PostAct,Condition,UseCase,current_guard_id,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}

			Tracerule.saveInsertActBeforeActCon(req.session.user.name,id,TarAct,PostAct,Condition,UseCase,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
			res.send({"saveInsertActBeforeActCon":1});
			});
	});
}

exports.insertDecAfterAct = function(req, res){
	 
 	console.log("insertDecAfterAct");

 	 var user=req.session.user.name;
 	 var id=req.body.current_guard_id;
 	 var TarDec=req.body.TartDec;
 	 var PreAct=req.body.PreAct;
 	 var MainBranchCon=req.body.MainBranchCon;
 	 var SupBranchCon=req.body.SupBranchCon;
 	 var InserAct=req.body.InserAct;
 	 var TargetAct=req.body.TargetAct;
	 var UseCase=req.body.UC;
	 var positions=req.body.operation_position;
	 var current_guard_id=id;

	 console.log(user+" "+id+" "+TarDec+" "+PreAct+" "+MainBranchCon+" "+SupBranchCon+" "+InserAct+" "+TargetAct+" "+UseCase+" "+positions+" "+current_guard_id);

	  ElementDepency.saveInsertDecAfterActCon(req.session.user.name,TarDec,PreAct,MainBranchCon,SupBranchCon,InserAct,TargetAct,UseCase,current_guard_id,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}

			Tracerule.saveInsertDecAfterActCon(req.session.user.name,id,TarDec,PreAct,MainBranchCon,SupBranchCon,InserAct,TargetAct,UseCase,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
			res.send({"saveInsertDecAfterActCon":1});
			});
	});
}

exports.insertDecAfterDecCon = function(req, res){
	 
 	 var user=req.session.user.name;
 	 var id=req.body.current_guard_id;
 	 var TarDec=req.body.TartDec;
 	 var InserDec=req.body.InsertDec;
 	 var InserCon=req.body.InsertCon;
 	 var MainBranchCon=req.body.MainBranchCon;
 	 var SupBranchCon=req.body.SupBranchCon;
 	 var InserAct=req.body.InserAct;
 	 var TargetDec=req.body.TargetDec;
	 var UseCase=req.body.UC;
	 var positions=req.body.operation_position;
	 var current_guard_id=id;
 	console.log("insertDecAfterDecCon!!!!");
	  ElementDepency.saveInsertDecAfterDecCon(req.session.user.name,TarDec,InserDec,InserCon,MainBranchCon,SupBranchCon,InserAct,TargetDec,UseCase,current_guard_id,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}

			Tracerule.saveInsertDecAfterDecCon(req.session.user.name,id,TarDec,InserDec,InserCon,MainBranchCon,SupBranchCon,InserAct,TargetDec,UseCase,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
			res.send({"saveInsertDecAfterDecCon":1});
			});
	});
}

exports.insertDecBeforeAct = function(req, res){
	 
 	 var user=req.session.user.name;
 	 var id=req.body.current_guard_id;
 	 var TarDec=req.body.TartDec;
 	 var PostAct=req.body.PostAct;
 	 var Con1=req.body.Con1;
 	 var Tar1=req.body.Tar1;
 	 var Con2=req.body.Con2;
 	 var Tar2=req.body.Tar2;
	 var UseCase=req.body.UC;
	 var positions=req.body.operation_position;
	 var current_guard_id=id;

	  ElementDepency.saveInsertDecBeforeAct(req.session.user.name,TarDec,PostAct,Con1,Tar1,Con2,Tar2,UseCase,current_guard_id,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}

			Tracerule.saveInsertDecBeforeAct(req.session.user.name,id,TarDec,PostAct,Con1,Tar1,Con2,Tar2,UseCase,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
			res.send({"saveInsertDecBeforeAct":1});
			});
	});
}


exports.insertDecBeforeActWith = function(req, res){
	 
 	 
 	 var user=req.session.user.name;
 	 var id=req.body.current_guard_id;
 	 var TarDec=req.body.TartDec;
 	 var PostAct=req.body.PostAct;
 	 var MainBranchCon=req.body.MainBranchCon;
 	 var SupBranchCon=req.body.SupBranchCon;
 	 var InserAct=req.body.InserAct;
 	 var TargetDec=req.body.TargetDec;
	 var UseCase=req.body.UC;
	 var positions=req.body.operation_position;
	 var current_guard_id=id;
 
	  ElementDepency.saveInsertDecBeforeActWith(req.session.user.name,TarDec,PostAct,MainBranchCon,SupBranchCon,InserAct,TargetDec,UseCase,current_guard_id,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}

			Tracerule.saveInsertDecBeforeActWith(req.session.user.name,id,TarDec,PostAct,MainBranchCon,SupBranchCon,InserAct,TargetDec,UseCase,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
			res.send({"saveInsertDecBeforeActWith":1});
			});
	});
}

exports.insertDecBeforeDecCon = function(req, res){
	 
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var TarDec=param[2];
 	 var InserDec=param[3];
 	 var InserCon=param[4];
 	 var MainBranchCon=param[5];
 	 var SupBranchCon=param[6];
 	 var InserAct=param[7];
 	 var TargetDec=param[8];
	 var UseCase=param[9];
	 var positions=param[10];
	 var current_guard_id=param[11];
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
	  ElementDepency.saveInsertDecBeforeDecCon(req.session.user.name,TarDec,InserDec,InserCon,MainBranchCon,SupBranchCon,InserAct,TargetDec,UseCase,current_guard_id,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}
 	 	Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.saveInsertDecBeforeDecCon(req.session.user.name,id,TarDec,InserDec,InserCon,MainBranchCon,SupBranchCon,InserAct,TargetDec,UseCase,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
				
					res.render('T', {
						title : 'Traceability',
						posts : posts,
						guardlists : guardlists,
						tracerules : tracerules,
						elementdepencys : elementdepencys,
						user : req.session.user,
						current_guard : current_guard_id,
						success : req.flash('success').toString(),
						error : req.flash('error').toString()
				});	
			});
		});
	});
  });
}

exports.insertDecBeforeActCon = function(req, res){
	 
 	 //var param=req.params.content.split("分");
 	 var user=req.session.user.name;
 	 var id=req.body.current_guard_id;
 	 var TarDec=req.body.TartDec;
 	 var PostAct=req.body.PostAct;
 	 var InserCon=req.body.InsertCon;
 	 var MainBranchCon=req.body.MainBranchCon;
 	 var SupBranchCon=req.body.SupBranchCon;
 	 var InserAct=req.body.InserAct;
 	 var TargetDec=req.body.TargetDec;
	 var UseCase=req.body.UC;
	 var positions=req.body.operation_position;
	 var current_guard_id=id;
 	
	  ElementDepency.saveInsertDecBeforeActCon(req.session.user.name,TarDec,PostAct,InserCon,MainBranchCon,SupBranchCon,InserAct,TargetDec,UseCase,current_guard_id,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}

			Tracerule.saveInsertDecBeforeActCon(req.session.user.name,id,TarDec,PostAct,InserCon,MainBranchCon,SupBranchCon,InserAct,TargetDec,UseCase,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
			res.send({"saveInsertDecBeforeActCon":1});

			});
	});
}




exports.doLogin = function(req, res) {
	//生成口令的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    
	User.get(req.body.username, function(err, user) {
		if (!user) {
			req.flash('error', '用户不存在');
			return res.redirect('/login');
		}
		if (user.password != password) {
			req.flash('error', '密码错误');
			return res.redirect('/login');
		}
		req.session.user = user;
		req.flash('success', '登录成功');
		res.redirect('/');
	});
};

exports.logout = function(req, res) {
	req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/');
};

exports.featuremodel=function(req,res){
	res.render('featuremodel',{ 
		 title: 'Feature Model',
		 user : req.session.user,
		 success : req.flash('success').toString(),
		 error : req.flash('error').toString()
	});
};

exports.modeltree=function(req,res){
	res.render('modeltree',{ 
		 layout: false,
		 title: 'Feature Model',
		 user : req.session.user,
		 success : req.flash('success').toString(),
		 error : req.flash('error').toString()
	});
};

exports.showtree=function(req,res){
Post.getChild(req.body.ind, function(err, posts) {
		if (err) {
			posts = [];
		}
		res.render('showtree', {
			layout: false,
			posts : posts,
			user : req.session.user,
			success : req.flash('success').toString(),
			error : req.flash('error').toString()
		});
	});
};

exports.showrelation=function(req,res){
	res.render('showrelation',{ 
		 layout: false,
		 user : req.session.user,
		 success : req.flash('success').toString(),
		 error : req.flash('error').toString()
	});
};

exports.showinfo=function(req,res){
	res.render('showinfo',{ 
		 layout: false,
		 user : req.session.user,
		 success : req.flash('success').toString(),
		 error : req.flash('error').toString()
	});
};

exports.traceability=function(req,res){
	res.render('traceability',{ 
		 title: 'traceability',
		 user : req.session.user,
		 success : req.flash('success').toString(),
		 error : req.flash('error').toString()
	});
};

exports.guardname=function(req,res){
	res.render('guardname',{
		layout:false,
		title: 'guardname',
		 user : req.session.user,
		 success : req.flash('success').toString(),
		 error : req.flash('error').toString()
	});
};

exports.showguard=function(req,res){
	res.render('showguard',{
		layout:false,
		title: 'showguard',
		 user : req.session.user,
		 success : req.flash('success').toString(),
		 error : req.flash('error').toString()
	});
};

exports.configuration=function(req,res){
	res.render('configuration',{ 
		 title: 'configuration',
		 user : req.session.user,
		 success : req.flash('success').toString(),
		 error : req.flash('error').toString()
	});
};

exports.configuratemodeltree=function(req,res){
	res.render('configuratemodeltree',{ 
		 layout: false,
		 title: 'Configurate Feature Model',
		 user : req.session.user,
		 success : req.flash('success').toString(),
		 error : req.flash('error').toString()
	});
};

exports.editfeaturetree=function(req,res){
Post.getChild(req.body.ind, function(err, posts) {
		if (err) {
			posts = [];
		}
		res.render('editfeaturetree', {
			layout: false,
			posts : posts,
			user : req.session.user,
			success : req.flash('success').toString(),
			error : req.flash('error').toString()
		});
	});
};

exports.deleteActivity = function(req, res){
	 //console.log(req.params.content);
 	 //var param=req.params.content.split("分");
 	 var user=req.session.user.name;
 	 var id=req.body.current_guard_id;
 	 var operation_name=req.body.current_accordion;
 	 operation=operation_name.split(" ");
 	 var positions=req.body.operation_position;
 	 var current_guard_id=id;
 	 var projectID=req.body.projectID;
 	 console.log("operation[operation.length-1]:"+operation[operation.length-1]);

 	 Guardlist.get(req.session.user.name, projectID,function(err, guardlists) {
				if (err) {
				guradlists = [];
			}

 	 ElementDepency.getToDepenNum(user,operation[operation.length-1],function(err,dependencyElement){
		err=""; 	 	
 	 	if(dependencyElement[0].todepenNum>0){
 	 		err = 'This activity still has dependent relation(s):';
 	 		var flag=false;


 	 		for(key in dependencyElement[0].todepen)
 	 		{
 	 			var keys=key.split("_");
 	 			if(flag)
 	 			{
 	 				err=err+", ";
 	 			}
 	 			err=err+" "+keys[1]+"∈";
 	 			for(keyss in guardlists)
 	 			{
 	 				console.log("haha:"+guardlists[keyss].selfname+" "+guardlists[keyss]._id+" "+keys[0]);
 	 				if(guardlists[keyss].trace_rule_id==keys[0])
 	 					err=err+guardlists[keyss].selfname;
 	 			}
 	 			if(!flag)
 	 			{
 	 				flag=true;

 	 			}
 	 		}
 	 	 
 	 	}
 	 	var $dependernum=0;
 	 	flag=false;
 	 	for(key in dependencyElement[0].depender)
 	 		{
 	 			
 	 			if($dependernum==0)
 	 			{
 	 			   if(err!="")
 	 				err=err+"\n";
 	 				err=err+"This activity is dependent on these elements:";
 	 			}
 	 			$dependernum++;
 	 			if(flag){
 	 				err=err+", ";
 	 			}
 	 			var keys=key.split("_");
 	 			err=err+" "+keys[1]+"∈";
 	 			for(keyss in guardlists)
 	 			{
 	 				console.log("haha:"+guardlists[keyss].selfname+" "+guardlists[keyss]._id+" "+keys[0]);
 	 				if(guardlists[keyss].trace_rule_id==keys[0])
 	 					err=err+guardlists[keyss].selfname;
 	 			}
 	 			if(!flag)
 	 			{
 	 				flag=true;

 	 			}
 	 		}


 	 	var $dependernum=0;
 	 	flag=false;
 	 	for(key in dependencyElement[0].insidetodepen)
 	 		{
 	 			
 	 			if($dependernum==0)
 	 			{
 	 			   if(err!="")
 	 				err=err+"\n";
 	 				err=err+"Some elements of this tracerule are dependent on this activity:";
 	 			}
 	 			$dependernum++;
 	 			if(flag){
 	 				err=err+", ";
 	 			}
 	 			var keys=key.split("_");
 	 			err=err+" "+keys[1]+"∈";
 	 			for(keyss in guardlists)
 	 			{
 	 				if(guardlists[keyss].trace_rule_id==keys[0])
 	 					err=err+guardlists[keyss].selfname;
 	 			}
 	 			if(!flag)
 	 			{
 	 				flag=true;

 	 			}
 	 		}

 	 	var $dependernum=0;
 	 	flag=false;
 	 	for(key in dependencyElement[0].insidedepender)
 	 		{
 	 			
 	 			if($dependernum==0)
 	 			{
 	 			   if(err!="")
 	 				err=err+"\n";
 	 				err=err+"This activity is dependent on these elements of this tracerule:";
 	 			}
 	 			$dependernum++;
 	 			if(flag){
 	 				err=err+", ";
 	 			}
 	 			var keys=key.split("_");
 	 			err=err+" "+keys[1]+"∈";
 	 			for(keyss in guardlists)
 	 			{
 	 				if(guardlists[keyss].trace_rule_id==keys[0])
 	 					err=err+guardlists[keyss].selfname;
 	 			}
 	 			if(!flag)
 	 			{
 	 				flag=true;

 	 			}
 	 		}
 	 	
 	 	if (err) {
 	 		/*var $now_ID=projectID+"_"+current_guard_id;
 	 		console.log(err+":1");
			req.flash('error', err);
			return res.redirect('/T/'+$now_ID);
			console.log(err+":2");*/
			res.send({"errs":err});
		}
		else{
		  ElementDepency.deleteActivityDependee(req.session.user.name,id,operation_name,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}

			Tracerule.deleteActivity(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
				res.send({"deleteActivity":1});	
			});
		
	
   });
  
 	}
 	}); //getToDepenNum
		})
}

exports.deleteDecision = function(req, res){
	 //console.log(req.params.content);
 	 //var param=req.params.content.split("分");
 	 var user=req.session.user.name;
 	 var id=req.body.current_guard_id;
 	 var operation_name=req.body.current_accordion;
 	 operation=operation_name.split(" ");
 	 var positions=req.body.operation_position;
 	 var current_guard_id=id;
 	 var projectID=req.body.projectID;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);
 	 Guardlist.get(req.session.user.name, projectID,function(err, guardlists) {
				if (err) {
				guradlists = [];
			}
 	 ElementDepency.getToDepenNum(user,operation[operation.length-1],function(err,dependencyElement){
 	 	err="";
 	 	if(dependencyElement[0].todepenNum>0){
 	 		err = 'This decision still have dependent relation(s):';
 	 		var flag=false;
 	 		for(key in dependencyElement[0].todepen)
 	 		{
 	 			var keys=key.split("_");
 	 			if(flag)
 	 			{
 	 				err=err+", ";
 	 			}
 	 			err=err+" "+keys[1];
 	 			if(!flag)
 	 			{
 	 				flag=true;

 	 			}
 	 		}
 	 	}

 	 	var $dependernum=0;
 	 	flag=false;
 	 	for(key in dependencyElement[0].depender)
 	 		{
 	 			
 	 			if($dependernum==0)
 	 			{
 	 			   if(err!="")
 	 				err=err+"\n";
 	 				err=err+"This decision is dependent on these elements:";
 	 			}
 	 			$dependernum++;
 	 			if(flag){
 	 				err=err+", ";
 	 			}
 	 			var keys=key.split("_");
 	 			err=err+" "+keys[1]+"∈";
 	 			for(keyss in guardlists)
 	 			{
 	 				console.log("haha:"+guardlists[keyss].selfname+" "+guardlists[keyss]._id+" "+keys[0]);
 	 				if(guardlists[keyss].trace_rule_id==keys[0])
 	 					err=err+guardlists[keyss].selfname;
 	 			}
 	 			if(!flag)
 	 			{
 	 				flag=true;

 	 			}
 	 		}

 	 	var $dependernum=0;
 	 	flag=false;
 	 	for(key in dependencyElement[0].insidetodepen)
 	 		{
 	 			
 	 			if($dependernum==0)
 	 			{
 	 			   if(err!="")
 	 				err=err+"\n";
 	 				err=err+"Some elements are dependent on this decision:";
 	 			}
 	 			$dependernum++;
 	 			if(flag){
 	 				err=err+", ";
 	 			}
 	 			var keys=key.split("_");
 	 			err=err+" "+keys[1]+"∈";
 	 			for(keyss in guardlists)
 	 			{
 	 				if(guardlists[keyss].trace_rule_id==keys[0])
 	 					err=err+guardlists[keyss].selfname;
 	 			}
 	 			if(!flag)
 	 			{
 	 				flag=true;

 	 			}
 	 		}

 	 	var $dependernum=0;
 	 	flag=false;
 	 	for(key in dependencyElement[0].insidedepender)
 	 		{
 	 			
 	 			if($dependernum==0)
 	 			{
 	 			   if(err!="")
 	 				err=err+"\n";
 	 				err=err+"This decision is dependent on these elements of this tracerule:";
 	 			}
 	 			$dependernum++;
 	 			if(flag){
 	 				err=err+", ";
 	 			}
 	 			var keys=key.split("_");
 	 			err=err+" "+keys[1]+"∈";
 	 			for(keyss in guardlists)
 	 			{
 	 				if(guardlists[keyss].trace_rule_id==keys[0])
 	 					err=err+guardlists[keyss].selfname;
 	 			}
 	 			if(!flag)
 	 			{
 	 				flag=true;

 	 			}
 	 		}

 	 	if (err) {
			res.send({"errs":err});
		}

		
 	 else{
 	 
		  ElementDepency.deleteDecisionDependee(req.session.user.name,id,operation_name,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
			Tracerule.deleteDecision(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
			res.send({"deleteDecision":1});
			});
	
   });
  
 }//else
 	}); //getToDepenNum
	})
}

exports.deleteCondition = function(req, res){
	 //console.log(req.params.content);
 	 //var param=req.params.content.split("分");
 	 var user=req.session.user.name;
 	 var id=req.body.current_guard_id;
 	 var operation_name=req.body.current_accordion;
 	 operation=operation_name.split(" ");
 	 var positions=req.body.operation_position;
 	 var projectID=req.body.projectID;
 	 var current_guard_id=id;
 	 //console.log(user+" "+id+" "+operation_name+" "+positions);
 	 Guardlist.get(req.session.user.name, projectID,function(err, guardlists) {
				if (err) {
				guradlists = [];
			}
 	 ElementDepency.getToDepenNum(user,operation[operation.length-1],function(err,dependencyElement){
 	 	err="";
 	 	if(dependencyElement[0].todepenNum>0){
 	 		err = 'This condition still have dependent relation(s):';
 	 		var flag=false;
 	 		for(key in dependencyElement[0].todepen)
 	 		{
 	 			var keys=key.split("_");
 	 			if(flag)
 	 			{
 	 				err=err+",";
 	 			}
 	 			err=err+" "+keys[1];
 	 			if(!flag)
 	 			{
 	 				flag=true;

 	 			}
 	 		}
 	 	}
 	 	if (err) {
			res.send({"errs":err});
		}

		var $dependernum=0;
 	 	flag=false;
 	 	for(key in dependencyElement[0].depender)
 	 		{
 	 			
 	 			if($dependernum==0)
 	 			{
 	 			   if(err!="")
 	 				err=err+"\n";
 	 				err=err+"This condition is dependent on these elements:";
 	 			}
 	 			$dependernum++;
 	 			if(flag){
 	 				err=err+", ";
 	 			}
 	 			var keys=key.split("_");
 	 			err=err+" "+keys[1]+"∈";
 	 			for(keyss in guardlists)
 	 			{
 	 				console.log("haha:"+guardlists[keyss].selfname+" "+guardlists[keyss]._id+" "+keys[0]);
 	 				if(guardlists[keyss].trace_rule_id==keys[0])
 	 					err=err+guardlists[keyss].selfname;
 	 			}
 	 			if(!flag)
 	 			{
 	 				flag=true;

 	 			}
 	 		}

 	 	var $dependernum=0;
 	 	flag=false;
 	 	for(key in dependencyElement[0].insidetodepen)
 	 		{
 	 			
 	 			if($dependernum==0)
 	 			{
 	 			   if(err!="")
 	 				err=err+"\n";
 	 				err=err+"Some elements of this tracerule are dependent on this condition:";
 	 			}
 	 			$dependernum++;
 	 			if(flag){
 	 				err=err+", ";
 	 			}
 	 			var keys=key.split("_");
 	 			err=err+" "+keys[1]+"∈";
 	 			for(keyss in guardlists)
 	 			{
 	 				if(guardlists[keyss].trace_rule_id==keys[0])
 	 					err=err+guardlists[keyss].selfname;
 	 			}
 	 			if(!flag)
 	 			{
 	 				flag=true;

 	 			}
 	 		}

 	 	var $dependernum=0;
 	 	flag=false;
 	 	for(key in dependencyElement[0].insidedepender)
 	 		{
 	 			
 	 			if($dependernum==0)
 	 			{
 	 			   if(err!="")
 	 				err=err+"\n";
 	 				err=err+"This condition of this tracerule is dependent on these elements of this tracerule:";
 	 			}
 	 			$dependernum++;
 	 			if(flag){
 	 				err=err+", ";
 	 			}
 	 			var keys=key.split("_");
 	 			err=err+" "+keys[1]+"∈";
 	 			for(keyss in guardlists)
 	 			{
 	 				if(guardlists[keyss].trace_rule_id==keys[0])
 	 					err=err+guardlists[keyss].selfname;
 	 			}
 	 			if(!flag)
 	 			{
 	 				flag=true;

 	 			}
 	 		}

 	 		if (err) {
			res.send({"errs":err});
		}

 	 else{

	   ElementDepency.deleteConditionDependee(req.session.user.name,id,operation_name,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
			Tracerule.deleteCondition(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
				
				res.send({"deleteCondition":1});
			});
	
   });

 	 }//else
 	}); //getToDepenNum
  })
}

exports.deleteUseCase = function(req, res){
	 
 	 var user=req.session.user.name;
 	 var id=req.body.current_guard_id;
 	 var operation_name=req.body.current_accordion;
 	 operation=operation_name.split(" ");
 	 var positions=req.body.operation_position;
 	 var current_guard_id=id;
 	 var projectID=req.body.projectID;
	Guardlist.get(req.session.user.name, projectID,function(err, guardlists) {
				if (err) {
				guradlists = [];
			}
 	 console.log("deleteUseCase: "+user+" "+id+" "+operation_name+" "+positions+" "+current_guard_id+" "+projectID);
 	 ElementDepency.getToDepenNum(user,operation[operation.length-1],function(err,dependencyElement){
 	 	err="";
 	 	if(dependencyElement[0].todepenNum>0){
 	 		err = 'This use case still have dependent relation(s):';
 	 		var flag=false;
 	 		for(key in dependencyElement[0].todepen)
 	 		{
 	 			var keys=key.split("_");
 	 			if(flag)
 	 			{
 	 				err=err+",";
 	 			}
 	 			err=err+" "+keys[1]+"∈";
 	 			for(keyss in guardlists)
 	 			{
 	 				console.log("haha:"+guardlists[keyss].selfname+" "+guardlists[keyss]._id+" "+keys[0]);
 	 				if(guardlists[keyss].trace_rule_id==keys[0])
 	 					err=err+guardlists[keyss].selfname;
 	 			}
 	 			if(!flag)
 	 			{
 	 				flag=true;

 	 			}
 	 		}
 	 	}

 	 	var $dependernum=0;
 	 	flag=false;
 	 	for(key in dependencyElement[0].depender)
 	 		{
 	 			
 	 			if($dependernum==0)
 	 			{
 	 			   if(err!="")
 	 				err=err+"\n";
 	 				err=err+"This use case is dependent on these elements:";
 	 			}
 	 			$dependernum++;
 	 			if(flag){
 	 				err=err+", ";
 	 			}
 	 			var keys=key.split("_");
 	 			err=err+" "+keys[1]+"∈";
 	 			for(keyss in guardlists)
 	 			{
 	 				console.log("haha:"+guardlists[keyss].selfname+" "+guardlists[keyss]._id+" "+keys[0]);
 	 				if(guardlists[keyss].trace_rule_id==keys[0])
 	 					err=err+guardlists[keyss].selfname;
 	 			}
 	 			if(!flag)
 	 			{
 	 				flag=true;

 	 			}
 	 		}

 	 	var $dependernum=0;
 	 	flag=false;
 	 	for(key in dependencyElement[0].insidetodepen)
 	 		{
 	 			
 	 			if($dependernum==0)
 	 			{
 	 			   if(err!="")
 	 				err=err+"\n";
 	 				err=err+"Some elements of this tracerule are dependent on this use case element:";
 	 			}
 	 			$dependernum++;
 	 			if(flag){
 	 				err=err+", ";
 	 			}
 	 			var keys=key.split("_");
 	 			err=err+" "+keys[1]+"∈";
 	 			for(keyss in guardlists)
 	 			{
 	 				if(guardlists[keyss].trace_rule_id==keys[0])
 	 					err=err+guardlists[keyss].selfname;
 	 			}
 	 			if(!flag)
 	 			{
 	 				flag=true;

 	 			}
 	 		}

 	 	var $dependernum=0;
 	 	flag=false;
 	 	for(key in dependencyElement[0].insidedepender)
 	 		{
 	 			
 	 			if($dependernum==0)
 	 			{
 	 			   if(err!="")
 	 				err=err+"\n";
 	 				err=err+"This use case element is dependent on these elements of this tracerule:";
 	 			}
 	 			$dependernum++;
 	 			if(flag){
 	 				err=err+", ";
 	 			}
 	 			var keys=key.split("_");
 	 			err=err+" "+keys[1]+"∈";
 	 			for(keyss in guardlists)
 	 			{
 	 				if(guardlists[keyss].trace_rule_id==keys[0])
 	 					err=err+guardlists[keyss].selfname;
 	 			}
 	 			if(!flag)
 	 			{
 	 				flag=true;

 	 			}
 	 		}


 	 	if (err) {
			res.send({"errs":err});
		}

		
 	 	else{
 
		  ElementDepency.deleteUseCaseDependee(req.session.user.name,id,operation_name,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
			Tracerule.deleteUseCase(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
				res.send({"deleteUseCase":1});	
			});
		
	
   });
 
 	 }//else
 	}); //getToDepenNum
})
}

//I2
exports.deleteInsertActAfterPre = function(req, res){
	 //console.log(req.params.content);
 	 //var param=req.params.content.split("分");
 	 var user=req.session.user.name;
 	 var id=req.body.current_guard_id;
 	 var operation_name=req.body.current_accordion;
 	 var positions=req.body.operation_position;
 	 var hidden_field=req.body.hidden_fields;
 	 var current_guard_id=id;
 	 //console.log(user+" "+id+" "+operation_name+" "+positions+" "+hidden_field);
 	
		  ElementDepency.deleteInsertActAfterPre(req.session.user.name,id,operation_name,hidden_field,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}

			Tracerule.deleteInsertActAfterPre(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				res.send({"deleteInsertActAfterPre":1});
			});

   });
 
}
//I3
exports.deleteInsertActBeforePost = function(req, res){
	 
 	 var user=req.session.user.name;
 	 var id=req.body.current_guard_id;
 	 var operation_name=req.body.current_accordion;
 	 var positions=req.body.operation_position;
 	 var hidden_field=req.body.hidden_fields;
 	 var current_guard_id=id;
 	 //console.log(user+" "+id+" "+operation_name+" "+positions);
 
		  ElementDepency.deleteInsertActBeforePost(req.session.user.name,id,operation_name,hidden_field,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
			Tracerule.deleteInsertActBeforePost(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				res.send({"deleteInsertActBeforePost":1});	
			});
	
   });
}
//I4

exports.deleteInsertActAfterDecCon = function(req, res){
	 
 	 var user=req.session.user.name;
 	 var id=req.body.current_guard_id;
 	 var operation_name=req.body.current_accordion;
 	 var positions=req.body.operation_position;
 	 var hidden_field=req.body.hidden_fields;
 	 var current_guard_id=id;
 	 
		  ElementDepency.deleteInsertActAfterDecCon(req.session.user.name,id,operation_name,hidden_field,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
			Tracerule.deleteInsertActAfterDecCon(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
			res.send({"deleteInsertActAfterDecCon":1});
			});

   });

}


//I5
exports.deleteInsertActBeforeActCon = function(req, res){
	
 	 var user=req.session.user.name;
 	 var id=req.body.current_guard_id;
 	 var operation_name=req.body.current_accordion;
 	 var positions=req.body.operation_position;
 	 var hidden_field=req.body.hidden_fields;
 	 var current_guard_id=id;
 	 //console.log(user+" "+id+" "+operation_name+" "+positions);
 	
		  ElementDepency.deleteInsertActBeforeActCon(req.session.user.name,id,operation_name,hidden_field,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
			Tracerule.deleteInsertActBeforeActCon(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
			res.send({"deleteInsertActBeforeActCon":1});
			});
   });
}


//I6
exports.deleteInsertDecAfterAct = function(req, res){
	 
 	 var user=req.session.user.name;
 	 var id=req.body.current_guard_id;
 	 var operation_name=req.body.current_accordion;
 	 var positions=req.body.operation_position;
 	 var hidden_field=req.body.hidden_fields;
 	 var current_guard_id=id;
 	 //console.log(user+" "+id+" "+operation_name+" "+positions);
 
	 ElementDepency.deleteInsertDecAfterAct(req.session.user.name,id,operation_name,hidden_field,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}

		Tracerule.deleteInsertDecAfterAct(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
			res.send({"deleteInsertDecAfterAct":1});
			});
	
   });
 
}
//I7

exports.deleteInsertDecAfterDecCon = function(req, res){
	 
 	 var user=req.session.user.name;
 	 var id=req.body.current_guard_id;
 	 var operation_name=req.body.current_guard_id;
 	 var positions=req.body.operation_position;
 	 var hidden_field=req.body.hidden_fields;
 	 var current_guard_id=id;
 	 //console.log(user+" "+id+" "+operation_name+" "+positions);
 
		ElementDepency.deleteInsertDecAfterDecCon(req.session.user.name,id,operation_name,hidden_field,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}

			Tracerule.deleteInsertDecAfterDecCon(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
			res.send({"deleteInsertDecAfterDecCon":1});
			});
	
   });
}

//I8

exports.deleteInsertDecBeforeAct = function(req, res){
	
 	 var user=req.session.user.name;
 	 var id=req.body.current_guard_id;
 	 var operation_name=req.body.current_accordion;
 	 var positions=req.body.operation_position;
 	 var hidden_field=req.body.hidden_fields;
 	 var current_guard_id=id;
 	 
		ElementDepency.deleteInsertDecBeforeAct(req.session.user.name,id,operation_name,hidden_field,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		

			Tracerule.deleteInsertDecBeforeAct(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
				
				res.send({"deleteInsertDecBeforeAct":1});
			});
	
   });

}
//I9

exports.deleteInsertDecBeforeActWith = function(req, res){
	
 	 var user=req.session.user.name;
 	 var id=req.body.current_guard_id;
 	 var operation_name=req.body.current_accordion;
 	 var positions=req.body.operation_position;
 	 var hidden_field=req.body.hidden_fields;
 	 var current_guard_id=id;
 
		ElementDepency.deleteInsertDecBeforeActWith(req.session.user.name,id,operation_name,hidden_field,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
			Tracerule.deleteInsertDecBeforeActWith(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
				
				res.send({"deleteInsertDecBeforeActWith":1});
			});

   });

}

//I10

exports.deleteInsertDecBeforeActCon = function(req, res){
	
 	 var user=req.session.user.name;
 	 var id=req.body.current_guard_id;
 	 var operation_name=req.body.current_accordion;
 	 var positions=req.body.operation_position;
 	 var hidden_field=req.body.hidden_fields;
 	 var current_guard_id=id;
 	 
		ElementDepency.deleteInsertDecBeforeActCon(req.session.user.name,id,operation_name,hidden_field,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		

			Tracerule.deleteInsertDecBeforeActCon(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
			res.send({"deleteInsertDecBeforeActCon":1});
			});
	
   });

}

exports.editUseCase=function(req,res){

	 var nameMark=req.body.nameMark;
	 var descriptionMark=req.body.descriptionMark;
 	 var user=req.body.user;
 	 var id=req.body.id;
 	 var usecasename=req.body.usecasename;
 	 var usecasedescription=req.body.usecasedescription;
 	 var oldusecasename=req.body.oldusecasename;
 	 var oldusecasedescription=req.body.oldusecasedescription;
 	 var positions=req.body.positions;
	 var current_guard_id=req.body.current_guard_id;
	 var type="UseCase";
	 var hidden_fields=req.body.hidden_fields;
	 var projectID=req.body.projectID;
	 console.log(oldusecasename+" "+usecasename+" "+hidden_fields);
	 console.log("nameMark:"+nameMark+" descriptionMark:"+descriptionMark+" oldusecasedescription:"+oldusecasedescription+" usecasedescription:"+usecasedescription);
	 if(nameMark){

	  ElementDepency.replaceDependKeyName(req.session.user.name,oldusecasename,usecasename,hidden_fields,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}
		Guardlist.get(req.session.user.name,projectID, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}		
	  		Tracerule.editUseCase(req.session.user.name,id,nameMark,oldusecasename,usecasename,descriptionMark,oldusecasedescription,usecasedescription,positions,hidden_fields,projectID,function(err,tracerules){
				res.send(
						
						{elementdepencys:elementdepencys}
	
				);	
			});
	  	  });

		});
  }else{
  	Tracerule.editUseCase(req.session.user.name,id,nameMark,oldusecasename,usecasename,descriptionMark,oldusecasedescription,usecasedescription,positions,hidden_fields,projectID,function(err,tracerules){
				res.send(
						
						{elementdepencys:elementdepencys}
	
				);	
			});
  }  
}

exports.editActivity=function(req,res){

	 var nameMark=req.body.nameMark;
	 var descriptionMark=req.body.descriptionMark;
	 var executorMark=req.body.executorMark;
 	 var user=req.body.user;
 	 var id=req.body.id;
 	 var activityname=req.body.activityname;
 	 var activitydescription=req.body.activitydescription;
 	 var activityexecutor=req.body.activityexecutor;
 	 var oldactivityname=req.body.oldactivityname;
 	 var oldactivitydescription=req.body.oldactivitydescription;
 	 var oldactivityexecutor=req.body.oldactivityexecutor;
 	 var positions=req.body.positions;
	 var current_guard_id=req.body.current_guard_id;
	 var type="activity";
	 var hidden_fields=req.body.hidden_fields;
	 var projectID=req.body.projectID;
	 console.log(oldactivityname+" "+activityname+" hidden_fields:"+hidden_fields+" projectID:"+projectID);
	 if(nameMark || descriptionMark){

	
	  ElementDepency.replaceDependKeyName(req.session.user.name,oldactivityname,activityname,hidden_fields,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}		
	  		Tracerule.editActivity(req.session.user.name,id,nameMark,oldactivityname,activityname,descriptionMark,oldactivitydescription,activitydescription,executorMark,oldactivityexecutor,activityexecutor,positions,hidden_fields,projectID,function(err,tracerules){
				res.send(
						
						{elementdepencys:elementdepencys}
	
				);	
			});
	  	  

		});	
  }  
}

exports.editDecision=function(req,res){

	 var nameMark=req.body.nameMark;
	 var descriptionMark=req.body.descriptionMark;
	 var executorMark=req.body.executorMark;
 	 var user=req.body.user;
 	 var id=req.body.id;
 	 var decisionname=req.body.decisionname;
 	 var decisiondescription=req.body.decisiondescription;
 	 var decisionexecutor=req.body.decisionexecutor;
 	 var olddecisionname=req.body.olddecisionname;
 	 var olddecisiondescription=req.body.olddecisiondescription;
 	 var olddecisionexecutor=req.body.olddecisionexecutor;
 	 var positions=req.body.positions;
	 var current_guard_id=req.body.current_guard_id;
	 var type="decision";
	 var hidden_fields=req.body.hidden_fields;
	 var projectID=req.body.projectID;
	 console.log(olddecisionname+" "+decisionname+" "+hidden_fields);
	 if(nameMark || descriptionMark){

	
	  ElementDepency.replaceDependKeyName(req.session.user.name,olddecisionname,decisionname,hidden_fields,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}		
	  		Tracerule.editDecision(req.session.user.name,id,nameMark,olddecisionname,decisionname,descriptionMark,olddecisiondescription,decisiondescription,executorMark,olddecisionexecutor,decisionexecutor,positions,hidden_fields,function(err,tracerules){
				res.send(
						
						{elementdepencys:elementdepencys}
	
				);	
			});
	  	  

		});	
  }  
}

exports.editCondition=function(req,res){

	 var nameMark=req.body.nameMark;
	 var descriptionMark=req.body.descriptionMark;
 	 var user=req.body.user;
 	 var id=req.body.id;
 	 var conditionname=req.body.conditionname;
 	 var conditiondescription=req.body.conditiondescription;
 	 var oldconditionname=req.body.oldconditionname;
 	 var oldconditiondescription=req.body.oldconditiondescription;
 	 var positions=req.body.positions;
	 var current_guard_id=req.body.current_guard_id;
	 var type="condition";
	 var hidden_fields=req.body.hidden_fields;
	 var projectID=req.body.projectID;
	 console.log("nameMark:"+nameMark+" descriptionMark:"+descriptionMark+" oldconditionname:"+oldconditionname+" conditionname:"+conditionname+" conditiondescription:"+conditiondescription+" oldconditiondescription:"+oldconditiondescription+" hidden_fields:"+hidden_fields+" positions:"+positions);
	 
	 if(nameMark || descriptionMark){
	 	console.log("nameMark:"+nameMark);
      if(nameMark==true){
      	
	  ElementDepency.replaceDependKeyName(req.session.user.name,oldconditionname,conditionname,hidden_fields,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}	
	  		Tracerule.editCondition(req.session.user.name,id,projectID,nameMark,oldconditionname,conditionname,descriptionMark,oldconditiondescription,conditiondescription,positions,hidden_fields,function(err,tracerules){
				res.send(
						
						{elementdepencys:elementdepencys}
	
				);	
			});
	  	 

		});
	  }else{
	  	
	  	Tracerule.editCondition(req.session.user.name,id,projectID,nameMark,oldconditionname,conditionname,descriptionMark,oldconditiondescription,conditiondescription,positions,hidden_fields,function(err,tracerules){
				res.send(
						
						{tracerules:tracerules}
	
				);	
			});
	  }
  }  
}

exports.editInsertActAfterPre=function(req,res){

	 
 	 var user=req.body.user;
 	 var id=req.body.id;
 	 var editTartAct=req.body.editTartAct;
 	 var editPreAct=req.body.editPreAct;
 	 var editUseCase=req.body.editUseCase;
 	 var oldTarAct=req.body.oldTarAct;
 	 var oldPreAct=req.body.oldPreAct;
 	 var oldUseCase=req.body.oldUseCase;
 	 var positions=req.body.positions;
	 var current_guard_id=req.body.current_guard_id;
	 var hidden_fields=req.body.hidden_fields;
	 var projectID=req.body.projectID;

	  operation_name="Insert "+oldTarAct.split(".")[1]+" after "+oldPreAct.split(".")[1]+" in "+oldUseCase.split(".")[1];
	  //console.log("user:"+user+" id:"+id+" editTartAct:"+editTartAct+" editPreAct:"+editPreAct+" editUseCase:"+editUseCase+" positions:"+positions+" current_guard_id:"+current_guard_id+" hidden_fields:"+hidden_fields+" projectID:"+projectID+" operation_name:"+operation_name);
	  console.log("id:"+id+" editTartAct:"+editTartAct+" editPreAct"+editPreAct+" editUseCase"+editUseCase+" oldTarAct:"+oldTarAct+" oldPreAct:"+oldPreAct+" oldUseCase:"+oldUseCase+" current_guard_id:"+current_guard_id+" hidden_fields:"+hidden_fields+" projectID:"+projectID+" operation_name:"+operation_name);
	  ElementDepency.deleteInsertActAfterPre(req.session.user.name,id,operation_name,hidden_fields,function(err,elementdepencys){	  		
	  	if(err){
	  		elementdepencys=[];
	  	}

		Tracerule.deleteInsertActAfterPre(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}

			ElementDepency.saveInsertActAfterPre(req.session.user.name,editTartAct,editPreAct,editUseCase,current_guard_id,function(err,elementdepencys){
	  			if(err){
	  				elementdepencys=[];
	  			}

				Tracerule.saveInsertActAfterPre(req.session.user.name,id,editTartAct,editPreAct,editUseCase,positions, function(err, tracerules) {
					if (err) {
						tracerules = [];
					}
				
					res.send({"saveInsertActAfterPre":1});
				});
			});
		});

   });

}

exports.editInsertActBeforePost=function(req,res){

	 var user=req.body.user;
 	 var id=req.body.id;
 	 var editTartAct=req.body.editTartAct;
 	 var editPostAct=req.body.editPostAct;
 	 var editUseCase=req.body.editUseCase;
 	 var oldTarAct=req.body.oldTarAct;
 	 var oldPostAct=req.body.oldPostAct;
 	 var oldUseCase=req.body.oldUseCase;
 	 var positions=req.body.positions;
	 var current_guard_id=req.body.current_guard_id;
	 var hidden_fields=req.body.hidden_fields;
	 var projectID=req.body.projectID;

	  operation_name="Insert "+oldTarAct.split(".")[1]+" before "+oldPostAct.split(".")[1]+" in "+oldUseCase.split(".")[1];
	  //console.log("user:"+user+" id:"+id+" editTartAct:"+editTartAct+" editPreAct:"+editPreAct+" editUseCase:"+editUseCase+" positions:"+positions+" current_guard_id:"+current_guard_id+" hidden_fields:"+hidden_fields+" projectID:"+projectID+" operation_name:"+operation_name);
	  ElementDepency.deleteInsertActBeforePost(req.session.user.name,id,operation_name,hidden_fields,function(err,elementdepencys){	  		
	  	if(err){
	  		elementdepencys=[];
	  	}

		Tracerule.deleteInsertActBeforePost(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}

			ElementDepency.saveInsertActBeforePost(req.session.user.name,editTartAct,editPostAct,editUseCase,current_guard_id,function(err,elementdepencys){
	  			if(err){
	  				elementdepencys=[];
	  			}

				Tracerule.saveInsertActBeforePost(req.session.user.name,id,editTartAct,editPostAct,editUseCase,positions, function(err, tracerules) {
					if (err) {
						tracerules = [];
					}
				
					res.send({"saveInsertActAfterPre":1});
				});
			});
		});

   });
}

exports.editInterAfterDecCon=function(req,res){

	 var user=req.body.user;
 	 var id=req.body.id;
 	 var editTartAct=req.body.editTartAct;
 	 var editDec=req.body.editDec;
 	 var editCon=req.body.editCon;
 	 var editUseCase=req.body.editUseCase;
 	 var oldTarAct=req.body.oldTarAct;
 	 var oldDec=req.body.oldDec;
 	 var oldCon=req.body.oldCon;
 	 var oldUseCase=req.body.oldUseCase;
 	 var positions=req.body.positions;
	 var current_guard_id=req.body.current_guard_id;
	 var hidden_fields=req.body.hidden_fields;
	 var projectID=req.body.projectID;

	  operation_name="Insert "+oldTarAct.split(".")[1]+" after "+oldDec.split(".")[1]+" , "+oldCon.split(".")[1]+" in "+oldUseCase.split(".")[1];
	  //console.log("user:"+user+" id:"+id+" editTartAct:"+editTartAct+" editPreAct:"+editPreAct+" editUseCase:"+editUseCase+" positions:"+positions+" current_guard_id:"+current_guard_id+" hidden_fields:"+hidden_fields+" projectID:"+projectID+" operation_name:"+operation_name);
	  console.log("####################:"+operation_name);
	  ElementDepency.deleteInsertActAfterDecCon(req.session.user.name,id,operation_name,hidden_fields,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
			Tracerule.deleteInsertActAfterDecCon(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
				  ElementDepency.saveInsertActAfterDecCon(req.session.user.name,editTartAct,editDec,editCon,editUseCase,current_guard_id,function(err,elementdepencys){
	  				if(err){
	  					elementdepencys=[];
	  				}

						Tracerule.saveInsertActAfterDecCon(req.session.user.name,id,editTartAct,editDec,editCon,editUseCase,positions, function(err, tracerules) {
							if (err) {
								tracerules = [];
							}
				
							res.send({"editInsertActAfterDecCon":1});
						});
					});
			});

   });
}

exports.editInterBeforeActConCon=function(req,res){
	 var user=req.body.user;
 	 var id=req.body.id;
 	 var editTartAct=req.body.editTartAct;
 	 var editAct=req.body.editAct;
 	 var editCon=req.body.editCon;
 	 var editUseCase=req.body.editUseCase;
 	 var oldTarAct=req.body.oldTarAct;
 	 var oldAct=req.body.oldAct;
 	 var oldCon=req.body.oldCon;
 	 var oldUseCase=req.body.oldUseCase;
 	 var positions=req.body.positions;
	 var current_guard_id=req.body.current_guard_id;
	 var hidden_fields=req.body.hidden_fields;
	 var projectID=req.body.projectID;

	  operation_name="Insert "+oldTarAct.split(".")[1]+" before "+oldAct.split(".")[1]+" , "+oldCon.split(".")[1]+" in "+oldUseCase.split(".")[1];
	  //console.log("user:"+user+" id:"+id+" editTartAct:"+editTartAct+" editPreAct:"+editPreAct+" editUseCase:"+editUseCase+" positions:"+positions+" current_guard_id:"+current_guard_id+" hidden_fields:"+hidden_fields+" projectID:"+projectID+" operation_name:"+operation_name);
	  console.log("####################:"+operation_name);
	  ElementDepency.deleteInsertActBeforeActCon(req.session.user.name,id,operation_name,hidden_fields,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
			Tracerule.deleteInsertActBeforeActCon(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
				  ElementDepency.saveInsertActBeforeActCon(req.session.user.name,editTartAct,editAct,editCon,editUseCase,current_guard_id,function(err,elementdepencys){
	  				if(err){
	  					elementdepencys=[];
	  				}

						Tracerule.saveInsertActBeforeActCon(req.session.user.name,id,editTartAct,editAct,editCon,editUseCase,positions, function(err, tracerules) {
							if (err) {
								tracerules = [];
							}
				
							res.send({"editInsertActAfterDecCon":1});
						});
					});
			});

   });
}

exports.editInsertDecAfterAct = function(req,res){
	console.log("###editInsertDecAfterAct###");
	 var user=req.body.user;
 	 var id=req.body.id;
 	 var EditTarDec=req.body.EditTarDec;
 	 var EditPreAct=req.body.EditPreAct;
 	 var EditMainCon=req.body.EditMainCon;
 	 var EditSBCon=req.body.EditSBCon;
 	 var EditInsertAct=req.body.EditInsertAct;
 	 var EditInsertTarAct=req.body.EditInsertTarAct;
 	 var EditUseCase=req.body.EditUseCase;
 	 var OldTarDec=req.body.OldTarDec;
 	 var OldPreAct=req.body.OldPreAct;
 	 var OldMainCon=req.body.OldMainCon;
 	 var OldSBCon=req.body.OldSBCon;
 	 var OldInsertAct=req.body.OldInsertAct;
 	 var OldInsertTarAct=req.body.OldInsertTarAct;
 	 var OldUseCase=req.body.OldUseCase;
 	 var positions=req.body.positions;
	 var current_guard_id=req.body.current_guard_id;
	 var hidden_fields=req.body.hidden_fields;
	 var projectID=req.body.projectID;
	 //console.log("EditTarDec:"+EditTarDec+" EditPreAct:"+EditPreAct+" EditMainCon:"+EditMainCon+" EditSBCon:"+EditSBCon+" EditInsertAct:"+EditInsertAct+" EditInsertTarAct:"+EditInsertTarAct+" EditUseCase:"+EditUseCase+" OldTarDec:"+OldTarDec+" OldPreAct:"+OldPreAct+" OldMainCon:"+OldMainCon+" OldSBCon:"+OldSBCon+" OldInsertAct:"+OldInsertAct+" OldInsertTarAct:"+OldInsertTarAct+" OldUseCase:"+OldUseCase);
	  operation_name="Insert "+OldTarDec.split(".")[1]+" after "+OldPreAct.split(".")[1]+" with ( "+OldMainCon.split(".")[1]+" ),( "+OldSBCon.split(".")[1]+" , ";
	  	if(OldInsertAct.split!="0")
	  	operation_name=operation_name+OldInsertAct.split(".")[1]+" , "
	  	operation_name=operation_name+OldInsertTarAct.split(".")[1]+" ) in "+OldUseCase.split(".")[1];
	  //console.log("user:"+user+" id:"+id+" editTartAct:"+editTartAct+" editPreAct:"+editPreAct+" editUseCase:"+editUseCase+" positions:"+positions+" current_guard_id:"+current_guard_id+" hidden_fields:"+hidden_fields+" projectID:"+projectID+" operation_name:"+operation_name);
	  console.log("####################:"+operation_name);
	  ElementDepency.deleteInsertDecAfterAct(req.session.user.name,id,operation_name,hidden_fields,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
			Tracerule.deleteInsertDecAfterAct(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
				  ElementDepency.saveInsertDecAfterActCon(req.session.user.name,EditTarDec,EditPreAct,EditMainCon,EditSBCon,EditInsertAct,EditInsertTarAct,EditUseCase,current_guard_id,function(err,elementdepencys){
	  				if(err){
	  					elementdepencys=[];
	  				}

						Tracerule.saveInsertDecAfterActCon(req.session.user.name,id,EditTarDec,EditPreAct,EditMainCon,EditSBCon,EditInsertAct,EditInsertTarAct,EditUseCase,positions, function(err, tracerules) {
							if (err) {
								tracerules = [];
							}
				
							res.send({"editInsertDecAfterAct":1});
						});
					});
			});

   });
}

exports.editInsertDecAfterDecCon = function(req,res){

	console.log("###editInsertDecAfterDecCon###");
	 var user=req.body.user;
 	 var id=req.body.id;
 	 var EditTarDec=req.body.EditTarDec;
 	 var EditInsertDec=req.body.EditInsertDec;
 	 var EditInsertCon=req.body.EditInsertCon;
 	 var EditMainCon=req.body.EditMainCon;
 	 var EditSBCon=req.body.EditSBCon;
 	 var EditInsertAct=req.body.EditInsertAct;
 	 var EditInsertTarAct=req.body.EditInsertTarAct;
 	 var EditUseCase=req.body.EditUseCase;
 	 var OldTarDec=req.body.OldTarDec;
 	 var OldInsertDec=req.body.OldInsertDec;
 	 var OldInsertCon=req.body.OldInsertCon;
 	 var OldMainCon=req.body.OldMainCon;
 	 var OldSBCon=req.body.OldSBCon;
 	 var OldInsertAct=req.body.OldInsertAct;
 	 var OldInsertTarAct=req.body.OldInsertTarAct;
 	 var OldUseCase=req.body.OldUseCase;
 	 var positions=req.body.positions;
	 var current_guard_id=req.body.current_guard_id;
	 var hidden_fields=req.body.hidden_fields;
	 var projectID=req.body.projectID;
	 operation_name="Insert "+OldTarDec.split(".")[1]+" after ( "+OldInsertDec.split(".")[1]+" , "+OldInsertCon.split(".")[1]+" ) "+" with ( "+OldMainCon.split(".")[1]+" ),( "+OldSBCon.split(".")[1]+" , "+OldInsertAct.split(".")[1]+" , "+OldInsertTarAct.split(".")[1]+" ) in "+OldUseCase.split(".")[1];
	  console.log("hidden_fields:"+hidden_fields);
	  ElementDepency.deleteInsertDecAfterDecCon(req.session.user.name,id,operation_name,hidden_fields,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
			Tracerule.deleteInsertDecAfterDecCon(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
				  ElementDepency.saveInsertDecAfterDecCon(req.session.user.name,EditTarDec,EditInsertDec,EditInsertCon,EditMainCon,EditSBCon,EditInsertAct,EditInsertTarAct,EditUseCase,current_guard_id,function(err,elementdepencys){
	  				if(err){
	  					elementdepencys=[];
	  				}

						Tracerule.saveInsertDecAfterDecCon(req.session.user.name,id,EditTarDec,EditInsertDec,EditInsertCon,EditMainCon,EditSBCon,EditInsertAct,EditInsertTarAct,EditUseCase,positions, function(err, tracerules) {
							if (err) {
								tracerules = [];
							}
				
							res.send({"editInsertDecAfterAct":1});
						});
					});
			});

   });
}

exports.editInsertDecBeforeAct = function(req,res){
	console.log("###editInsertDecAfterDecCon###");
	 var user=req.body.user;
 	 var id=req.body.id;
 	 var EditTarDec=req.body.EditTarDec;
 	 var EditPostAct=req.body.EditPostAct;
 	 var EditCon1=req.body.EditCon1;
 	 var EditTart1=req.body.EditTart1;
 	 var EditCon2=req.body.EditCon2;
 	 var EditTart2=req.body.EditTart2;
 	 var EditUseCase=req.body.EditUseCase;
 	 var OldTarDec=req.body.OldTarDec;
 	 var OldPostAct=req.body.OldPostAct;
 	 var OldCon1=req.body.OldCon1;
 	 var OldTart1=req.body.OldTart1;
 	 var OldCon2=req.body.OldCon2;
 	 var OldTart2=req.body.OldTart2;
 	 var OldUseCase=req.body.OldUseCase;
 	 var positions=req.body.positions;
	 var current_guard_id=req.body.current_guard_id;
	 var hidden_fields=req.body.hidden_fields;
	 var projectID=req.body.projectID;
	 operation_name="Insert "+OldTarDec.split(".")[1]+" before "+OldPostAct.split(".")[1]+" with ( "+OldCon1.split(".")[1]+" , "+OldTart1.split(".")[1]+" ),( "+OldCon2.split(".")[1]+" , "+OldTart2.split(".")[1]+" ) in "+OldUseCase.split(".")[1];
	 console.log("Old operation_name:"+operation_name);
	  ElementDepency.deleteInsertDecBeforeAct(req.session.user.name,id,operation_name,hidden_fields,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
			Tracerule.deleteInsertDecBeforeAct(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
				  ElementDepency.saveInsertDecBeforeAct(req.session.user.name,EditTarDec,EditPostAct,EditCon1,EditTart1,EditCon2,EditTart2,EditUseCase,current_guard_id,function(err,elementdepencys){
	  				if(err){
	  					elementdepencys=[];
	  				}

						Tracerule.saveInsertDecBeforeAct(req.session.user.name,id,EditTarDec,EditPostAct,EditCon1,EditTart1,EditCon2,EditTart2,EditUseCase,positions, function(err, tracerules) {
							if (err) {
								tracerules = [];
							}
				
							res.send({"editInsertDecAfterAct":1});
						});
					});
			});

   });
}

exports.editInsertDecBeforeActWith = function(req,res){
	console.log("###editInsertDecBeforeActWith###");
	 var user=req.body.user;
 	 var id=req.body.id;
 	 var EditTarDec=req.body.EditTarDec;
 	 var EditPostAct=req.body.EditPostAct;
 	 var EditMainCon=req.body.EditMainCon;
 	 var EditSBCon=req.body.EditSBCon;
 	 var EditInsertAct=req.body.EditInsertAct;
 	 var EditInsertTarDec=req.body.EditInsertTarDec;
 	 var EditUseCase=req.body.EditUseCase;
 	 var OldTarDec=req.body.OldTarDec;
 	 var OldPostAct=req.body.OldPostAct;
 	 var OldMainCon=req.body.OldMainCon;
 	 var OldSBCon=req.body.OldSBCon;
 	 var OldInsertAct=req.body.OldInsertAct;
 	 var OldInsertTarDec=req.body.OldInsertTarDec;
 	 var OldUseCase=req.body.OldUseCase;
 	 var positions=req.body.positions;
	 var current_guard_id=req.body.current_guard_id;
	 var hidden_fields=req.body.hidden_fields;
	 var projectID=req.body.projectID;
	 //console.log("EditTarDec:"+EditTarDec+" EditPreAct:"+EditPreAct+" EditMainCon:"+EditMainCon+" EditSBCon:"+EditSBCon+" EditInsertAct:"+EditInsertAct+" EditInsertTarAct:"+EditInsertTarAct+" EditUseCase:"+EditUseCase+" OldTarDec:"+OldTarDec+" OldPreAct:"+OldPreAct+" OldMainCon:"+OldMainCon+" OldSBCon:"+OldSBCon+" OldInsertAct:"+OldInsertAct+" OldInsertTarAct:"+OldInsertTarAct+" OldUseCase:"+OldUseCase);
	  operation_name="Insert "+OldTarDec.split(".")[1]+" before "+OldPostAct.split(".")[1]+" with ( "+OldMainCon.split(".")[1]+" ),( "+OldSBCon.split(".")[1]+" , "+OldInsertAct.split(".")[1]+" , "+OldInsertTarDec.split(".")[1]+" ) in "+OldUseCase.split(".")[1];
	  //console.log("user:"+user+" id:"+id+" editTartAct:"+editTartAct+" editPreAct:"+editPreAct+" editUseCase:"+editUseCase+" positions:"+positions+" current_guard_id:"+current_guard_id+" hidden_fields:"+hidden_fields+" projectID:"+projectID+" operation_name:"+operation_name);
	  console.log("####################:"+operation_name);

	  ElementDepency.deleteInsertDecBeforeActWith(req.session.user.name,id,operation_name,hidden_fields,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
			Tracerule.deleteInsertDecBeforeActWith(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
				  ElementDepency.saveInsertDecBeforeAct(req.session.user.name,EditTarDec,EditPostAct,EditMainCon,EditSBCon,EditInsertAct,EditInsertTarDec,EditUseCase,current_guard_id,function(err,elementdepencys){
	  				if(err){
	  					elementdepencys=[];
	  				}

						Tracerule.saveInsertDecBeforeActWith(req.session.user.name,id,EditTarDec,EditPostAct,EditMainCon,EditSBCon,EditInsertAct,EditInsertTarDec,EditUseCase,positions, function(err, tracerules) {
							if (err) {
								tracerules = [];
							}
				
							res.send({"editInsertDecAfterAct":1});
						});
					});
			});

   });
}

exports.editInsertDecBeforeActCon = function(req,res){
	console.log("###editInsertDecBeforeActCon###");
	 var user=req.body.user;
 	 var id=req.body.id;
 	 var EditTarDec=req.body.EditTarDec;
 	 var EditInsertAct=req.body.EditInsertAct;
 	 var EditInsertCon=req.body.EditInsertCon;
 	 var EditMainCon=req.body.EditMainCon;
 	 var EditSBCon=req.body.EditSBCon;
 	 var EditInsertAct=req.body.EditInsertAct;
 	 var EditInsertTarDec=req.body.EditInsertTarDec;
 	 var EditUseCase=req.body.EditUseCase;
 	 var OldTarDec=req.body.OldTarDec;
 	 var OldInsertAct=req.body.OldInsertAct;
 	 var OldInsertCon=req.body.OldInsertCon;
 	 var OldMainCon=req.body.OldMainCon;
 	 var OldSBCon=req.body.OldSBCon;
 	 var OldInsertAct=req.body.OldInsertAct;
 	 var OldInsertTarDec=req.body.OldInsertTarDec;
 	 var OldUseCase=req.body.OldUseCase;
 	 var positions=req.body.positions;
	 var current_guard_id=req.body.current_guard_id;
	 var hidden_fields=req.body.hidden_fields;
	 var projectID=req.body.projectID;
	 operation_name="Insert "+OldTarDec.split(".")[1]+" before ( "+OldInsertAct.split(".")[1]+" , "+OldInsertCon.split(".")[1]+" ) "+" with ( "+OldMainCon.split(".")[1]+" ),( "+OldSBCon.split(".")[1]+" , "+OldInsertAct.split(".")[1]+" , "+OldInsertTarDec.split(".")[1]+" ) in "+OldUseCase.split(".")[1];
	  console.log("hidden_fields:"+hidden_fields);
	  ElementDepency.deleteInsertDecBeforeActCon(req.session.user.name,id,operation_name,hidden_fields,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
			Tracerule.deleteInsertDecBeforeActCon(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
				
				  ElementDepency.saveInsertDecBeforeActCon(req.session.user.name,EditTarDec,EditInsertAct,EditInsertCon,EditMainCon,EditSBCon,EditInsertAct,EditInsertTarDec,EditUseCase,current_guard_id,function(err,elementdepencys){
	  				if(err){
	  					elementdepencys=[];
	  				}

						Tracerule.saveInsertDecBeforeActCon(req.session.user.name,id,EditTarDec,EditInsertAct,EditInsertCon,EditMainCon,EditSBCon,EditInsertAct,EditInsertTarDec,EditUseCase,positions, function(err, tracerules) {
							if (err) {
								tracerules = [];
							}
				
							res.send({"editInsertDecAfterAct":1});
						});
					});
			});

   });
}

exports.insertActAfterPreDialog = function(req, res) {
	  console.log("content:"+req.params.content);
	  var $temp=req.params.content.split("_");
	  var $projectID=$temp[0];
	  var $currentID=$temp[1];
	  ElementDepency.get(req.session.user.name,$projectID,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}

					res.render('InsertActAfterPre', {
						"layout":false,
						elementdepencys : elementdepencys,
						current_guard   : $currentID
				});	
		
	});
  	  
};

exports.insertActBeforePostDialog = function(req, res) {
	  var $temp=req.params.content.split("_");
	  var $projectID=$temp[0];
	  var $currentID=$temp[1];
	  ElementDepency.get(req.session.user.name,$projectID,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}
				
					res.render('InsertActBeforePost', {
						"layout":false,
						elementdepencys : elementdepencys,
						current_guard : $currentID
				});	
			
		
	});
  	  
};

exports.insertActAfterDecConDialog = function(req, res) {
		var $temp=req.params.content.split("_");
	  var $projectID=$temp[0];
	  var $currentID=$temp[1];
	  ElementDepency.get(req.session.user.name,$projectID,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}
				
					res.render('InsertActAfterDecCon', {
						"layout":false,
						elementdepencys : elementdepencys,
						current_guard : $currentID
				});	
	});
  	  
};

exports.insertActBeforeActConDialog = function(req, res) {
	  var $temp=req.params.content.split("_");
	  var $projectID=$temp[0];
	  var $currentID=$temp[1];
	  ElementDepency.get(req.session.user.name,$projectID,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}
				
					res.render('InsertActBeforeActCon', {
						"layout":false,
						elementdepencys : elementdepencys,
						current_guard : $currentID
				});	
			
		
	});
  	  
};

exports.insertDecAfterActDialog = function(req, res) {
	  var $temp=req.params.content.split("_");
	  var $projectID=$temp[0];
	  var $currentID=$temp[1];
	  ElementDepency.get(req.session.user.name,$projectID,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}
				
					res.render('InsertDecAfterAct', {
						"layout":false,
						elementdepencys : elementdepencys,
						current_guard : $currentID
				});	
			
		
	});
  	  
};

exports.insertDecAfterDecConDialog = function(req, res) {
	  var $temp=req.params.content.split("_");
	  var $projectID=$temp[0];
	  var $currentID=$temp[1];

	  ElementDepency.get(req.session.user.name,$projectID,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}
				
					res.render('InsertDecAfterDecCon', {
						"layout":false,
						elementdepencys : elementdepencys,
						current_guard : $currentID
				});	
			
		
	});
  	  
};

exports.insertDecBeforeActDialog = function(req, res) {
	  var $temp=req.params.content.split("_");
	  var $projectID=$temp[0];
	  var $currentID=$temp[1];	

	  ElementDepency.get(req.session.user.name,$projectID,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}
				
					res.render('InsertDecBeforeAct', {
						"layout":false,
						elementdepencys : elementdepencys,
						current_guard : $currentID
				});	
			
		
	});
  	  
};

exports.insertDecBeforeActWithDialog = function(req, res) {
	  var $temp=req.params.content.split("_");
	  var $projectID=$temp[0];
	  var $currentID=$temp[1];	

	  ElementDepency.get(req.session.user.name,$projectID,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}
				
					res.render('InsertDecBeforeActWith', {
						"layout":false,
						elementdepencys : elementdepencys,
						current_guard : $currentID
				});	
			
		
	});
  	  
};

exports.insertDecBeforeDecConDialog = function(req, res) {
		
	  ElementDepency.get(req.session.user.name,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}
				
					res.render('InsertDecBeforeDecCon', {
						"layout":false,
						elementdepencys : elementdepencys,
						current_guard : req.params.content
				});	
			
		
	});
  	  
};

exports.insertDecBeforeActConDialog = function(req, res) {
	  var $temp=req.params.content.split("_");
	  var $projectID=$temp[0];
	  var $currentID=$temp[1];	

	  ElementDepency.get(req.session.user.name,$projectID,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}
				
					res.render('InsertDecBeforeActCon', {
						"layout":false,
						elementdepencys : elementdepencys,
						current_guard : $currentID
				});	
			
		
	});
  	  
};



//feature model related

exports.addNewFeature = function(req,res){
  console.log("\n" + req.body.text + "在index.js中的 \"addNewFeature\"开始了！");
  console.log("req.body.projectID:"+req.body.projectID);
  var newFeature = new Feature({
		text        : req.body.text        ,
		parent_id   : req.body.parent_id   ,
		description : req.body.description ,
		root        : req.body.root        ,
		optionality : req.body.optionality ,
		VP          : req.body.VP          ,
		level       : parseInt(req.body.level),
		projectID   : req.body.projectID,
  });

Feature.getByTextAndRoot(newFeature.text, newFeature.root,req.body.projectID,req.body.parent_id, function(err, feature) {
  	console.log("haha"+newFeature.text);
  	if (feature)
  	  err = 'Feature already exists.';
  	if (err) {
  		req.flash('error', err);
  		console.log("Feature already exists.");
  		return res.redirect('/');
  	}
  	newFeature.save(function(err) {
  		if (err)  {
  			req.flash('error', err);
  			return res.redirect('/');
  		}
  		
 			Feature.getByTextAndRoot(newFeature.text, newFeature.root,req.body.projectID,req.body.parent_id, function(err, thefeature) {
 				if (!thefeature)
 					err = 'Feature has not be inserted.';
 				if (err) {
 					req.flash('error', err);
 					console.log("Feature has not be inserted.");
 					return res.redirect('/');
 				}
 				res.send({'_id': thefeature._id});
 				console.log("ADD NEW FEATURE: SUCCESS");
 			});
  	});
  });
};

exports.loadFeatureModel = function(req,res){
	console.log("START \"loadFeatureModel\"");
	console.log(req.body.projectID);
	Feature.getByProject(req.body.projectID,function(err, Features) {
		/*
		if (err) {
			console.log("LOAD FEATURE MODLE: FAIL");
			req.flash('error', err);
			return res.redirect('/F/'+req.body.projectID);
		}
		*/
		console.log(Features);
		res.send({'features': Features});
		
		console.log("FINISH SENDING")
	});
};

exports.removeFeature = function(req,res) {
	console.log("START \"removeFeature\"");
	var _id = req.body._id;
	Feature.remove(_id, function(err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		res.send({});
		console.log("DELETE FEATURE: SUCCESS");
	});
};

exports.removeSubtree = function(req,res) {
	console.log("START \"removeSubtree\"");
	var _id = req.body._id;
	Feature.removeSubtree(_id, function(err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		res.send({});
		console.log("DELETE SUBTREE: SUCCESS");
	});
};

exports.updateText = function(req,res) {
	console.log("START \"updateText\"");
	var _id = req.body._id;
	var newText = req.body.text;
	Feature.updateText(_id, newText, function(err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		console.log("UPDATE NAME: SUCCESS");
	});
};

exports.updateDescription = function(req,res) {
	console.log("START \"updateDescription\"");
	var _id = req.body._id;
	var newDescription = req.body.description;
	Feature.updateDescription(_id, newDescription, function(err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		console.log("UPDATE DESCRIPTION: SUCCESS");
	});
};

exports.updateOptionality = function(req,res) {
	console.log("START \"updateOptionality\"");
	var _id = req.body._id;
	var newOptionality = req.body.optionality;
	Feature.updateOptionality(_id, newOptionality, function(err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		console.log("UPDATE OPTIONALITY: SUCCESS");
	});
};

exports.updateParent_id = function(req,res) {
	console.log("START \"updateParent_id\"");
	var _id = req.body._id;
	var newParent_id = req.body.parent_id;
	Feature.updateParent_id(_id, newParent_id, function(err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		console.log("UPDATE PARENT: SUCCESS");
	});
};

exports.updateVP = function(req,res) {
	console.log("START \"updateVP\"");
	var _id = req.body._id;
	var newVP = req.body.VP;
	Feature.updateVP(_id, newVP, function(err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		console.log("UPDATE VP: SUCCESS");
	});
};

exports.addNewConstraint = function(req,res) {
	console.log("index.js中的 \"addNewConstraint\"开始了！");
  var newConstraint = new Constraint({
		left       : req.body.left     ,
		relation   : req.body.relation ,
		right      : req.body.right    ,
		projectID  : req.body.projectID,
  });
  Constraint.get(newConstraint, function(err, constraint) {
  	if (constraint)
  	  err = 'Constraint already exists.';
  	if (err) {
  		req.flash('error', err);
  		console.log("Constraint already exists.");
  		return res.redirect('/');
  	}
  	newConstraint.save(function(err) {
  		if (err)  {
  			req.flash('error', err);
  			return res.redirect('/');
  		}
 			Constraint.get(newConstraint, function(err, theconstraint) {
 				if (!theconstraint)
 					err = 'Constraint has not be inserted.';
 				if (err) {
 					req.flash('error', err);
 					console.log("Constraint has not be inserted.");
 					return res.redirect('/');
 				}
 				res.send({'_id': theconstraint._id});
 				console.log("ADD NEW CONSTRAINT: SUCCESS");
 			});
  	});
  });
};

exports.getFeatureById = function(req, res) {
	console.log("START \"getFeatureById\"");
	var _id = req.body._id;
	//console.log(_id + '\n');
	Feature.getById(_id, function(err, feature) {
		if (err) {
			console.log("GET FEATURE BY ID FAILED");
			req.flash('error', err);
			return res.redirect('/');
		}
		res.send({'feature':feature});
	});
};

exports.getSonsById = function(req, res) {
	console.log("START \"getSonsById\"");
	var _id = req.body._id;
	Feature.getSonsById(_id, function(err, sons){
		if (err) {
			console.log("GET SONS BY ID FAILED");
			req.flash('error', err);
			return res.redirect('/');
		}
		res.send({'sons':sons});
		console.log("FINISH SENDING");
	});
};

exports.loadConstraints = function(req,res) {
	var $projectID=req.body.projectID;
	console.log("START \"loadConstraints\"");
	Constraint.getById($projectID,function(err,Constraints){
		if (err) {
			console.log("LOAD CONSTRAINT: FAIL");
			req.flash('error', err);
			return res.redirect('/');
		}
		res.send({'constraints': Constraints});
		console.log("FINISH SENDING");
	})
};

exports.removeConstraint = function(req,res) {
	console.log("START \"removeConstraint\"");
	var _id = req.body._id;
	Constraint.remove(_id, function(err){ 
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		res.send({});
		console.log("DELETE CONSTRAINT: SUCCESS");
	});
};

exports.configurationTree = function(req,res){
	res.render('configurationTree', {
						"layout":false,
						
				});	
};

exports.addTraceRule = function(req, res){
	
 	  var $user=req.body.user;
 	 var $id=req.body.id;
 	 var $selfname=req.body.selfname;
 	 var $guardname=req.body.guardname;
 	 var $positionss=req.body.operation_position;
 	 var $current_guard_id=req.body.current_guard_id;
 	 var $projectID=req.body.projectID;
 	 var $newGuardId;
 	 console.log($user+" "+$id+" "+$selfname+" "+$guardname+" "+$positionss+" "+$current_guard_id+" "+$projectID);
 	 

 	if($id!=""){
	Tracerule.savePositions($user,$id,$positionss,function(err){
		
 	 Tracerule.getByName($user,$projectID,$guardname, function(err,tracerule ) {
		if (tracerule)
			err = 'Guardname already exists.';
		if (err) {
			req.flash('error', err);
			return res.redirect('/T/'+$current_guard_id);
		}
		console.log("1");
		 Tracerule.getBySelfName($user,$projectID,$selfname, function(err,tracerule ) {
			if (tracerule)
				err = 'Selfname already exists.';
			if (err) {
				req.flash('error', err);
				return res.redirect('/T/'+$current_guard_id);
			}

				Tracerule.addNewTraceRule($user,$guardname,$selfname,$projectID,function(err,tracerules){
					if (err) {
						req.flash('error', err);
						return res.redirect('/T/'+$current_guard_id);
					}
					Tracerule.returnIDByName($user,$projectID,$guardname, function(err,returnID) {
						console.log("$$$$$ "+returnID);
						
    					$newGuardId=returnID;
/*
    					NewGuard.save(function(err,guardlists) {
							if (err) {
								req.flash('error', err);
								return res.redirect('/T/'+current_guard_id);
							}
*/
				console.log($newGuardId+" %%%%%");
 				Guardlist.addNewGuardList($user,$selfname,$newGuardId,$projectID, function(err, guardlists) {
					if (err) {
						guradlists = [];
							}
								var $subroute=$projectID+"_"+returnID;
								res.send({"newGuardID":$newGuardId});
								/*
								Post.get(null, function(err, posts) {
									if (err) {
										posts = [];
									}
									 ElementDepency.get(req.session.user.name,$projectID,function(err,elementdepencys){
	  									if(err){
	  										console.log("elementdepencys is null!");
	  										elementdepencys=[];
	  									}
	  									console.log("haha:"+tracerules.length);
	  									res.render('TTT', {
											title : 'Traceability',
											posts : posts,
											guardlists : guardlists,
											tracerules : tracerules,
											elementdepencys : elementdepencys,
											projectID: $projectID,
											user : req.session.user,
											current_guard : returnID,
											success : req.flash('success').toString(),
											error : req.flash('error').toString()
										});	
	  									
	  								});

								});*/
							
			
						});				
					});
				});
		
		});
	});
  });
 }else{
 	Tracerule.getByName($user,$projectID,$guardname, function(err,tracerule ) {
		if (tracerule)
			err = 'Guardname already exists.';
		if (err) {
			req.flash('error', err);
			return res.redirect('/T/'+$current_guard_id);
		}
		console.log("1");
		 Tracerule.getBySelfName($user,$projectID,$selfname, function(err,tracerule ) {
			if (tracerule)
				err = 'Selfname already exists.';
			if (err) {
				req.flash('error', err);
				return res.redirect('/T/'+$current_guard_id);
			}

				Tracerule.addNewTraceRule($user,$guardname,$selfname,$projectID,function(err,tracerules){
					if (err) {
						req.flash('error', err);
						return res.redirect('/T/'+$current_guard_id);
					}
					Tracerule.returnIDByName($user,$projectID,$guardname, function(err,returnID) {
						console.log("$$$$$ "+returnID);
						
    					$newGuardId=returnID;
/*
    					NewGuard.save(function(err,guardlists) {
							if (err) {
								req.flash('error', err);
								return res.redirect('/T/'+current_guard_id);
							}
*/
				console.log($newGuardId+" %%%%%");
 				Guardlist.addNewGuardList($user,$selfname,$newGuardId,$projectID, function(err, guardlists) {
					if (err) {
						guradlists = [];
							}
								var $subroute=$projectID+"_"+returnID;
								res.send({"newGuardID":$newGuardId});
								/*
								Post.get(null, function(err, posts) {
									if (err) {
										posts = [];
									}
									 ElementDepency.get(req.session.user.name,$projectID,function(err,elementdepencys){
	  									if(err){
	  										console.log("elementdepencys is null!");
	  										elementdepencys=[];
	  									}
	  									console.log("haha:"+tracerules.length);
	  									res.render('TTT', {
											title : 'Traceability',
											posts : posts,
											guardlists : guardlists,
											tracerules : tracerules,
											elementdepencys : elementdepencys,
											projectID: $projectID,
											user : req.session.user,
											current_guard : returnID,
											success : req.flash('success').toString(),
											error : req.flash('error').toString()
										});	
	  									
	  								});

								});*/
							
			
						});				
					});
				});
		
		});
	});
 }
}

exports.addTraceRuleZero = function(req, res){
	
 	 
 	 var $selfname=req.body.selfname;
 	 var $guardname=req.body.guardname;
 	 var $projectID=req.body.projectID;
 	 var $newGuardId;

				Tracerule.addNewTraceRule(req.session.user.name,$guardname,$selfname,$projectID,function(err,tracerules){
					if (err) {
						req.flash('error', err);
						return res.redirect('/T/'+$current_guard_id);
					}
					Tracerule.returnIDByName(req.session.user.name,$projectID,$guardname, function(err,returnID) {
						console.log("$$$$$ "+returnID);
				
    					$newGuardId=returnID;
/*
    					NewGuard.save(function(err,guardlists) {
							if (err) {
								req.flash('error', err);
								return res.redirect('/T/'+current_guard_id);
							}
*/
				console.log($newGuardId+" %%%%%");
 				Guardlist.addNewGuardList(req.session.user.name,$selfname,$newGuardId,$projectID, function(err, guardlists) {
					if (err) {
						guradlists = [];
							}
								var $subroute=$projectID+"_"+$newGuardId;
								res.send({"newGuardID":$newGuardId});
								/*
								Post.get(null, function(err, posts) {
									if (err) {
										posts = [];
									}
									 ElementDepency.get(req.session.user.name,$projectID,function(err,elementdepencys){
	  									if(err){
	  										console.log("elementdepencys is null!");
	  										elementdepencys=[];
	  									}
	  									res.render('T', {
											title : 'Traceability',
											posts : posts,
											guardlists : guardlists,
											tracerules : tracerules,
											elementdepencys : elementdepencys,
											user : req.session.user,
											projectID:$projectID,
											current_guard : $newGuardId,
											success : req.flash('success').toString(),
											error : req.flash('error').toString()
										});	
	  									
	  								});

								});*/
							
			
						});				
					});
				});
	
  
}

exports.editTraceRule = function(req, res){
	
 	  var $user=req.body.user;
 	 var $id=req.body.id;
 	 var $selfname=req.body.selfname;
 	 var $guardname=req.body.guardname;
 	 var $positionss=req.body.operation_position;
 	 var $current_guard_id=req.body.current_guard_id;
 	 var $projectID=req.body.projectID;
 	 var $newGuardId;
 	 console.log($user+" "+$id+" "+$selfname+" "+$guardname+" "+$positionss+" "+$current_guard_id);
 	 

 	
	Tracerule.editTraceRuleGuardSelfname($user,$id,$guardname,$selfname,$positionss,function(err,tracerules){


 				Guardlist.updateSelfname($user,$current_guard_id, $selfname,function(err, guardlists) {
					if (err) {
						guradlists = [];
							}
								
					res.send({"editTracerule":1});
	  											
						});				
		
  });
}


exports.C = function(req, res) {

	console.log("T route:"+req.params.content);
	var $temp=req.params.content;
	var $projectID;
	var $current_guard;
	//console.log("index:"+$temp.indexOf("_"));
	if($temp.indexOf("_")==-1)
	 {	
	 	 $projectID=$temp;
	 	 $current_guard=null;
	 }
	else{
		
		var tempContent=$temp.split("_");
		$projectID=tempContent[0];
		$current_guard=tempContent[1];
	}

	Configuration.get(req.session.user.name,$projectID,null,function(err,configurations){
		res.render('C', {
		title: 'Configuration',
		user : req.session.user,
		configurations:configurations,
		current_configuration_id:$current_guard,
		projectID:$projectID,
		success : req.flash('success').toString(),
		error : req.flash('error').toString()
    });
	})
	
};


exports.newConfiguration=function(req,res){
	var $configurationname=req.body.configurationname;
	var $projectID=req.body.projectID;
	var $current_configuration_id;

	Configuration.addNewConfiguration(req.session.user.name,$projectID,$configurationname,function(err,configurations,currentID){

		res.send({"currentID":currentID});
	});
};

exports.deleteConfiguration=function(req,res){
	
	var $deleteId=req.body.deleteID;
	var $current_configuration_id=req.body.current_configuration_id;
	var $projectID=req.body.projectID;

	Configuration.removeConfiguration(req.session.user.name,$deleteId,function(err,configurations){
		res.send({"deleteId":$deleteId});
	});
};

exports.EditConfigName=function(req,res){
	
	Configuration.editConfigName(req.session.user.name,req.body.configname,req.body.editID,function(err) {
		console.log("edit configuration name success!");
		});
}

exports.EditConfig=function(req,res){
	
	Configuration.editConfig(req.session.user.name,req.body.current_configuration_id,req.body.selectedElement,function(err) {
		console.log("edit configuration name success!");
		});
}

exports.GenerateUseCase=function(req,res){
	console.log("############GenerateUseCase:#################");
	console.log("current_configuration_id:"+req.body.current_configuration_id);
	console.log("projectID:"+req.body.projectID);
	Tracerule.get(req.session.user.name,req.body.projectID,null, function(err, tracerules) {
			if (err) {
				tracerules = [];
			}
			
			ElementDepency.get(req.session.user.name,req.body.projectID,function(err,elementdepencys){
	  			if(err){
	  				elementdepencys=[];
	  			}
	  			Feature.getByProject(req.body.projectID,function(err, features) {
					if (err) {
						return res.redirect('/C');
						}
					Configuration.get(req.session.user.name,req.body.projectID,req.body.current_configuration_id,function(err,configurations){
						Configuration.generateUseCase(req.session.user.name,req.body.current_guard_id,tracerules,elementdepencys,features,configurations,function(err,result,casename){
						console.log("Generate Use Case");
						console.log("case seq:"+casename);
						console.log("lalala");
						if(err){
							res.send(err);
						}else{
							Configuration.saveUsecase(req.session.user.name,req.body.projectID,req.body.current_configuration_id,casename,result,function(err,theresult){
								var results=new Array();
								for(key in theresult)
									results[key]=theresult[key];
								res.send(results);
							})
						}
					});
				});
			});	
	  	})
	})
}

exports.GetUseCase=function(req,res){
	console.log("projectID:"+req.body.projectID+" id:"+req.body.current_configuration_id);
	Configuration.getUseCase(req.session.user.name,req.body.projectID,req.body.current_configuration_id,function(err,usecase){
								var results=new Array();
								console.log("usecase:"+usecase);
								for(key in usecase)
									results[key]=usecase[key];
								res.send(results);
	})
}

exports.newProject=function(req,res){
		console.log(req.params.content);
		var param=req.params.content.split("分");
		var $projectname=param[0];
		var $projectinfo=param[1];
		Project.addNewProject(req.session.user.name,$projectname,$projectinfo,function(err,projects,current_id){
			res.redirect('/');
		});
}

exports.DeleteProject=function(req,res){
		var $deleteID=req.params.content;
		Project.deleteProject(req.session.user.name,$deleteID,function(err,projects){
			res.redirect('/');
		})
}

exports.updateProjectName=function(req,res){
	
	
	Project.updateProjectname(req.session.user.name,req.body.editID,req.body.selfname,function(err,projects,current_id){
		res.redirect('/'); 
	})
}


exports.showInformation=function(req,res){
	
	Project.getByID(req.session.user.name,req.body.showID,function(err,theproject) {
		res.send(theproject);
		});
}

exports.editProject=function(req,res){
	console.log("current_id:"+req.body.current_id+" name:"+req.body.newName+" description:"+req.body.newDescription);
	Project.editProject(req.session.user.name,req.body.current_id,req.body.newName,req.body.newDescription,function(err,theproject,id){
		res.send(theproject);
	})
}


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

exports.index = function(req, res){
	Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		res.render('index', {
			title: '首页',
			posts : posts,
			user : req.session.user,
			success : req.flash('success').toString(),
			error : req.flash('error').toString()
		});
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
	res.render('F', {
		title: 'Feature Model',
		user : req.session.user,
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

exports.doT = function(req, res) {
 /*	console.log("selfname:"+req.body.selfname);
	
	console.log("user:"+req.body.user);
	console.log("name:"+req.body.name);
	console.log("selfname:"+req.body.id);
 */

 console.log(req.params.content);
 var param=req.params.content.split("分");
 var selfname=param[0];
 var user=param[1];
 var name=param[2];
 var id=param[3];
 var current_guard_id=param[4];
 console.log("doT: selfname:"+selfname+" user:"+user+" name:"+name+" id:"+id+" guard:"+current_guard_id);
 
	Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
	  ElementDepency.get(req.session.user.name,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}
		Guardlist.updateSelfname(req.session.user.name, id,selfname,function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.updateSelfname(selfname,req.session.user.name,name,id, function(err, tracerules) {
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
	})

	
	//res.redirect('/T');
};

exports.deleteTraceRule = function(req, res) {

 console.log(req.params.content);
 	var param=req.params.content.split("分");
 	var username=param[0];
 	var deleteID=param[1];
 	var positions=param[2];
 	var current_guard_id=param[3];
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

exports.createActivity = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var activityname=param[2];
 	 var activitydescription=param[3];
 	 var activityexecutor=param[4];
 	 //var activityvirtual=param[5];
 	 var current_accordion=param[5];
 	 //var positions=param[7].split("位置");
 	 var positions=param[6];
	 var current_guard_id=param[7];
     var type="activity";
 	 console.log(user+" "+id+" "+activityname+" "+activitydescription+" "+activityexecutor+" position:"+positions);
 	 
 	 ElementDepency.get(req.session.user.name,function(err,elementdepencys){
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
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		 var newDepency = new ElementDepency({
					user: req.session.user.name,
					element:activityname,
					dependee:current_guard_id
    		});
		  ElementDepency.saveDependee(req.session.user.name,activityname,current_guard_id,type,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
	  		
 	 	Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.createActivity(req.session.user.name,id,activityname,activitydescription,activityexecutor,current_accordion,positions, function(err, tracerules) {
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
  }); //end post
	}
 }); // elementdepency.get
}

exports.EditActivity=function(req,res){
	Tracerule.EditActivity(req.session.user.name, req.body.operationName,req.body.activityName,req.body.activityDescription,req.body.activityExecutor,req.body.activityVirual,req.body.operation_position,req.body.current_guard_id,function(err, trace) {
		console.log("edit Activity success!");
		});
};

exports.createUseCase = function(req, res){
	 console.log("create Use Case: "+req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var usecasename=param[2];
 	 var usecasedescription=param[3];
 	 var positions=param[4];
	 var current_guard_id=param[5];
	 var type="UseCase";

	 ElementDepency.get(req.session.user.name,function(err,elementdepencys){
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

 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
	  ElementDepency.saveDependee(req.session.user.name,usecasename,current_guard_id,type,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}
 	 	Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.createUseCase(req.session.user.name,id,usecasename,usecasedescription,positions, function(err, tracerules) {
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
 });
}

exports.createDecision = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var decisionname=param[2];
 	 var decisiondescription=param[3];
 	 var decisionexecutor=param[4];
 	
 	 var positions=param[5];
	 var current_guard_id=param[6];
	 var type="decision";

 	 console.log(user+" "+id+" "+decisionname+" "+decisiondescription+" "+decisionexecutor+" "+" position:"+positions);
 	 
 	 ElementDepency.get(req.session.user.name,function(err,elementdepencys){
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

 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
	  ElementDepency.saveDependee(req.session.user.name,decisionname,current_guard_id,type,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}

 	 	Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.createDecision(req.session.user.name,id,decisionname,decisiondescription,decisionexecutor,positions, function(err, tracerules) {
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
 });
}

exports.createCondition = function(req, res){
	 console.log("Condition:"+req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var conditionname=param[2];
 	 var conditiondescription=param[3];
 	 var positions=param[4];
	 var current_guard_id=param[5];
	 var type="condition";

	 ElementDepency.get(req.session.user.name,function(err,elementdepencys){
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
			req.flash('error', err);
			return res.redirect('/T/'+current_guard_id);
		}else{

 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
	  ElementDepency.saveDependee(req.session.user.name,conditionname,current_guard_id,type,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}
 	 	Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.createCondition(req.session.user.name,id,conditionname,conditiondescription,positions, function(err, tracerules) {
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
	 console.log("insertActAfterPre:"+req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var TarAct=param[2];
 	 var PreAct=param[3];
	 var UseCase=param[4];
	 var positions=param[5];
	 var current_guard_id=param[6];
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
	  ElementDepency.saveInsertActAfterPre(req.session.user.name,TarAct,PreAct,UseCase,current_guard_id,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}
 	 	Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.saveInsertActAfterPre(req.session.user.name,id,TarAct,PreAct,UseCase,positions, function(err, tracerules) {
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

exports.insertActBeforePost = function(req, res){
	 
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var TarAct=param[2];
 	 var PostAct=param[3];
	 var UseCase=param[4];
	 var positions=param[5];
	 var current_guard_id=param[6];
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
	  ElementDepency.saveInsertActBeforePost(req.session.user.name,TarAct,PostAct,UseCase,current_guard_id,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}
 	 	Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.saveInsertActBeforePost(req.session.user.name,id,TarAct,PostAct,UseCase,positions, function(err, tracerules) {
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

exports.insertActAfterDecCon = function(req, res){
	 console.log("insertActAfterPre");
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var TarAct=param[2];
 	 var Decision=param[3];
 	 var Condition=param[4];
	 var UseCase=param[5];
	 var positions=param[6];
	 var current_guard_id=param[7];
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
	  ElementDepency.saveInsertActAfterDecCon(req.session.user.name,TarAct,Decision,Condition,UseCase,current_guard_id,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}
 	 	Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.saveInsertActAfterDecCon(req.session.user.name,id,TarAct,Decision,Condition,UseCase,positions, function(err, tracerules) {
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

exports.insertActBeforeActCon = function(req, res){
	 console.log("insertActAfterPre");
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var TarAct=param[2];
 	 var PostAct=param[3];
 	 var Condition=param[4];
	 var UseCase=param[5];
	 var positions=param[6];
	 var current_guard_id=param[7];
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
	  ElementDepency.saveInsertActBeforeActCon(req.session.user.name,TarAct,PostAct,Condition,UseCase,current_guard_id,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}
 	 	Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.saveInsertActBeforeActCon(req.session.user.name,id,TarAct,PostAct,Condition,UseCase,positions, function(err, tracerules) {
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

exports.insertDecAfterAct = function(req, res){
	 
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var TarDec=param[2];
 	 var PreAct=param[3];
 	 var MainBranchCon=param[4];
 	 var SupBranchCon=param[5];
 	 var InserAct=param[6];
 	 var TargetAct=param[7];
	 var UseCase=param[8];
	 var positions=param[9];
	 var current_guard_id=param[10];
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
	  ElementDepency.saveInsertDecAfterActCon(req.session.user.name,TarDec,PreAct,MainBranchCon,SupBranchCon,InserAct,TargetAct,UseCase,current_guard_id,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}
 	 	Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.saveInsertDecAfterActCon(req.session.user.name,id,TarDec,PreAct,MainBranchCon,SupBranchCon,InserAct,TargetAct,UseCase,positions, function(err, tracerules) {
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

exports.insertDecAfterDecCon = function(req, res){
	 console.log("InsertDecAfterDecCon"+req.params.content);
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
	  ElementDepency.saveInsertDecAfterDecCon(req.session.user.name,TarDec,InserDec,InserCon,MainBranchCon,SupBranchCon,InserAct,TargetDec,UseCase,current_guard_id,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}
 	 	Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.saveInsertDecAfterDecCon(req.session.user.name,id,TarDec,InserDec,InserCon,MainBranchCon,SupBranchCon,InserAct,TargetDec,UseCase,positions, function(err, tracerules) {
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

exports.insertDecBeforeAct = function(req, res){
	 
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var TarDec=param[2];
 	 var PostAct=param[3];
 	 var Con1=param[4];
 	 var Tar1=param[5];
 	 var Con2=param[6];
 	 var Tar2=param[7];
	 var UseCase=param[8];
	 var positions=param[9];
	 var current_guard_id=param[10];
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
	  ElementDepency.saveInsertDecBeforeAct(req.session.user.name,TarDec,PostAct,Con1,Tar1,Con2,Tar2,UseCase,current_guard_id,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}
 	 	Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.saveInsertDecBeforeAct(req.session.user.name,id,TarDec,PostAct,Con1,Tar1,Con2,Tar2,UseCase,positions, function(err, tracerules) {
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


exports.insertDecBeforeActWith = function(req, res){
	 
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var TarDec=param[2];
 	 var PostAct=param[3];
 	 var MainBranchCon=param[4];
 	 var SupBranchCon=param[5];
 	 var InserAct=param[6];
 	 var TargetDec=param[7];
	 var UseCase=param[8];
	 var positions=param[9];
	 var current_guard_id=param[10];
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
	  ElementDepency.saveInsertDecBeforeActWith(req.session.user.name,TarDec,PostAct,MainBranchCon,SupBranchCon,InserAct,TargetDec,UseCase,current_guard_id,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}
 	 	Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.saveInsertDecBeforeActWith(req.session.user.name,id,TarDec,PostAct,MainBranchCon,SupBranchCon,InserAct,TargetDec,UseCase,positions, function(err, tracerules) {
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
	 
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var TarDec=param[2];
 	 var PostAct=param[3];
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
	  ElementDepency.saveInsertDecBeforeActCon(req.session.user.name,TarDec,PostAct,InserCon,MainBranchCon,SupBranchCon,InserAct,TargetDec,UseCase,current_guard_id,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}
 	 	Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.saveInsertDecBeforeActCon(req.session.user.name,id,TarDec,PostAct,InserCon,MainBranchCon,SupBranchCon,InserAct,TargetDec,UseCase,positions, function(err, tracerules) {
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
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 operation=operation_name.split(" ");
 	 var positions=param[3];
 	 var current_guard_id=id;
 	 console.log("operation[operation.length-1]:"+operation[operation.length-1]);

 	 Guardlist.get(req.session.user.name, function(err, guardlists) {
				if (err) {
				guradlists = [];
			}

 	 ElementDepency.getToDepenNum(user,operation[operation.length-1],function(err,dependencyElement){
		 	 	
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
 	 	if (err) {
			req.flash('error', err);
			return res.redirect('/T/'+current_guard_id);
		}

		else{
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		  ElementDepency.deleteActivityDependee(req.session.user.name,id,operation_name,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
	  		
 	 	Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.deleteActivity(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
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
 	 }//else
 	}); //getToDepenNum
		})
}

exports.deleteDecision = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 operation=operation_name.split(" ");
 	 var positions=param[3];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);

 	 ElementDepency.getToDepenNum(user,operation[operation.length-1],function(err,dependencyElement){
 	 	
 	 	if(dependencyElement[0].todepenNum>0){
 	 		err = 'This decision still have dependent relation(s):';
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
			req.flash('error', err);
			return res.redirect('/T/'+current_guard_id);
		}

		
 	 else{
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		  ElementDepency.deleteDecisionDependee(req.session.user.name,id,operation_name,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
	  		
 	 	Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.deleteDecision(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
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
 }//else
 	}); //getToDepenNum
}

exports.deleteCondition = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 operation=operation_name.split(" ");
 	 var positions=param[3];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);
 	 ElementDepency.getToDepenNum(user,operation[operation.length-1],function(err,dependencyElement){
 	 	
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
			req.flash('error', err);
			return res.redirect('/T/'+current_guard_id);
		}

		
 	 else{

 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		  ElementDepency.deleteConditionDependee(req.session.user.name,id,operation_name,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
	  		
 	 	Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.deleteCondition(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
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
 	 }//else
 	}); //getToDepenNum
}

exports.deleteUseCase = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 operation=operation_name.split(" ");
 	 var positions=param[3];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);
 	 ElementDepency.getToDepenNum(user,operation[operation.length-1],function(err,dependencyElement){
 	 	
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
 	 			err=err+" "+keys[1];
 	 			if(!flag)
 	 			{
 	 				flag=true;

 	 			}
 	 		}
 	 	}
 	 	if (err) {
			req.flash('error', err);
			return res.redirect('/T/'+current_guard_id);
		}

		
 	 else{
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		  ElementDepency.deleteUseCaseDependee(req.session.user.name,id,operation_name,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
	  		
 	 	Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.deleteUseCase(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
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
 	 }//else
 	}); //getToDepenNum
}

//I2
exports.deleteInsertActAfterPre = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 var positions=param[3];
 	 var hidden_field=param[4];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions+" "+hidden_field);
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		  ElementDepency.deleteInsertActAfterPre(req.session.user.name,id,operation_name,hidden_field,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
	  		
 	 	Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.deleteInsertActAfterPre(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
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
//I3
exports.deleteInsertActBeforePost = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 var positions=param[3];
 	 var hidden_field=param[4];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		  ElementDepency.deleteInsertActBeforePost(req.session.user.name,id,operation_name,hidden_field,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
	  		
 	 	Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.deleteInsertActBeforePost(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
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
//I4

exports.deleteInsertActAfterDecCon = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 var positions=param[3];
 	 var hidden_field=param[4];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		  ElementDepency.deleteInsertActAfterDecCon(req.session.user.name,id,operation_name,hidden_field,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
	  		
 	 	Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.deleteInsertActAfterDecCon(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
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


//I5
exports.deleteInsertActBeforeActCon = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 var positions=param[3];
 	 var hidden_field=param[4];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		  ElementDepency.deleteInsertActBeforeActCon(req.session.user.name,id,operation_name,hidden_field,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
	  		
 	 	Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.deleteInsertActBeforeActCon(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
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


//I6
exports.deleteInsertDecAfterAct = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 var positions=param[3];
 	 var hidden_field=param[4];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		  ElementDepency.deleteInsertDecAfterAct(req.session.user.name,id,operation_name,hidden_field,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
	  		
 	 	Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.deleteInsertDecAfterAct(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
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
//I7

exports.deleteInsertDecAfterDecCon = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 var positions=param[3];
 	 var hidden_field=param[4];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		ElementDepency.deleteInsertDecAfterDecCon(req.session.user.name,id,operation_name,hidden_field,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
	  		
 	 	  Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.deleteInsertDecAfterDecCon(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
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

//I8

exports.deleteInsertDecBeforeAct = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 var positions=param[3];
 	 var hidden_field=param[4];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		ElementDepency.deleteInsertDecBeforeAct(req.session.user.name,id,operation_name,hidden_field,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
	  		
 	 	  Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.deleteInsertDecBeforeAct(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
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
//I9

exports.deleteInsertDecBeforeActWith = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 var positions=param[3];
 	 var hidden_field=param[4];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		ElementDepency.deleteInsertDecBeforeActWith(req.session.user.name,id,operation_name,hidden_field,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
	  		
 	 	  Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.deleteInsertDecBeforeActWith(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
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

//I10

exports.deleteInsertDecBeforeActCon = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 var positions=param[3];
 	 var hidden_field=param[4];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		ElementDepency.deleteInsertDecBeforeActCon(req.session.user.name,id,operation_name,hidden_field,function(err,elementdepencys){
	  		
	  		if(err){
	  			elementdepencys=[];
	  		}
	  		
	  		
 	 	  Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracerule.deleteInsertDecBeforeActCon(req.session.user.name,id,operation_name,positions, function(err, tracerules) {
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
	 console.log(oldusecasename+" "+usecasename+" "+hidden_fields);
	 if(nameMark || descriptionMark){

	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
	  ElementDepency.replaceDependKeyName(req.session.user.name,oldusecasename,usecasename,hidden_fields,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}
		Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}		
	  		Tracerule.editUseCase(req.session.user.name,id,nameMark,oldusecasename,usecasename,descriptionMark,oldusecasedescription,usecasedescription,positions,hidden_fields,function(err,tracerules){
				res.send(
						
						{elementdepencys:elementdepencys}
	
				);	
			});
	  	  });

		});
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
	 console.log(oldactivityname+" "+activityname+" "+hidden_fields);
	 if(nameMark || descriptionMark){

	
	  ElementDepency.replaceDependKeyName(req.session.user.name,oldactivityname,activityname,hidden_fields,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}		
	  		Tracerule.editActivity(req.session.user.name,id,nameMark,oldactivityname,activityname,descriptionMark,oldactivitydescription,activitydescription,executorMark,oldactivityexecutor,activityexecutor,positions,hidden_fields,function(err,tracerules){
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
	 console.log(oldconditionname+" "+conditionname+" "+hidden_fields);
	 if(nameMark || descriptionMark){


	  ElementDepency.replaceDependKeyName(req.session.user.name,oldconditionname,conditionname,hidden_fields,function(err,elementdepencys){
	  		if(err){
	  			elementdepencys=[];
	  		}	
	  		Tracerule.editCondition(req.session.user.name,id,nameMark,oldconditionname,conditionname,descriptionMark,oldconditiondescription,conditiondescription,positions,hidden_fields,function(err,tracerules){
				res.send(
						
						{elementdepencys:elementdepencys}
	
				);	
			});
	  	 

		});
	
  }  
}


exports.insertActAfterPreDialog = function(req, res) {
	  console.log("content:"+req.params.content);
	  ElementDepency.get(req.session.user.name,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}
				
					res.render('InsertActAfterPre', {
						"layout":false,
						elementdepencys : elementdepencys,
						current_guard : req.params.content
				});	
			
		
	});
  	  
};

exports.insertActBeforePostDialog = function(req, res) {
		
	  ElementDepency.get(req.session.user.name,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}
				
					res.render('InsertActBeforePost', {
						"layout":false,
						elementdepencys : elementdepencys,
						current_guard : req.params.content
				});	
			
		
	});
  	  
};

exports.insertActAfterDecConDialog = function(req, res) {
		
	  ElementDepency.get(req.session.user.name,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}
				
					res.render('InsertActAfterDecCon', {
						"layout":false,
						elementdepencys : elementdepencys,
						current_guard : req.params.content
				});	
			
		
	});
  	  
};

exports.insertActBeforeActConDialog = function(req, res) {
		
	  ElementDepency.get(req.session.user.name,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}
				
					res.render('InsertActBeforeActCon', {
						"layout":false,
						elementdepencys : elementdepencys,
						current_guard : req.params.content
				});	
			
		
	});
  	  
};

exports.insertDecAfterActDialog = function(req, res) {
		
	  ElementDepency.get(req.session.user.name,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}
				
					res.render('InsertDecAfterAct', {
						"layout":false,
						elementdepencys : elementdepencys,
						current_guard : req.params.content
				});	
			
		
	});
  	  
};

exports.insertDecAfterDecConDialog = function(req, res) {
		
	  ElementDepency.get(req.session.user.name,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}
				
					res.render('InsertDecAfterDecCon', {
						"layout":false,
						elementdepencys : elementdepencys,
						current_guard : req.params.content
				});	
			
		
	});
  	  
};

exports.insertDecBeforeActDialog = function(req, res) {
		
	  ElementDepency.get(req.session.user.name,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}
				
					res.render('InsertDecBeforeAct', {
						"layout":false,
						elementdepencys : elementdepencys,
						current_guard : req.params.content
				});	
			
		
	});
  	  
};

exports.insertDecBeforeActWithDialog = function(req, res) {
		
	  ElementDepency.get(req.session.user.name,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}
				
					res.render('InsertDecBeforeActWith', {
						"layout":false,
						elementdepencys : elementdepencys,
						current_guard : req.params.content
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
		
	  ElementDepency.get(req.session.user.name,function(err,elementdepencys){
	  		if(err){
	  			console.log("elementdepencys is null!");
	  			elementdepencys=[];
	  		}
				
					res.render('InsertDecBeforeActCon', {
						"layout":false,
						elementdepencys : elementdepencys,
						current_guard : req.params.content
				});	
			
		
	});
  	  
};



//feature model related

exports.addNewFeature = function(req,res){
  console.log("\n" + req.body.text + "在index.js中的 \"addNewFeature\"开始了！");
  var newFeature = new Feature({
		text        : req.body.text        ,
		parent_id   : req.body.parent_id   ,
		description : req.body.description ,
		root        : req.body.root        ,
		optionality : req.body.optionality ,
		VP          : req.body.VP          ,
		level       : parseInt(req.body.level),
  });

  Feature.getByTextAndRoot(newFeature.text, newFeature.root, function(err, feature) {
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
  		console.log("FUCKing No ERR");
 			Feature.getByTextAndRoot(newFeature.text, newFeature.root, function(err, thefeature) {
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
	Feature.getAll(function(err, features) {
		if (err) {
			console.log("LOAD FEATURE MODLE: FAIL");
			req.flash('error', err);
			return res.redirect('/F');
		}
		res.send({'features': features});
		
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

exports.configurationTree = function(req,res){
	res.render('configurationTree', {
						"layout":false,
						
				});	
};

exports.addTraceRule = function(req, res){
	console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	  var $user=param[0];
 	 var $id=param[1];
 	 var $selfname=param[2];
 	 var $guardname=param[3];
 	 var $positionss=param[4];
 	 var $current_guard_id=param[5];
 	 var $newGuardId;
 	 console.log($user+" "+$id+" "+$selfname+" "+$guardname+" "+$positionss+" "+$current_guard_id);
 	 

 	
	Tracerule.savePositions($user,$id,$positionss,function(err){
		
 	 Tracerule.getByName($user,$guardname, function(err,tracerule ) {
		if (tracerule)
			err = 'Guardname already exists.';
		if (err) {
			req.flash('error', err);
			return res.redirect('/T/'+$current_guard_id);
		}
		console.log("1");
		 Tracerule.getBySelfName($user,$selfname, function(err,tracerule ) {
			if (tracerule)
				err = 'Selfname already exists.';
			if (err) {
				req.flash('error', err);
				return res.redirect('/T/'+$current_guard_id);
			}

				Tracerule.addNewTraceRule($user,$guardname,$selfname,function(err,tracerules){
					if (err) {
						req.flash('error', err);
						return res.redirect('/T/'+$current_guard_id);
					}
					Tracerule.returnIDByName($user,$guardname, function(err,returnID) {
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
 				Guardlist.addNewGuardList($user,$selfname,$newGuardId, function(err, guardlists) {
					if (err) {
						guradlists = [];
							}
								Post.get(null, function(err, posts) {
									if (err) {
										posts = [];
									}
									 ElementDepency.get(req.session.user.name,function(err,elementdepencys){
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
											user : req.session.user,
											current_guard : returnID,
											success : req.flash('success').toString(),
											error : req.flash('error').toString()
										});	
	  									
	  								});

								});
							
			
						});				
					});
				});
		
		});
	});
  });
}

exports.addTraceRuleZero = function(req, res){
	console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var $user=req.session.user.name;
 	 
 	 var $selfname=param[0];
 	 var $guardname=param[1];

 	 var $newGuardId;

				Tracerule.addNewTraceRule($user,$guardname,$selfname,function(err,tracerules){
					if (err) {
						req.flash('error', err);
						return res.redirect('/T/'+$current_guard_id);
					}
					Tracerule.returnIDByName($user,$guardname, function(err,returnID) {
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
 				Guardlist.addNewGuardList($user,$selfname,$newGuardId, function(err, guardlists) {
					if (err) {
						guradlists = [];
							}
								Post.get(null, function(err, posts) {
									if (err) {
										posts = [];
									}
									 ElementDepency.get(req.session.user.name,function(err,elementdepencys){
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
											current_guard : $newGuardId,
											success : req.flash('success').toString(),
											error : req.flash('error').toString()
										});	
	  									
	  								});

								});
							
			
						});				
					});
				});
	
  
}

exports.editTraceRule = function(req, res){
	console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	  var $user=param[0];
 	 var $id=param[1];
 	 var $selfname=param[2];
 	 var $guardname=param[3];
 	 var $positionss=param[4];
 	 var $current_guard_id=param[5];
 	 var $newGuardId;
 	 console.log($user+" "+$id+" "+$selfname+" "+$guardname+" "+$positionss+" "+$current_guard_id);
 	 

 	
	Tracerule.editTraceRuleGuardSelfname($user,$id,$guardname,$selfname,$positionss,function(err,tracerules){


 				Guardlist.updateSelfname($user,$current_guard_id, $selfname,function(err, guardlists) {
					if (err) {
						guradlists = [];
							}
								Post.get(null, function(err, posts) {
									if (err) {
										posts = [];
									}
									 ElementDepency.get(req.session.user.name,function(err,elementdepencys){
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
											current_guard : $current_guard_id,
											success : req.flash('success').toString(),
											error : req.flash('error').toString()
										});	
	  									
	  								});

								});
							
			
						});				
		
  });
}


exports.C = function(req, res) {
	Configuration.get(req.session.user.name,null,function(err,configurations){
		res.render('C', {
		title: 'Configuration',
		user : req.session.user,
		configurations:configurations,
		current_configuration_id:"",
		success : req.flash('success').toString(),
		error : req.flash('error').toString()
    });
	})
	
};


exports.newConfiguration=function(req,res){
	var $configurationname=req.params.content;
	var $current_configuration_id;

	Configuration.addNewConfiguration(req.session.user.name,$configurationname,function(err,configurations,currentID){

		res.render('C', {
				title : 'Configuration',
				user: req.session.user,
				configurations:configurations,
				current_configuration_id:currentID,
				success : req.flash('success').toString(),
				error : req.flash('error').toString()
			});
	});
};

exports.deleteConfiguration=function(req,res){
	var $deleteId=req.params.content;

	Configuration.removeConfiguration(req.session.user.name,$deleteId,function(err,configurations){
		if(configurations.length>0){
		res.render('C', {
				title : 'Configuration',
				user: req.session.user,
				configurations:configurations,
				current_configuration_id:configurations[0]._id,
				success : req.flash('success').toString(),
				error : req.flash('error').toString()
			});
		}else{
			res.render('C', {
				title : 'Configuration',
				user: req.session.user,
				configurations:configurations,
				current_configuration_id:"",
				success : req.flash('success').toString(),
				error : req.flash('error').toString()
			});
		}
	});
};

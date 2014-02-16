
/*
 * GET home page.
 */

var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');
var Tracerule = require('../models/tracerule.js');
var Guardlist = require('../models/guardlist.js');
var ElementDepency = require('../models/elementdepency.js');

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
		title: '用户登录',
		user : req.session.user,
		success : req.flash('success').toString(),
		error : req.flash('error').toString()
    });
};

exports.F = function(req, res) {
	res.render('F', {
		title: '用户登录',
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
						current_guard : req.params.current_guard,
						success : req.flash('success').toString(),
						error : req.flash('error').toString()
				});	
			});
		});
	  });
	})

	
	//res.redirect('/T');
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
  });
}

exports.EditActivity=function(req,res){
	Tracerule.EditActivity(req.session.user.name, req.body.operationName,req.body.activityName,req.body.activityDescription,req.body.activityExecutor,req.body.activityVirual,req.body.operation_position,req.body.current_guard_id,function(err, trace) {
		console.log("edit Activity success!");
		});
};

exports.createUseCase = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var usecasename=param[2];
 	 var usecasedescription=param[3];
 	 var positions=param[4];
	 var current_guard_id=param[5];
	 var type="UseCase";

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


exports.C = function(req, res) {
	res.render('C', {
		title: '用户登录',
		user : req.session.user,
		success : req.flash('success').toString(),
		error : req.flash('error').toString()
    });
};


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
 	 var positions=param[3];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);
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
}

exports.deleteDecision = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 var positions=param[3];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);
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
}

exports.deleteCondition = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 var positions=param[3];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);
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
}

exports.deleteUseCase = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 var positions=param[3];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);
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
}

exports.deleteInsertActAfterPre = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 var positions=param[3];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		  ElementDepency.deleteInsertActAfterPre(req.session.user.name,id,operation_name,function(err,elementdepencys){
	  		
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

exports.deleteInsertActBeforePost = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 var positions=param[3];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		  ElementDepency.deleteInsertActBeforePost(req.session.user.name,id,operation_name,function(err,elementdepencys){
	  		
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

exports.deleteInsertActAfterDecCon = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 var positions=param[3];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		  ElementDepency.deleteInsertActAfterDecCon(req.session.user.name,id,operation_name,function(err,elementdepencys){
	  		
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



exports.deleteInsertActBeforeActCon = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 var positions=param[3];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		  ElementDepency.deleteInsertActBeforeActCon(req.session.user.name,id,operation_name,function(err,elementdepencys){
	  		
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



exports.deleteInsertDecAfterAct = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 var positions=param[3];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		  ElementDepency.deleteInsertDecAfterAct(req.session.user.name,id,operation_name,function(err,elementdepencys){
	  		
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

exports.deleteInsertDecAfterDecCon = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 var positions=param[3];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		ElementDepency.deleteInsertDecAfterDecCon(req.session.user.name,id,operation_name,function(err,elementdepencys){
	  		
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


exports.deleteInsertDecBeforeAct = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 var positions=param[3];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		ElementDepency.deleteInsertDecBeforeAct(req.session.user.name,id,operation_name,function(err,elementdepencys){
	  		
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

exports.deleteInsertDecBeforeActWith = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 var positions=param[3];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		ElementDepency.deleteInsertDecBeforeActWith(req.session.user.name,id,operation_name,function(err,elementdepencys){
	  		
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



exports.deleteInsertDecBeforeActCon = function(req, res){
	 console.log(req.params.content);
 	 var param=req.params.content.split("分");
 	 var user=param[0];
 	 var id=param[1];
 	 var operation_name=param[2];
 	 var positions=param[3];
 	 var current_guard_id=id;
 	 console.log(user+" "+id+" "+operation_name+" "+positions);
 	 Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		}
		ElementDepency.deleteInsertDecBeforeActCon(req.session.user.name,id,operation_name,function(err,elementdepencys){
	  		
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
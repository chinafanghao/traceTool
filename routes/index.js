
/*
 * GET home page.
 */

var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');
var Tracelist = require('../models/tracelist.js');
var Guardlist = require('../models/guardlist.js')
var Elementlist = require('../models/elementlist.js')

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
		Guardlist.get(req.session.user.name, function(err, guardlists) {
			if (err) {
				guradlists = [];
			}

			Tracelist.get(req.session.user.name,req.params.current_guard, function(err, tracelists) {
			if (err) {
				tracelists = [];
			}
				console.log(req.session.user.name+"+"+req.params.current_guard+"+"+tracelists);
				Elementlist.get(req.session.user.name, function(err, elementlists) {
					if (err) {
						elementlists = [];
					}
				
					res.render('T', {
						title : 'Traceability',
						posts : posts,
						guardlists : guardlists,
						elementlists : elementlists,
						tracelists : tracelists,
						user : req.session.user,
						current_guard : req.params.current_guard,
						success : req.flash('success').toString(),
						error : req.flash('error').toString()
					});
				});
			});
		});
	})
};

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
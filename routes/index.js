var crypto = require('crypto');
var User = require('../models/user.js');
var fs = require('fs');
var path = require('path');

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('index', render(req, '首页', req.session.user, req.url));
	});
	
	app.get('/reg', checkNotLogin);
  	app.get('/reg', function(req, res) {
    	res.render('reg', render(req, '用户注册', req.session.user, req.url));
  	});
  
  	app.post('/reg', checkNotLogin);
  	app.post('/reg', function(req, res) {
    	//检验用戶两次输入的口令是否一致
    	if (req.body['password-repeat'] != req.body['password']) {
      		req.flash('error', '两次输入的密码不一致');
      		return res.redirect('/reg');
    	}
  
    	//生成口令的散列值
    	var md5 = crypto.createHash('md5');
    	var password = md5.update(req.body.password).digest('base64');
    
   		var newUser = new User({
      		name: req.body.username,
      		password: password
    	});
    
    	//检验用戶名是否依据存在
    	User.get(newUser.name, function(err, user) {
      		if (user)
        		err = 'Username already exists.';
      		if (err) {
        		req.flash('error', err);
        		return res.redirect('/reg');
      		}
	      	//如果不存在则新增用戶
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
  	});
  	
  	app.get('/login', checkNotLogin);
  	app.get('/login', function(req, res) {
    	res.render('login', render(req, '用户登录', req.session.user, req.url));
  	});
  
  	app.post('/login', checkNotLogin);
  	app.post('/login', function(req, res) {
  		//生成口令的散列值
    	var md5 = crypto.createHash('md5');
    	var password = md5.update(req.body.password).digest('base64');
    
    	User.get(req.body.username, function(err, user) {
      		if (!user) {
        		req.flash('error', '用户不存在');
        		return res.redirect('/login');
      		}
      		if (user.password != password) {
        		req.flash('error', '用户密码错误');
        		return res.redirect('/login');
      		}
      		req.session.user = user;
      		req.flash('success', '登录成功');
      		res.redirect('/');
    	});
  	});
  	
  	app.get('/logout', checkLogin);
  	app.get('/logout', function(req, res) {
    	req.session.user = null;
    	res.redirect('/');
  	});
  	
  	app.get('/user/:name', function(req, res) {
    	User.get(req.params.name, function(err, user) {
      		if (!user) {
        		req.flash('error', '用戶不存在');
        		return res.redirect('/');
      		}
      		res.render('user', render(req, user.name, user, req.url));
   		});
  	});
  
  	app.get('/user/:name/update', checkLogin);
  	app.get('/user/:name/update', function(req, res) {
  		User.get(req.params.name, function(err, user) {
      		if (!user) {
        		req.flash('error', '用戶不存在');
        		return res.redirect('/');
      		}

      		res.render('userUpdate', render(req, user.name, user, "/user/" + user.name));
   		});
  	});
  	
  	app.post('/user/:name/update', checkLogin);
  	app.post('/user/:name/update', function(req, res) {
  		User.get(req.params.name, function(err, user) {
      		if (!user) {
        		req.flash('error', '用戶不存在');
        		return res.redirect('/');
      		}
  
      		var newUser = new User({
      			name: user.name,
				password: user.password,
				realname: req.body.realname,
				company: req.body.company,
				post: req.body.post,
				phone: req.body.phone,
				description: req.body.description
      		});
      		
      		User.update(newUser, function(err, doc) {
      			if (err) {
      				req.flash('error', '修改失败');
      			}
      			if (doc) {
      				req.flash('success', '修改成功');
      			} 
      			return res.redirect('/user/' + user.name + '/update');
      		});
   		});
  	});
  	
  	app.get('/user/:name/sculpture', checkLogin);
  	app.get('/user/:name/sculpture', function(req, res) {
  		User.get(req.params.name, function(err, user) {
      		if (!user) {
        		req.flash('error', '用戶不存在');
        		return res.redirect('/');
      		}

      		res.render('userSculpture', render(req, user.name, user, "/user/" + user.name));
   		});
  	});
  	
  	app.post('/user/:name/sculpture', checkLogin);
  	app.post('/user/:name/sculpture', function(req, res) {
  		var tmpPath = req.files.sculpture.path;
  		var extName = path.extname(req.files.sculpture.name);
  		var tmpName = "/uploads/" + path.basename(tmpPath) + extName;
  		var newPath = __dirname + "/../public" + tmpName;

  		fs.readFile(tmpPath, function(err, data) {
  			if (err) {
  				req.flash('error', '上传失败');
  				return res.redirect(req.url);
  			}
  			fs.writeFile(newPath, data, function(err) {
  				if (err) {
  					req.flash('error', '上传失败');
  					return res.redirect(req.url);
  				}
  				
  				User.get(req.params.name, function(err, user) {
		      		if (!user) {
		        		req.flash('error', '用戶不存在');
		        		return res.redirect('/');
		      		}
		      		
		      		if (user.sculpture) {
			      		fs.unlink(__dirname + "/../public" + user.sculpture, function(err) {
			      			if (err) {
			      				req.flash('error', '上传失败');
			      				return res.redirect('/user/' + user.name);
			      			}
			      		});
		      		}
		      		
					user.sculpture = tmpName;
					User.update(user, function(err, doc) {
						if (err) {
							req.flash('error', '上传失败');
							return res.redirect('/user/' + user.name);
						}
						req.flash('success', '修改成功');
						return res.redirect('/user/' + user.name);
					});
		   		});
  			});
  		});
  	});
};

function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登录');
    return res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登录');
    return res.redirect('/');
  }
  next();
}

function render(req, title, user, url) {
	var success = req.flash('success');
	if (success == "") {
		success = null;
	}
	var error = req.flash('error');
	if (error == "") {
		error = null;
	}
	
	var res = {
		title: title,
		user: user,
		url: url,
		success: success,
		error: error
	}
	
	return res;
}
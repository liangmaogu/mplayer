var mongodb = require('./db');

function User(user) {
	this.name = user.name;
	this.password = user.password;
	this.sculpture = user.sculpture;
	this.realname = user.realname;
	this.company = user.company;
	this.post = user.post;
	this.phone = user.phone;
	this.description = user.description;
};

module.exports = User;

User.prototype.save = function save(callback) {
  	// 存入 Mongodb 的文檔
  	var user = {
    	name: this.name,
    	password: this.password,
    	realname: '',
		company: '',
		post: '',
		phone: '',
		description: ''
  	};
  	mongodb.open(function(err, db) {
    	if (err) {
      		return callback(err);
    	}
    	// 读取 users 集合
    	db.collection('users', function(err, collection) {
      		if (err) {
        		mongodb.close();
        		return callback(err);
      		}
      		// 为 name属性添加索引
     		 collection.ensureIndex('name', {unique: true});
      		// 写入 user 文档
      		collection.insert(user, {safe: true}, function(err, user) {
        		mongodb.close();
        		callback(err, user);
      		});
    	});
  	});
};

User.get = function get(username, callback) {
  	mongodb.open(function(err, db) {
    	if (err) {
      		return callback(err);
    	}
    	// 读取 users 集合
    	db.collection('users', function(err, collection) {
	      	if (err) {
	        	mongodb.close();
	        	return callback(err);
	      	}
	      	// 查找 name 属性为 username 的文档
	      	collection.findOne({name: username}, function(err, doc) {
	        	mongodb.close();
	        	if (doc) {
	          		// 封装文档为 User 对象
	          		var user = new User(doc);
	          		callback(err, user);
	        	} else {
	         		 callback(err, null);
	        	}
	      	});
    	});
  	});
};

User.update = function update(user, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		// 读取users集合
    	db.collection('users', function(err, collection) {
	      	if (err) {
	        	mongodb.close();
	        	return callback(err);
	      	}

	      	collection.update({name: user.name}, {$set: user}, {safe: true}, function(err, doc) {
	      		mongodb.close();
	      		if (err) {
	        		return callback(err);
	      		}
	      		return callback(err, doc);
	      	});
    	});
	});
};

User.remove = function remove(username, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		// 读取users集合
    	db.collection('users', function(err, collection) {
	      	if (err) {
	        	mongodb.close();
	        	return callback(err);
	      	}

	      	collection.remove({name: username}, function(err, removed) {
	      		mongodb.close();
	      		if (err) {
	        		return callback(err);
	      		}
	      		return callback(err, removed);
	      	});
    	});
	});
};
var dbaction = require('../actions/dbaction'),
	cryptaction = require('../actions/cryptaction'),
	auth = require('../modules/auth'),
	fsaction = require('../actions/fileaction'),
	multiparty = require('multiparty'),
	async = require('async');

exports.registration = function (req, res) {
	for (var item in req.body) {

		var value = req.body[item];

		if (value === '') return res.send({
				regStatus : 1,
				regText : 'Ошибка!!! Заполните все поля!'
			});
	};

	if (req.body.password_1 !== req.body.password_2) return res.send({
		regStatus : 2,
		regText : 'Ошибка!!! Пароли не совпадают!'
	});

	dbaction.findUser({login : req.body.login}, function (err, user) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		};

		if (user) return res.send({
				regStatus : 3,
				regText : 'Ошибка!!! Пользователь с введеным E-mail уже существует'
			});

		var userObj = {
			login : req.body.login,
			password : req.body.password_1,
			first_name : req.body.first_name,
			last_name : req.body.last_name
		};

		cryptaction.genSalt(userObj.login, function (err, salt) {
			cryptaction.genHash(userObj.password, salt, function (err, hash) {
				if (err) {
					console.log(err);
					res.sendStatus(500);
				};

				userObj.password = hash;

				dbaction.addUser(userObj, function (err, user) {
					if (err){
						console.log(err);
						return res.sendStatus(500);
					};

					fsaction.createUserFolders(user.user_id, function (err) {
						if (err) throw err;

						console.log('New User [ ' + Date() + ' ]');
						console.log(user);

						req.login(user, function (err) {
							if (err) {
								console.log(err);
								return res.sendStatus(500);
							};

							res.send({
								regStatus : 0,
								uid : user.user_id
							});
						});
					});
				});
			});
		});

	});
};

exports.auth = function (req, res) {
	auth.authenticate('local', function (err, user) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		};

		if (!user) return res.send({
				authStatus : 1,
				authText : 'Не верный логин и / или пароль!!!'
			});

		req.login(user, function (err) {
			if (err) {
				console.log(err);
				return res.sendStatus(500);
			};

			res.send({authStatus : 0});

			console.log('Auth user id ' + user.user_id + ' [ ' + Date() + ' ]');
		});
	})(req, res);
};

exports.editStatus = function (req, res, next){
	if (req.body.action !== 'status') return next();

	async.parallel([
		function (cb) {
			dbaction.userUpdate(req.user.user_id, {$set : {'status' : req.body.newStatus}}, function (err) {
				cb(err, req.body.newStatus);
			});
		},
		function (cb) {
			var postObj = {
				author_id : req.user.user_id,
				author_avatar : req.user.avatar, 
				author_name : req.user.first_name + ' ' + req.user.last_name,
				text : req.body.newStatus,
				post_type: 'text'
			};

			if (req.user.gender == 'Женский') postObj.author_action = 'изменила статус'
			else postObj.author_action = 'изменил статус'

			dbaction.addPost(postObj, function (err, post) {
				cb(err, post);
			});
	}
	], function (err, results) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		};

		res.send(results);
	});
};

exports.addPost = function (req, res, next) {
	if (req.body.action !== 'post') return next();

	var postObj = {
		author_id : req.user.user_id,
		author_avatar : req.user.avatar,
		author_name : req.user.first_name + ' ' + req.user.last_name,
		text : req.body.text,
		post_type : 'text'
	};

	if (req.user.gender == 'Женский') postObj.author_action = 'добавила запись'
	else postObj.author_action = 'добавил запись'

	dbaction.addPost(postObj, function (err, post) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		};

		res.send(post);
	});
};	

exports.subscribe = function (req, res, next) {
	if (req.body.action !== 'subscribe') return next();

	if (req.body.uid == req.user.user_id) return next();
	
	var sub = true;

	if (req.user.subscribe !== undefined) {
		req.user.subscribe.forEach(function (val, ind) {
			if (val === req.body.uid) sub = false;
		});
	};

	async.parallel([
		function (cb) {
			if (sub) {
				dbaction.userUpdate(req.user.user_id, {$push : {'subscribe' : req.body.uid}}, function (err) {
					cb (err, true);
				});
			} else {
				dbaction.userUpdate(req.user.user_id, {$pull : {'subscribe' : req.body.uid}}, function (err) {
					cb(err, false);
				});
			};
		},
		function (cb) {
			if (sub) {
				dbaction.userUpdate(req.body.uid, {$push : {'subscribers' : req.user.user_id}}, function (err) {
					cb (err, true);
				});
			} else {
				dbaction.userUpdate(req.body.uid, {$pull : {'subscribers' : req.user.user_id}}, function (err) {
					cb(err, false);
				});
			};
		}
	], function (err, results) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		};

		if (results[0] && results[1]) res.send({
			status : true,
			text : 'Вы подписаны'
		});
		else res.send({
			status : false,
			text : 'Подписаться'
		});
	});
};

exports.profileLike = function (req, res, next) {
	if (req.body.action !== 'profile_like') return next();

	if (req.body.uid == req.user.user_id) return next();

	var like = true;

	dbaction.findUser({user_id : req.body.uid}, function (err, user) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		};

		if (user.likes !== undefined) {
			user.likes.forEach(function (val, ind) {
				if (val === req.user.user_id) like = false;
			});
		};

		async.parallel([
			function (cb) {
				if (like) {
					dbaction.userUpdate(req.body.uid, {$push : {'likes' : req.user.user_id}}, function (err) {
						cb(err, user.likes.length + 1);
					});
				} else {
					dbaction.userUpdate(req.body.uid, {$pull : {'likes' : req.user.user_id}}, function (err) {
						cb(err, user.likes.length - 1);
					});
				};
			}
		], function (err, results) {
			if (err) {
				console.log(err);
				return res.sendStatus(500);
			};

			res.send({
				status : 'ok',
				likes : results[0]
			});
		});
	});
};

exports.postLike = function (req, res, next) {
	if (req.body.action !== 'post_like')  return next();

	var like = true;

	dbaction.findPost(req.body.pid, function (err, post) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		};

		if (post.likes !== undefined) {
			post.likes.forEach(function (val, ind) {
				if (val === req.user.user_id) like = false;
			});
		};

		async.parallel([
			function (cb) {
				if (like) {
					dbaction.postUpdate(req.body.pid, {$push : {'likes' : req.user.user_id}}, function (err) {
						cb(err, post.likes.length + 1);
					});
				} else {
					dbaction.postUpdate(req.body.pid, {$pull : {'likes' : req.user.user_id}}, function (err) {
						cb(err, post.likes.length - 1);
					});
				};
			}
		], function (err, results) {
			if (err) {
				console.log(err);
				return res.sendStatus(500);
			};

			res.send({
				status : 'ok',
				likes : results[0]
			});
		});
	});
};

exports.userSettings = function (req, res, next) {
	if (req.body.action !== 'settings') return next();
	for (var index in req.body) {
		var value = req.body[index];

		if (value === '') delete req.body[index];
	};

	var userSet = {};

	if (req.body.first_name) userSet.first_name = req.body.first_name;
	if (req.body.last_name) userSet.last_name = req.body.last_name;
	if (req.body.birthday) userSet.birthday = req.body.birthday;
	if (req.body.city) userSet.city = req.body.city;
	if (req.body.mar_status) userSet.mar_status = req.body.mar_status;
	if (req.body.gender) userSet.gender = req.body.gender;
	if (req.body.phone) userSet.telephone_num = req.body.phone;
	if (req.body.facebook) userSet.fb_link = req.body.facebook;
	if (req.body.vk) userSet.vk_link = req.body.vk;
	if (req.body.site) userSet.web_site = req.body.site;
	if (req.body.quote) userSet.quote = req.body.quote;

	dbaction.userUpdate(req.user.user_id, {$set : userSet}, function (err, user) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		};
	});

	if (req.body.password_old && req.body.password_1 && req.body.password_2) {
		cryptaction.genSalt(req.user.login, function (err, salt) {
			cryptaction.genHash(req.body.password_old, salt, function (err, hash_1) {
				if (err) {
					console.log(err);
					return res.sendStatus(500);
				};

				if (hash_1 !== req.user.password) return res.send({
						setSatatus : 1,
						setText : 'Старый пароль не верен!!!'
					});

				if (req.body.password_1 !== req.body.password_2) return res.send({
						setSatatus : 2,
						setText : 'Новые пароли не совпадают!!!'
					});

				cryptaction.genSalt(req.user.login, function (err, salt) {
					cryptaction.genHash(req.body.password_1, salt, function (err, hash_2) {
						dbaction.userUpdate(req.user.user_id, {$set : {password : hash_2}}, function (err) {
							if (err) {
								console.log(err);
								return res.sendStatus(500);
							};
						});
					});
				});
			});
		});
	};

	return res.send({
		status : 'ok'
	});
};

exports.uploadImages = function (req, res) {
	if (!req.user) return res.redirect('/');

	var form = new multiparty.Form();

	var types = ['image/png', 'image/jpg', 'image/jpeg', 'image/bmp'],
		maxSize = 2 * 1024 * 1024;

	var postAvatar,
		imageList = [];

	form.on('error', function (err) {
		console.log(err);
	});

	form.on('part', function (part) {
		fsaction.checkMIMEType(part.headers['content-type'], types, function (err, type) {
			if (err) throw err;

			if (part.byteCount > maxSize) return res.send('Максимальный размер файла 2MB');

			fsaction.saveFile(req.user.user_id + '/images/' + part.filename, part);

			async.parallel([
				function (cb) {
					dbaction.findImages({uid : req.user.user_id}, function (err, images) {
						if (err) return cb(err, false);

						var status = true;

						for (var i = 0; i < images.length; i++) {
							if (images[i].name == part.filename) {
								status = false;
								break;
							};
						};

						cb(null, status);
					});
				}
			], function (err, results) {
				if (err) {
					console.log(err);
					return res.sendStatus(500);
				};

				var postStatus = true;

				if (results[0]) {

					var imgObj = {
						uid: req.user.user_id,
						name: part.filename
					};

					dbaction.addImage(imgObj, function (err, image) {
						dbaction.userUpdate(req.user.user_id, {$push : {'images' : image.img_id}}, function (err) {
							if (err) {
								console.log(err);
								return res.sendStatus(500);
							};

						});
					});

					imageList.push(imgObj);
				} else {
					postStatus = false;
				};

				var postObj = {
					author_id : req.user.user_id,
					author_avatar : req.user.avatar,
					author_name : req.user.first_name + ' ' + req.user.last_name,
					image_name : part.filename,
					post_type : 'image'
				};

				if (part.name == 'avatar') {
					postStatus = true;

					dbaction.userUpdate(req.user.user_id, {$set : {'avatar' : part.filename}}, function (err) {
						if (err) {
							console.log(err);
							return res.sendStatus(500);
						};
					});

					if (req.user.gender == 'Женский') postObj.author_action = 'обновила фотографию на странице'
					else postObj.author_action = 'обновил фотографию на странице'
					postObj.author_avatar = part.filename;
				} else {
					if (req.user.gender == 'Женский') postObj.author_action = 'добавила фотографию'
					else postObj.author_action = 'добавил фотографию'
				};

				if (postStatus) {
					dbaction.addPost(postObj, function (err, post) {
						if (err) {
							console.log(err);
							return res.sendStatus(500);
						};

						postAvatar = post;
					});
				};
			});
		});

		part.resume();
	});

	form.parse(req);

	form.on('close', function () {
		console.log(imageList);
		res.send({
			status : 'ok',
			path : '../users/' + req.user.user_id + '/images',
			post : postAvatar,
			images : imageList
		});
	});
};

exports.skipUserNews = function (req, res, next) {
	if (req.body.action != 'find_news') return next();

	var skip = parseInt(req.body.skip),
		uid = parseInt(req.body.uid);

	dbaction.findNews({author_id : uid}, skip, function (err, posts) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		};

		res.send(posts);
	});
};

exports.skipNews = function (req, res, next) {
	if (req.body.action != 'find_news') return next();

	var skip = parseInt(req.body.skip);

	dbaction.findNews({}, skip, function (err, posts) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		};

		res.send(posts);
	});
};

exports.sendMessage = function (req, res) {

	console.log(req.body);

	dbaction.findUser({user_id : req.user.user_id}, function (err, user) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		};

		if (req.body.message_id) {
			dbaction.findMessage({message_id : req.body.mess_id}, function (err, message) {
				if (err) {
					console.log(err);
					return res.sendStatus(500);
				};

				async.parallel([
					function (cb) {
						dbaction.updateMessage(message.message_id, {$push: {
							messages : {
								text : req.body.text,
								user_1 : req.user.user_id,
								user_2 : req.body.id
							}
						}}, function (err) {
							cb(err);
						});
					}
				], function (err, results) {
					if (err) {
						console.log(err);
						return res.sendStatus(500);
					};

					res.send('ok');
				});
			});
		} else {
			var mess = {
				messages : {
					text : req.body.text,
					user_1 : req.user.user_id, 
					user_2 : req.body.id 
				}
			};

			dbaction.saveMessage(mess, function (err, message) {
				if (err) {
					console.log(err);
					return res.sendStatus(500);
				};

				async.parallel([
					function (cb) {
						dbaction.userUpdate(req.user.user_id, {$push: {
							messages : {
								message_id : message.message_id,
								user: req.body.user_id,
								name : req.body.user_name
							}
						}}, function (err) {
							cb(err);
						});
					},
					function (cb) {
						dbaction.userUpdate(req.body.user_id, {$push: {
							messages : {
								message_id : message.message_id,
								user: req.user.user_id,
								name : req.user.first_name + ' ' + req.user.last_name
							}
						}}, function (err) {
							cb(err);
						});
					}
				], function (err, results) {
					if (err) {
						console.log(err);
						return res.sendStatus(500);
					};

					res.send({
						message_id : message.message_id
					});
				});
			});
		};
	});
};
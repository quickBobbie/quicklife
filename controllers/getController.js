var async = require('async'),
	dbaction = require('../actions/dbaction'),
	action = require('../actions/action');

exports.createHomePage = function (req, res) {
	if (req.user) return res.redirect('/id' + req.user.user_id);

	res.render('auth');
};

exports.createRegisterPage = function (req, res) {
	if (req.user) return res.redirect('/id' + req.user.user_id);

	res.render('register');
};

exports.createUserProfile = function (req, res, next) {

	if (!req.user) return res.redirect('/');

	if (req.query.page || req.query.action) return next();

	var isUser = false;

	dbaction.findUser({user_id : req.params.id}, function (err, user) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		};

		async.parallel([
			function (cb) {
				dbaction.findNews({author_id : user.user_id}, 0, function (err, posts) {
					cb(err, posts);
				});
			},
			function (cb) {
				dbaction.findImages({uid : user.user_id}, function (err, images) {
					cb(err, images);
				});
			},
			function (cb) {
				var status = false;

				for (var i = 0; i < req.user.subscribe.length; i++) {
					if (req.user.subscribe[i] == user.user_id) {
						status = true;
						break;
					};
				};

				cb(null, status);
			}
		], function (err, results) {
			if (req.params.id == req.user.user_id) isUser = true;

			var isSub = results[2];
	
			res.render('user_profile', {
				isUser : isUser,
				isUserID : req.user.user_id,
				user : user,
				posts : results[0],
				images : results[1],
				isSub : isSub
			});
		});
	});
};

exports.createSettingsPage = function (req, res, next) {
	
	if (req.query.page !== 'settings') return next();

	var birthday;

	if (req.user.birthday == null) birthday = action.formatDate(new Date());
	else birthday = action.formatDate(req.user.birthday);

	res.render('user_settings', {
		isUser : true,
		isUserID : req.user.user_id,
		user : req.user,
		birthday : birthday
	});
};

exports.createInfoPage = function (req, res, next) {
	if (req.query.page !== 'info') return next();
	var isUser = false,
		birthday;

	dbaction.findUser({user_id : req.params.id}, function (err, user) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		};

		if (user.birthday == null) birthday = null;
		else {
			birthday = action.formatDate(user.birthday);
			birthday.old = action.getOld(user.birthday);
		};

		if (req.params.id == req.user.user_id) isUser = true;

		res.render('user_info', {
			isUser : isUser,
			isUserID : req.user.user_id,
			user : user,
			birthday : birthday
		});
	});
};

exports.createSubscribesPage = function (req, res, next) {
	if (req.query.page !=='subscribes')  return next();
	var isUser = false,
		subs = [];

	dbaction.findUser({user_id : req.params.id}, function (err, user) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		};

		async.parallel([
			function (cb) {
				dbaction.findUsers({}, 0, function (err, users) {
					if (err) return cb(err, null);

					for (var i = 0; i < user.subscribe.length; i++) {
						subs.push(users[user.subscribe[i] - 1]);
					};

					cb(null, subs);
				})
			}
		], function (err, results) {
			if (err) {
				console.log(err);
				res.sendStatus(500);
			};

			if (req.params.id == req.user.user_id) isUser = true;
			
			res.render('user_subscribe', {
				isUserID : req.user.user_id,
				isUser : isUser,
				user : user,
				users : results[0]
			});
		});
	});
};

exports.createSubscribersPage = function (req, res, next) {
	if (req.query.page !=='subscribers') return next();
	var isUser = false,
		subs = [];

	dbaction.findUser({user_id : req.params.id}, function (err, user) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		};

		async.parallel([
			function (cb) {
				dbaction.findUsers({}, 0, function (err, users) {
					if (err) return cb(err, null);

					for (var i = 0; i < user.subscribers.length; i++) {
						subs.push(users[user.subscribers[i] - 1]);
					};

					cb(null, subs);
				});
			}
		], function (err, results) {
			if (err) {
				console.log(err);
				return res.sendStatus(500);
			};

			var status = [];

			for (var i = 0; i < results[0].length; i++) {
				for (var j = 0; j < req.user.subscribe.length; j++) {
					if (results[0][i].user_id == req.user.subscribe[j]) {
						status.push(true);
						break;
					} else if (j == req.user.subscribe.length - 1) status.push(false);
				};
			};

			if (req.params.id == req.user.user_id) isUser = true;
			
			res.render('user_subscribe', {
				isUserID : req.user.user_id,
				isUser : isUser,
				user : user,
				users : results[0],
				isSub : status
			});
		});
	});
};

exports.createImagesPage = function (req, res, next) {
	if (req.query.page !== 'images') return next();
	var isUser = false

	dbaction.findUser({user_id : req.params.id}, function (err, user) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		};

		if (req.params.id == req.user.user_id) isUser = true;

		var photostr = action.setStrNum(user.images.length);

		async.parallel([
			function (cb) {
				dbaction.findImages({uid : user.user_id}, function (err, images) {
					cb(err, images);
				});
			}
		], function (err, results) {
			res.render('user_images', {
				isUser : isUser,
				isUserID : req.user.user_id,
				pagetitle : photostr,
				user : user,
				images : results[0]
			});
		});
	});
};

exports.createAllNews = function (req, res, next) {
	if (!req.user) return res.redirect('/');

	if(req.query.section == 'interesting' || req.query.section == 'photo') return next();
	
	dbaction.findNews({}, 0, function (err, posts) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		};

		res.render('news', {
			isUserID : req.user.user_id,
			posts : posts,
			title : 'Новости'
		});
	});
};

exports.createInterestingNews = function (req, res, next) {
	if (!req.user) return res.redirect('/');

	if (req.query.section != 'interesting') return next();

	async.parallel([
		function (cb) {
			var interestingPosts = [];

			for (var i = 0; i < req.user.subscribe.length; i++) {
				var subID = req.user.subscribe[i];

				dbaction.findNews({author_id : subID}, 0, function (err, posts) {
					if (err) return cb(err, null);

					interestingPosts.push(posts);
				});

				if (i == req.user.subscribe.length - 1) cb(null, interestingPosts);
			};
		}
	], function (err, results) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		};

		console.log(results[0]);

		res.render('news', {
			isUserID : req.user.user_id,
			posts : results[0],
			title : 'Новости'
		});
	});
};

exports.createPhotoNews = function (req, res, next) {
	if (!req.user) return res.redirect('/');
	
	if (req.query.section != 'photo') return next();

	async.parallel([
		function (cb) {
			var photoPosts = [];

			for (var i = 0; i < req.user.subscribe.length; i++) {
				var subID = req.user.subscribe[i];

				dbaction.findNews({author_id : subID, post_type: 'image'}, 0, function (err, posts) {
					if (err) {
						console.log(err);
						return res.sendStatus(500);
					};

					photoPosts.push(posts);;
				});

			};

			cb(null, photoPosts);
		}
	], function (err, results) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		};

		console.log(results[0]);

		res.render('news', {
			isUserID : req.user.user_id,
			posts : results[0],
			title : 'Новости'
		});
	});
};

exports.createFindUsersPage = function (req, res, next) {
	if (!req.user) return res.redirect('/');

	if (req.query.section == 'search') return next();

	dbaction.findUsers({}, 0, function(err, users) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		};

		async.parallel([
			function (cb) {
				dbaction.getUsersCount(function (err, count) {
					cb(err, count);
				});
			},
			function (cb) {
				var status = [];

				for (var i = 0; i < users.length; i++) {
					for (var j = 0; j < req.user.subscribe.length; j++) {
						if (users[i].user_id == req.user.subscribe[j]) {
							status.push(true);
							break;
						} else if (j == req.user.subscribe.length - 1) status.push(false);
					};
				};

				cb(null, status);
			},
			function (cb) {
				dbaction.findUsersAll(function (err, users) {
					cb(err, users);
				});
			}
		], function (err, results) {
			if (err) {
				console.log(err);
				return res.sendStatus(500);
			};

			var cities = [];

			for (var i = 0; i < results[2].length; i++) {
				if (results[2][i].city != '') cities.push(results[2][i].city);
			};

			cities.sort();

			for (var i = 0; i < cities.length - 1; i++) {
				for (var j = i + 1; j < cities.length; j++) {
					if (cities[i] == cities[j]) {
						cities.splice(j, 1);
						i--;
					};
				};
			};

			res.render('peoples_tape', {
				isUserID : req.user.user_id,
				users : users,
				count : results[0],
				isSub : results[1],
				cities : cities,
				title : 'Поиск'
			});
		});
	});
};

exports.findUsers = function (req, res, next) {
	if (!req.user) return res.redirect('/');

	if (req.query.section != 'search') return next();

	console.log(req.query);

	for (var index in req.query) {
		var value = req.query[index];

		if (value == '' ||
			value == 'all' ||
			value == 'false' ||
			value == '0' ||
			value == 0) delete req.query[index];
	};

	var objSearch = {};

	if (req.query.city) objSearch.city = req.query.city;
	if (req.query.old_down) var old_down = action.getBirthday(Number(req.query.old_down), 'down');
	if (req.query.old_up) var old_up = action.getBirthday(Number(req.query.old_up), 'up');
	if (req.query.gender) objSearch.gender = req.query.gender;
	if (req.query.sp){
		if (req.query.sp == 'isActive') objSearch.mar_status = 'В активном поиске';
		if (req.query.sp == 'isFriend') objSearch.mar_status = 'Встречаюсь';
	};
	if (req.query.s_text) {
		var s_text = req.query.s_text.split(' ');
		if (s_text[0]) objSearch.first_name = s_text[0].slice(0, 1).toUpperCase() + s_text[0].slice(1);
		if (s_text[1]) objSearch.last_name = s_text[1].slice(0, 1).toUpperCase() + s_text[1].slice(1);

	};
	if (old_down && old_up) objSearch.birthday = {$gte : old_up, $lte : old_down}
	else if (old_down) objSearch.birthday = {$lte : old_down}
	else  if (old_up) objSearch.birthday = {$gte : old_up}
	else delete objSearch.birthday;

	console.log(objSearch);

	dbaction.findUsers(objSearch, 0, function (err, users) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		};

		async.parallel([
			function (cb) {
				var status = [];

				for (var i = 0; i < users.length; i++) {
					for (var j = 0; j < req.user.subscribe.length; j++) {
						if (users[i].user_id == req.user.subscribe[j]) {
							status.push(true);
							break;
						} else if (j == req.user.subscribe.length - 1) status.push(false);
					};
				};

				cb(null, status);
			},
			function (cb) {
				var avatar_users = [];

				if (req.query.is_photo) {
					for (var i = 0; i < users.length; i++) {
						if (users[i].avatar) avatar_users.push(users[i]);
					};

					cb(null, avatar_users);
				} else {
					cb (null, null);
				};
			}
		], function (err, results) {
			var objRes = {
				users : users,
				isUserID : req.user.user_id,
				isSub : results[0]
			};

			if (results[1] !== null) objRes.users = results[1];

			res.send(objRes);
		});
	});

};

exports.createMessengerPage = function (req, res, next) {
	if (!req.user) return res.redirect('/');

	if (req.query.user) return next();

	dbaction.findUser({user_id : req.user.user_id}, function (err, user) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		};

		res.render('message_list', {
			users : user.messages,
			isUserID : req.user.user_id,
			title : 'Сообщения'
		});
	});

};

exports.createMessengerUserPage = function (req, res, next) {
	if (!req.user) return res.redirect('/');

	if (!req.query.user || req.query.user == req.user.user_id) return next();

	dbaction.findUser({user_id : req.user.user_id}, function (err, user) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		};

		async.parallel([
			function (cb) {
				if (user.messages) {
					for (var i = 0; i < user.messages.length; i++) {
						if (user.messages.user == req.params.id) return cb(null, user.messages[i]);
					};
				}

				cb(null, null);
			}
		], function (err, results) {
			if (err) {
				console.log(err);
				return res.sendStatus(500);
			};

			if (!results[0]) {

				dbaction.findUser({user_id : req.query.user}, function (err, messUser) {
					if (err) {
						console.log(err);
						return res.sendStatus(500);
					};

					async.parallel([
						function (cb) {
							dbaction.findUser({user_id : req.query.user}, function (err, mess_User) {
								cb(err, mess_User);
							});
						}
					], function (err, result) {
						if (err) {
							console.log(err);
							return res.sendStatus(500);
						};

						if (result[0].net_status && result[0].socket_id) socket_id = result[0].socket_id
						else socket_id = false;

						res.render('message_content', {
							users : [{
								user: messUser.user_id,
								name: messUser.first_name + ' ' + messUser.last_name
							}],
							user_name: messUser.first_name + ' ' + messUser.last_name,
							isUserID : req.user.user_id,
							id : result[0].user_id,
							socket_id : socket_id,
							message_id : false,
							title : 'Сообщения'
						});
					});
				});
			} else {
				dbaction.findMessage({message_id : results[0].message_id}, 0, function (err, messages) {
					if (err) {
						console.log(err);
						return res.sendStatus(500);
					};

					async.parallel([
						function (cb) {
							dbaction.findUser({user_id : results[0].user}, function (err, messUser) {
								cb(err, messUser);
							});
						}
					], function (err, result) {
						if (err) {
							console.log(err);
							return res.sendStatus(500);
						};

						if (result[0].net_status && result[0].socket_id) socket_id = result[0].socket_id
						else socket_id = false;

						res.render('message_content', {
							users : user.messages,
							user: results[0].name,
							messages: messages,
							isUserID : req.user.user_id,
							id : result[0].user_id,
							socket_id : socket_id,
							message_id : results[0].message_id,
							title : 'Сообщения'
						});
					});
				});
			};
		});
	});
}

exports.logout = function (req, res) {
	req.logout();
	res.redirect('/');
};
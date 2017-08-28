var dbaction = require('../actions/dbaction'),
	cryptaction = require('../actions/cryptaction');

exports.authLocal = function (login, password, done) {
	dbaction.findUser({login : login}, function (err, user) {
		if (err) return done(err);

		if (!user) return done(null, false);

		cryptaction.genSalt(login, function (err, salt) {
			cryptaction.genHash(password, salt, function (err, hash) {
				if (err) done(err);

				if (hash === user.password) {
					return done(null, user);
				} else {
					return done(null, false);
				};
			});
		});
	});
};

exports.serialize = function (user, done) {
	done(null, user.user_id);
};

exports.deserialize = function (user_id, done) {
	dbaction.findUser({user_id : user_id}, function (err, user) {
		done(err, user);
	});
};
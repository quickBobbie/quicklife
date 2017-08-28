var dbaction = require('../actions/dbaction');

exports.checkCookie = function (req, res, next) {
	if (!req.user) return next();
	if (!req.user.session_id) {
		dbaction.userUpdate(req.user.user_id, {$set : {session_id : req.cookies['connect.sid']}}, function (err) {
			if (err) {
				console.log(err);
				return res.sendStatus(500);
			};
		});
	} else {
		if (req.user.session_id != req.cookies['connect.sid']) {
				dbaction.userUpdate(req.user.user_id, {$set : {session_id : req.cookies['connect.sid']}}, function (err) {
				if (err) {
					console.log(err);
					return res.sendStatus(500);
				};
			});
		};
	};

	next();
	
};
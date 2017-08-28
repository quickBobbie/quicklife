var cookie = require('cookie'),
	async = require('async');

var dbaction = require('../actions/dbaction');

exports.authSocket = function (handshakeData, cb) {
	handshakeData.cookies = cookie.parse(handshakeData.headers.cookie || '');

	var sid = handshakeData.cookies['connect.sid'];
	dbaction.findUser({session_id : sid}, function (err, user) {
		if (err) throw err;

		handshakeData.user = user;

		cb(null, true);
	});
};

exports.connection = function (socket) {
	console.log(socket.request.user.user_id)
	dbaction.findUser({user_id : socket.request.user.user_id}, function (err, user) {
		if (err) throw err;

		async.parallel([
			function (cb) {
				dbaction.userUpdate(user.user_id, {$set : {net_status : true, socket_id : socket.id}}, function (err) {
					cb (err, null);
				})
			}
		], function (err, results) {
			if (err) throw err;

			console.log('connected user ' + user.user_id);
		});
	})
};
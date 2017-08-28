var cookie = require('cookie'),
	cfg = require('config'),
	connect = require('connect');

var socketController = require('../controllers/socketController');
var dbaction = require('../actions/dbaction');

function webSocket (io) {
	io.set('authorization', socketController.authSocket);

	io.sockets.on('connection', function (socket) {
		socketController.connection(socket);

		socket.on('disconnect', function () {
			dbaction.userUpdate(socket.request.user.user_id, {$set : {net_status : false, socket_id : ''}}, function (err) {
				if (err) throw err;
			});
		});
	});
};

module.exports = webSocket;
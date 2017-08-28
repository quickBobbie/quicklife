var fs = require('fs'),
	path = require('path');

var G_PATH = process.cwd() + '/public/users/';

exports.createUserFolders = function (userID, cb) {
	fs.mkdir(G_PATH + userID, function (err) {
		cb(err);
		
		fs.mkdirSync(G_PATH + userID + '/images');
		fs.mkdirSync(G_PATH + userID + '/audio');
	});
};

exports.checkMIMEType = function (reqMIME, arrMIME, cb) {
	arrMIME.forEach(function (val) {
		if (reqMIME === val) return cb(null, reqMIME);
	});
};

exports.saveFile = function (path, part) {
	var out = fs.createWriteStream(G_PATH + path);

	part.pipe(out);
};
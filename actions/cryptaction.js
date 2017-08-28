var crypto = require('crypto');

exports.genSalt = function (condidate, cb) {
	
	var salt = '$ql$10rd$' + crypto
		.createHmac('sha256', condidate)
    	.update('quicklife is social network by Sergey Ushchanskiy')
    	.digest('hex');

    cb(null, salt);

};

exports.genHash = function (secret, salt, cb) {

	crypto.pbkdf2(secret, salt, 100000, 32, 'sha256', function (err, hash) {
		cb(err, hash.toString('hex'));
	});

};
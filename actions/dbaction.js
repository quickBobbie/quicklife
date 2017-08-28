var userModel = require('../models/user'),
	postModel = require('../models/posts'),
	imageModel = require('../models/images'),
	messageModel = require('../models/message');

exports.getUsersCount = function (cb) {
	userModel.find().count(function (err, count) {
		cb(err, count);
	});
};

exports.findUser = function (searchObj, cb) {
	userModel.findOne(searchObj, function (err, user) {
		cb(err, user);
	});
};

exports.findUsers = function (searchObj, skip, cb) {
	userModel.find(searchObj).skip(skip).limit(30).exec(function (err, users) {
		cb(err, users);
	});
};

exports.findUsersAll = function (cb) {
	userModel.find(function (err, users) {
		cb(err, users);
	});
};

exports.addUser = function (userObj, cb) {

	var newUser = new userModel(userObj);

	newUser.save(function (err, user) {
		cb(err, user);
	});
};

exports.userUpdate = function (userID, param, cb) {
	userModel.update({'user_id' : userID}, param, function (err) {
		cb(err);
	});
};

exports.findNews = function (searchObj, skip, cb) {
	postModel.find(searchObj).sort({'post_id' : -1}).skip(skip).limit(10).exec(function (err, posts) {
		cb(err, posts);
	});
};

exports.findPost = function (postID, cb) {
	postModel.findOne({'post_id' : postID}, function (err, post) {
		cb(err, post);
	});
};

exports.addPost = function (postObj, cb) {
	var newPost = new postModel(postObj);

	newPost.save(function (err, post) {
		cb(err, post);
	});
};

exports.postUpdate = function (postID, param, cb) {
	postModel.update({'post_id' : postID}, param, function (err) {
		cb(err);
	});
};

exports.addImage = function (imgObj, cb) {
	var newImage = new imageModel(imgObj);

	newImage.save(function (err, image) {
		cb(err, image)
	});
};

exports.findImages = function (searchObj, cb) {
	imageModel.find(searchObj, function (err, images) {
		cb(err, images);
	});
};

exports.findImage = function (userID, cb) {
	imageModel.findOne({'img_id' : userID}, function (err, image) {
		cb(err, image);
	});
};

exports.saveMessage = function (messObj, cb) {
	var newMessage = new messageModel(messObj);

	newMessage.save(function (err, message) {
		cb(err, message);
	});
};

exports.findMessage  = function (messObj, cb) {
	messageModel.findOne(messObj, function (err, message) {
		cb(err, message);
	});
};

exports.updateMessage = function (mess_id, updateObj, cb) {
	messageModel.update({message_id : mess_id}, updateObj, function (err) {
		cb(err);
	});
};
var mongoose = require('mongoose'),
	mongoAutoInc = require('mongoose-auto-increment');

var userMain = mongoose.Schema({
	user_id:{
		type: Number,
		unique: true
	},
	login:{
		type: String,
		unique: true
	},
	password: String,
	registration: {
		type: Date,
		default: Date.now
	},
	first_name: String,
	last_name: String,
	birthday:{
		type: Date,
		default: ''
	},
	gender:{
		type: String,
		default: ''
	},
	avatar: String,
	city:{
		type: String,
		default: ''
	},
	mar_status:{
		type: String,
		default: ''
	},
	web_site: {
		type: String,
		default: ''
	},
	fb_link: {
		type: String,
		default: ''
	},
	vk_link: {
		type: String,
		default: ''
	},
	telephone_num: {
		type: String,
		default: ''
	},
	quote: {
		type: String,
		default: ''
	},
	status:{
		type: String,
		default: ''
	},
	net_status: {
		type: Boolean,
		default: false
	},
	socket_id: String,
	session_id: String,
	subscribe: Array,
	subscribers: Array,
	posts: Array,
	likes: Array,
	images : Array,
	messages : [{
		message_id: Number,
		user: Number,
		name: String
	}]
});

userMain.plugin(mongoAutoInc.plugin, {
	model: 'User',
	field: 'user_id',
	startAt: 1,
	incrementBy: 1
});

var user = mongoose.model('User', userMain);

module.exports = user;
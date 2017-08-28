var mongoose = require('mongoose'),
	mongoAutoInc = require('mongoose-auto-increment');

var postSchema = mongoose.Schema({
	post_id:{
		type: Number,
		unique: true
	},
	author_id: Number,
	author_avatar: String,
	author_name: String,
	post_type: String,
	author_action: String,
	text: String,
	image_name: String,
	date: {
		type: Date,
		default: new Date()
	},
	likes: Array,
	comments: Array
});

postSchema.plugin(mongoAutoInc.plugin, {
	model: 'Post',
	field: 'post_id',
	startAt: 1,
	incrementBy: 1
});

var post = mongoose.model('Post', postSchema);

module.exports = post;
var mongoose = require('mongoose'),
	mongoAutoInc = require('mongoose-auto-increment');

var imageSchema = mongoose.Schema({
	img_id:{
		type: Number,
		unique: true
	},
	uid: Number,
	name: String,
	date: {
		type: Date,
		default: Date.now
	},
	likes: Array,
	comments: Array
});

imageSchema.plugin(mongoAutoInc.plugin, {
	model: 'Image',
	field: 'img_id',
	startAt: 1,
	incrementBy: 1
});

var image = mongoose.model('Image', imageSchema);

module.exports = image;
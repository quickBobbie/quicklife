var mongoose = require('mongoose'),
	mongoAutoInc = require('mongoose-auto-increment');

var messageSchema = mongoose.Schema({
	message_id:{
		type: Number,
		unique: true
	},
	messages: [{
		text: String,
		user_1: Number,
		user_2: Number,
		date: {
			type: Date,
			default: Date()
		}
	}]
});

messageSchema.plugin(mongoAutoInc.plugin, {
	model: 'Message',
	field: 'message_id',
	startAt: 1,
	incrementBy: 1
});

var message = mongoose.model('Message', messageSchema);

module.exports = message;
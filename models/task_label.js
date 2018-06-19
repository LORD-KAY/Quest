var mongoose = require('mongoose'),
	Schema   = mongoose.Schema;

var Task  = require('./tasks'),
	User  = require('./user');

var labelSchema = new Schema({
	label_name: {
		type:String,
		required: true,
		default: null
	},
	task_id:{
		type:Schema.Types.ObjectId,
		ref: 'Task'
	},
	user_id:{
		type:Schema.Types.ObjectId,
		ref: 'User'
	},
	createdAt:{
		type:Date,
		default: Date.now
	},
	updatedAt:{
		type:Date,
		default: Date.now
	}
});

//Signals will be defined here

// exporting the module for use
var Label = mongoose.model('Labels',labelSchema);
module.exports = Label;
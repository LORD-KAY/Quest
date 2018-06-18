var User = require('./user')
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var task = new Schema({
	title: {
		type:String,
		required:true
	},
	description: String,
	completed: Boolean,
	color:{
		type:String,
		required: false
	},
	user_id :{ 
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	createdAt:{
		type:Date,
		default: Date.now
	}
});


var Task = mongoose.model('Task',task);
module.exports = Task;
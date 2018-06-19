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
	},
	updatedAt:{
		type:Date,
		default: Date.now
	}
});

// Creating signals for the tables
// task.pre('save',function(next){
// 	this.updatedAt(Date.now())
// 	next();
// });

var Task = mongoose.model('Task',task);
module.exports = Task;
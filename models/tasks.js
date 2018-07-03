var User = require('./user');
var Task_Label = require('./task_label');
var Task_Advance_Options = require('./task_adv_opts');
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
task.pre('save',function(next){

});
task.pre('remove',function(next){
    Task_Label.remove({ task_id: this._id }).exec();
    Task_Advance_Options.remove({ task_id: this._id }).exec();
    next();
});


var Task = mongoose.model('Task',task);
module.exports = Task;
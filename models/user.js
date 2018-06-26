var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//Importing the other tables relating to the User table
var Task   = require('./tasks');
var User_Verification = require('./user_verification');

// providing setters for the email schema
function emailFormatter(email){
	var format = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
	if (format){
		return email;
	}
}

//set up mongoose model and pass it using  module.
var userSchema = new Schema({
	fullname:{
		type:String,
		require:true,
	},
	email:{
		type:String,
		require:true,
		unique: true,
		set:emailFormatter
	},
	password:{
		type:String,
		required:true
	},
	confirm_password:{
		type:String,
		required:true
	},
	status:{
		type:Number,
		required:false,
		default:0
	},
	access_token:{
		type:String,
		required:false
	},
	createdAt:{
		type:Date,
		default:Date.now
	},
	updatedAt:{
		type:Date,
		default: Date.now
	}
});
//Writing signals for the user schema
userSchema.pre('remove',function(next){
	User_Verification.remove({ user_id: this._id }).exec();
	Task.remove({ user_id: this._id }).exec();
	next();
});

//Creating methods for the user schema


var User = mongoose.model('User',userSchema);

module.exports = User;

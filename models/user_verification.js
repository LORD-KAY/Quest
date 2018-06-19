var mongoose = require('mongoose');
var User    = require('./user');
var Schema = mongoose.Schema;

var userVerificationSchema = new Schema({
	token:{
		type:Number,
		require:true
	},
	user_id:{
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

var User_Verification = mongoose.model('User_Verification',userVerificationSchema);

module.exports = User_Verification;
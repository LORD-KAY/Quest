var User = require('.../models/user'),
	User_Verification = require('.../models/user_verification'),
	task   = require('.../models/tasks'),
	task_label = require('.../models/task_label'),
	mongoose = require('mongoose'),
	config   = require('.../config');

	before( async function(done){
		await mongoose.connect(config.database);
		done();
	});
//Tests for the task and it's label will appear here

var User = require('../models/user'),
	User_Verification = require('../models/user_verification'),
	task   = require('../models/tasks'),
	task_label = require('../models/task_label'),
	mongoose = require('mongoose'),
	config   = require('../config');

	before(function(done){
		mongoose.connect(config.database);
		done()
	});

	//Writing my first test for the user models
	describe("Signing Up New User",function(){
		describe("Save()",function(){
			it(" should save the user to the database",function(){
				var data = new User({
					fullname:'lord banks',
					email: 'offeilord@gmail.com',
					password: 'lordbanks',
					confirm_password: 'lordbanks'
				});

				data.save();
			});

			it(" passes after 500ms",function(done){
				setTimeout(done, 500);
			});
		})
	});
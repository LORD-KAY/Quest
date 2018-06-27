// Testing the models 
var expect = require('chai').expect;
var User = require('../models/user'),
	User_Verification = require('../models/user_verification'),
	task   = require('../models/tasks'),
	task_label = require('../models/task_label'),
	hash_password = require('./utils/bcrypt.spec');
var db = require('./utils/db.spec');

	describe("Signing up new users", function(){
		db();
		describe(" #Saving data",function(){
			it("should return no error",function(done){
				var query = {
					fullname: 'Acheampong Lord Offei',
					email: 'lordkay1996@gmail.com',
					password: password,
					confirm_password: password
				};

				var data = new User(query);
				data.save();
				done();
			});
		});
	});
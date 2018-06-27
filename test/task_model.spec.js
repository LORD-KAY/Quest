// Testing the models 
var expect = require('chai').expect;
var User = require('../models/user'),
	User_Verification = require('../models/user_verification'),
	task   = require('../models/tasks'),
	task_label = require('../models/task_label'),
	hash_password = require('./utils/bcrypt.spec');
var db = require('./utils/db.spec');

	describe(" Hash function ",function(){
		it(" should be a function ", function(done){
			expect(hash_password).to.be.a('function');
			done();
		});
	});

	// describe(" Hash password ", function(){
	// 	it(" should encrypt the password ",function(done){
	// 		var ps = hash_password('lordbanks');
	// 		expect(ps).to.be.an('string');
	// 		done();
	// 	});
	// });

	describe("Signing up new users", function(){
		db();
		describe(" #Saving data",function(){
			it("should return no error",function(done){
				var password = hash_password('lordbanks');
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
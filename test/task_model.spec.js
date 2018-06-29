// Testing the models 
var expect = require('chai').expect,
	should = require('chai').should;
var User = require('../models/user'),
	User_Verification = require('../models/user_verification'),
	task   = require('../models/tasks'),
	task_label = require('../models/task_label'),
	Resolvers  = require('../utils/resolvers');
var db = require('./utils/db.spec');
	
	describe(' # Checking the resolvers ',function(){
		it('should return a string - hash',function(done){
			expect(Resolvers.hashPassword).to.be.a('function');
			Resolvers.hashPassword('lordbanks').then( hashed => {
				expect(hashed).to.be.a('string');
			});
			done();
		});

		it('should return true',function(done){
			var data = Resolvers.comparePassword('lordbanks','lordbanks');
			expect(data).to.be.true;
			done();
		});
	});

	describe("Testing models", function(){
		db();
		describe(" #Saving a user",function(){
			it("should return no error",function(done){
				Resolvers.hashPassword('lordbanks').then(hashed => {
					var query = {
						fullname: 'Lord Ray',
						email: 'offeilord@gmail.com',
						password: hashed,
						confirm_password: hashed
					};

					var data = new User(query);
					data.save();
				});
				done();
			});
		});

		describe(" #Finding a user",function(){
			it('should return an identified user',function(done){
				var data = User.findOne({ email: 'offeilord@gmail.com' });
				data.exec(function(err,data){
					expect(data).to.be.an('object');
					expect(data).to.have.property('fullname');
				});
				done();
			});
		});
	});
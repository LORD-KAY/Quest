var mongoose = require('mongoose');
	
	before(function(done){
		  mongoose.connect('mongodb://127.0.0.1:27017/tasks');
		  done();
	});

	after(function(done){
		mongoose.connection.db.dropDatabase;
		mongoose.connection.db.close;
		done()
	});

	module.exports = function(){
		afterEach(function(done){
			mongoose.connection.db.dropCollection;
			done();
		});
	}
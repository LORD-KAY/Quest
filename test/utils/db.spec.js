var mongoose = require('mongoose');
	
	before(function(done){
		  mongoose.connect('mongodb://127.0.0.1:27017/tasks');
		  const db = mongoose.connection;
		  db.on('error',console.error.bind(console, 'connection error'));
		  db.once('open',function(){
		  	console.log('Connection established');
		  	done();
		  });
	});

	after(function(done){
		mongoose.connection.db.dropDatabase(function(){
			mongoose.connection.close(done)
		});
	});

	module.exports = function(){
		afterEach(function(done){
			mongoose.connection.db.dropCollection;
			done();
		});
	}
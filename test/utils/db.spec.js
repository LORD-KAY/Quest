var mongoose = require('mongoose'),
	config   = require('.../config');

	before( async function(done){
		await mongoose.connect(config.database);
		done();
	});

	afterEach( async function(done){
		await db.dropCollection();
		done();
	});

	after( async function(done){
		await db.dropDatabase();
		await db.close();
		done();
	});
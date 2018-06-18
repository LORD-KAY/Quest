var express = require('express'),
    User   = require('./models/user'),
    Task  = require('./models/tasks'),
    User_Verification = require('./models/user_verification'),
    jwt  = require('jsonwebtoken'),
    config = require('./config');

    //Defining the router
    var app = express()
    var apiRouter = express.Router();

    app.set('superSecret',config.secret);

    //Adding a user to the database
    function checkPassword(password, password1){
        return password == password1;
    }

    function genToken(min,max){
        return Math.random((Math.random() * (max + min)) + min)
    }

    app.get('/signup',function(req,res){
        var fullname = req.body.fullname,
            email    = req.body.email,
            password = req.body.password,
            confirm_password = req.body.password,
        if (checkPassword(password,confirm_password)) {
            var user_details = new User({
                fullname: fullname,
                email: email,
                password: password,
                confirm_password: confirm_password
            })

            user_details.save(function(err,data){
                if(err){
                    res.json({
                        failure: "An Error Occurred"
                    });
                }else {
                    // Generating the verification token and saving it into the user_verification table
                    var auth_token = new User_Verification({
                        token: genToken(100000,999999),
                        user_id: req.body.email
                    });

                    auth_token.save(function(err,data){
                        if (err) {
                            res.json({
                                failure: err
                            });
                        }else{
                            res.json({
                                success: "User Successfully saved",
                                results: data
                            });
                        }
                    });

                }
            })
        }

    })

    // Authentication router
    apiRouter.post('/authenticate',function(req,res){
        User.findOne({
            name: req.body.name
        },function(err,user){
            if(err) console.log(err)

            if(!user){
                res.json({success: false, message:'Authentication failed. User not found.'})
            }else if(user){
                if(user.password != req.body.password ){
                    res.json({
                        success: false,
                        message:'Authentication failed. Wrong password.'
                    });
                }else{
                    const payload = {
                        admin_id:user._id
                    }
                    var token = jwt.sign(payload, app.get('superSecret'),{
                        algorithm: 'HS256',
                        expiresIn: '1440s'
                    });
                    res.json({
                        success:true,
                        message: 'Enjoy your token',
                        token:token
                    });
                }
            }
        })
    })

    //Protecting the views 
    apiRouter.use(function(req,res, next){
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if(token){
            //verification of secret and checking of expiration
            jwt.verify(token,app.get('superSecret'),function(err, decoded){
                if (err){
                    return res.json({
                        success:false,
                        message:'Failed to authenticate'
                    })
                }else{
                    req.decoded = decoded;
                    next();
                }
            })
        } else {
            return res.status(403).send({
                success:false,
                message: 'No Token Provided'
            });
        }
    });
    //Defining the routes
    apiRouter.get('/home',function(req,res){
        res.send("This is the inner API Configs and Routes")
    });

    apiRouter.get('/users',function(req,res){
        User.find({},function(err,users){
            res.json(users)
        });
    });

    //Adding a task to the system
    apiRouter.post('/task/add',function(req,res){
    	var data = {
    		title : req.body.title,
    		description: req.body.description,
    		completed: req.body.completed,
    		user_id: req.decoded.admin_id
    	};

    	var results = new Task(data);
    	results.save(function(error,data){
    		if (error) {
    			res.json({
    				failure: "Tasks wasn't able to save"
    			});
    		}
    		else{
    			res.json({
    				success: "Task save successfully"
    			});
    		}
    	});


    });

    //Getting one task from the db
    apiRouter.get('/task/:id',function(req,res){
    	var task_id = req.params.id;
    	Task.findById({
    		_id: task_id
    	}).then(function(data){
    		if (!data) {
    			res.json({
    				failure: "Could not get single task",
    			});
    		}
    		else {
    			res.json({
    				results: data
    			});
    		}
    	})
    })

    //Getting all the tasks added by a user
    apiRouter.get('/tasks/all',function(req,res){
    	Task.find({ user_id: req.decoded.admin_id })
    		.populate('user_id')
    		.sort({ createdAt: "descending" })
    		.exec(function(error,tasks){
    			res.json(tasks)
    		});
    });

    // Special access token url
    apiRouter.get('/access-token',function(req,res){
    	var access = req.decoded;
    	res.json({
    		success:true,
    		access: access
    	})
    })


    // Delete Tasks End Points
    // Endpoint for deleting all tasks added by a particular user
    apiRouter.get('/tasks/delete/all',function(req,res){
    	
    })

    //Endpoint for deleting tasks selected by a particular added user

    //Endpoint for deleting a single task added by a particular user
    apiRouter.get('/tasks/delete/:id',function(req,res){
    	var task_id = req.params.id;
    	var current_user_id = req.decoded.admin_id;
    	Task.remove({ _id: task_id })
    		.where('user_id').equals(current_user_id)
    		.exec(function(err,results){
    			res.json({
    				success:results
    			})
    		})

    })
    
    apiRouter.get('/logout',function(req,res){
    	

    })


    //Deleting the original data
    apiRouter.get('/delete/all',function(req,res){
        User.remove({},function(err,data){
            if (!err) {
                res.json({
                    success:" Data removal was lit"
                })
            }
        })
    })





    //Exporting the data to be used by other modules
    module.exports = apiRouter
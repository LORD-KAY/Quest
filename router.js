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

    // Authentication router
    apiRouter.post('/authenticate',function(req,res){
        User.findOne({
            email: req.body.email
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
    //Defining the routes /home
    apiRouter.get('/home',function(req,res){
        res.send("This is the inner API Configs and Routes")
    });

    /********* USERS **************/
    // Getting user details
    apiRouter.route('/user')
             .get(function(req,res,next){
                var current_id = req.decoded.admin_id;
                User.where({ _id: current_id })
                    .exec(function(err,data){
                        res.json(data)
                    });
             })
             .put(function(req,res,next){
                
             })
             .delete(function(req,res,next){
                next(new Error('Not implemented'))
             });


    //Getting all the tasks added by a user /task/all
    apiRouter.get('/task/all',function(req,res){
        Task.find({ user_id: req.decoded.admin_id })
            .populate('user_id')
            .sort({ createdAt: "descending" })
            .exec(function(error,tasks){
                res.json(tasks)
            });
    });

    //Adding a task to the system /task/add
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
    				failure: "Tasks wasn't able to save",
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

    // Updating a single data
    apiRouter.put('/task/update/:id',function(req,res){
        var task_id = req.params.id;
        var Query = Task.find({ _id: task_id });
        var pars = {
            title: req.body.title,
            description: req.body.description,
            completed: req.body.completed,
            color: req.body.color,
            updatedAt: Date.now()
        };

        Query.update({ $set: pars })
        .exec(function(err,data){
            if(!err){
                res.json(data)
            }else{
                res.json({
                    error: err,
                    failure: "Unable to update task"
                });
            }
        });
    })
    // Special access token url
    apiRouter.get('/access-token',function(req,res){
    	var access = req.decoded;
    	res.json({
    		success:true,
    		access: access
    	})
    })

    // Delete Tasks End Points
    //Endpoint for deleting a single task added by a particular user
    apiRouter.get('/tasks/delete/:id',function(req,res){
    	var task_id = req.params.id;
    	var current_user_id = req.decoded.admin_id;
    	Task.remove({ _id: task_id })
    		.where('user_id').equals(current_user_id)
    		.exec(function(err,results){
    			res.json({
    				success:results
    			});
    		});

    });
    // Endpoint for deleting all tasks added by a particular user
    apiRouter.get('/tasks/delete/all',function(req,res){
        
    })
    
    // Endpoint for editing a label
    
    apiRouter.get('/logout',function(req,res){
    	

    })


    //Exporting the data to be used by other modules
    module.exports = apiRouter
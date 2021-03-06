var express = require('express'),
    User   = require('../models/user'),
    Task  = require('../models/tasks'),
    User_Verification = require('../models/user_verification'),
    Task_Label = require('../models/task_label'),
    jwt  = require('jsonwebtoken'),
    bcrypt = require('bcryptjs'),
    config = require('../config');

    //Defining the router
    var app = express();
    var apiRouter = express.Router();

    app.set('superSecret',config.secret);

    // Authentication router
    apiRouter.post('/authenticate',function(req,res){
        User.findOne({
            email: req.body.email
        },function(err,user){
            if(err) console.log(err);

            if(!user){
                res.json({success: false, message:'Authentication failed. User not found.'})
            }else if(user){
                //implementing the bcrypt hash for comparison
                bcrypt.compare(req.body.password,user.confirm_password).then((data) => {
                    if (!data) {
                        res.status(401).json({
                            success:false,
                            message: 'Authentication failed. Wrong Password',
                        });
                    }else{
                         const payload = {
                                admin_id:user._id
                            };
                        var token = jwt.sign(payload, app.get('superSecret'),{
                            algorithm: 'HS256',
                            expiresIn: '1440s'
                        });
                        res.json({
                            success:true,
                            message: 'Token successfully generated',
                            token:token
                        });
                    }
                });
            }
        });
    });

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
    
    // Endpoint for task labels 
    apiRouter.post('/task/label/add',function(req,res){
        var user_id = req.decoded.admin_id,
            task_id = req.body.task_id,
            task_label = req.body.task_label;

        var qs = new Task_Label({
            label_name: task_label,
            task_id: task_id,
            user_id: user_id
        });

        qs.save(function(err,data){
            if(!err){
                res.json({
                    results: data,
                    message: "Label created successfully"
                });
            }else{
                res.json({
                    results: err,
                    message: "Error Occurred"
                });
            }
        })
    });

    apiRouter.get('/task/:id/label',function(req,res){
        var task_params_id = req.params.id;
        Task_Label.find({ task_id : task_params_id })
                  .where('user_id').equals(req.decoded.admin_id)
                  .populate('task_id')
                  .exec(function(err,results){
                      if(!err){
                          res.status(200).json({
                              message: "Data successfully retrieved",
                              data: results
                          });
                      }
                      else{
                          res.status(203).json({
                              message: "No data found",
                              data:err
                          });
                      }
                  });
    });

    apiRouter.put('/task/label/edit',function(req,res){
        var label_id = req.body.label_id,
            label_name = req.body.task_label;
        var Query = Task_Label.find({ _id: label_id });
        var pars = {
            label_name: label_name
        };

        Query.update({ $set: pars })
                  .exec(function(err,data){
                    if (!err) {
                        res.status(200).json({
                            message: 'Label Updated successfully',
                            data: data
                        });
                    }else{
                        res.status(203).json({
                            message: 'Content wasn\'t updated',
                            data: err
                        });
                    }
            });
    });

    apiRouter.get('/logout',function(req,res){
    	

    })


    //Exporting the data to be used by other modules
    module.exports = apiRouter
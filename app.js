var express = require('express'),
    http = require('http'),
    mongoose = require('mongoose'),
    morgan  = require('morgan'),
    express_session = require('express-session'),
    bodyParser = require('body-parser'),
    jwt  = require('jsonwebtoken'),
    bcrypt = require('bcryptjs'),
    nodemailer = require('nodemailer'),
    config = require('./config'),
    User  = require('./models/user'),
    Task  = require('./models/tasks'),
    User_Verification = require('./models/user_verification'),
    tokenNotifier  = require('./utils/nodemailer'),
    apiRouter = require('./api/api-v1');

//Instantiating the express  application
var app = express();
var SALT_FACTOR = 10;
//Setting the basic initials
app.set('title','Task Application API');
app.set('port',process.env.PORT || 3000);

mongoose.connect(config.database) // this is a pending connection
var db = mongoose.connection;
db.on('error',console.error.bind(console," Connection Error "));
db.once('open',function(){
    console.log("Connection established")
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Activating the morgan logger
app.use(morgan('dev'))
app.use(function(request,response,next){
    console.log("Middleware for starter");
    next()
});

app.get('/',function(request,response,next){
    response.send('Hello! The API is a lit');
})

//Adding a user to the database
function checkPassword(password, password1){
    return password == password1;
}

function genToken(min,max){
    return Math.floor((Math.random() * (max + min)) + min)
}

app.post('/signup',function(req,res){
    var fullname = req.body.fullname,
        email    = req.body.email,
        password = req.body.password,
        confirm_password = req.body.password;
    if (checkPassword(password,confirm_password)) {
        //Using bcrypt to secure the password
        bcrypt.genSalt(SALT_FACTOR,function(err,salt){
            bcrypt.hash(confirm_password,salt,function(err,hash_password){
                 var user_details = new User({
                    fullname: fullname,
                    email: email,
                    password: hash_password,
                    confirm_password: hash_password
                });
                user_details.save(function(err,data){
                    if (!err) {
                        // Generating the verification token and saving it into the user_verification table
                        var user_fk   = data._id,
                            generated_token = genToken(10000,99999);
                        //Send the generated token to the email
                        tokenNotifier("lordkay1996@gmail.com",data.email,data.fullname,generated_token);
                        var auth_token = new User_Verification({
                            token: generated_token,
                            user_id: user_fk
                        });

                        auth_token.save(function(err,data){
                            if(!err){
                                res.json({
                                    data:data
                                })
                            }else{
                                res.json({
                                    failure: err
                                })
                            }
                        })
                        
                    }else{
                        res.json({
                            failure: err
                        });
                    }
                })
            });
        });
    }else{
        res.status(402).json({
            success:false,
            message: 'Password doesn\'t match'
        });
    }

})

//These things are temporal routes
 app.get('/users',function(req,res){
    User.find({},function(err,users){
        res.json(users)
    });
});

app.get('/users/tokens',function(req,res){
    User_Verification.find()
        .populate({ path : 'user_id', select: 'email'})
        .sort({created_at:'descending'})
        .exec(function(err,data){
            res.json(data)
        })
})

//Deleting the original data
app.get('/delete/:id',function(req,res){
    var data_id = req.params.id;
    User.findById({ _id: data_id })
        .exec(function(err,data){
            if (!err) {
                data.remove();
                res.status(200).json({
                    success: true,
                    message: 'Deleting a user was successful'
                })
            }else{
                res.status(401).json({
                    success: false,
                    message: 'Unknown error occurred'
                })
            }
        })
})

// Calling the api configs here
app.use('/api/v1',apiRouter);
// app.use('/api/v2',apiRouter1);

http.createServer(app).listen(app.get('port'),function(){
    console.log("The server started at port " + app.get('port'));
});


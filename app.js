var express = require('express'),
    http = require('http'),
    mongoose = require('mongoose'),
    morgan  = require('morgan'),
    express_session = require('express-session'),
    bodyParser = require('body-parser'),
    jwt  = require('jsonwebtoken'),
    config = require('./config'),
    User  = require('./models/user'),
    Task  = require('./models/tasks'),
    User_Verification = require('./models/user_verification'),
    apiRouter = require('./router');

//Instantiating the express  application
var app = express();

//Setting the basic initials
app.set('title','Task Application API');
app.set('port',process.env.PORT || 3000);

mongoose.connect(config.database,function(){
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
        var user_details = new User({
            fullname: fullname,
            email: email,
            password: password,
            confirm_password: confirm_password
        })

        user_details.save(function(err,data){
            if (!err) {
                // Generating the verification token and saving it into the user_verification table
                var user_fk   = data._id,
                    generated_token = genToken(10000,99999);
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
                res.json({
                    success: 'Deleting was a lit'
                })
            }
        })
})

// Calling the api configs here
app.use('/api/v1',apiRouter);
// app.use('/api/v2',apiRouter1);

http.createServer(app).listen(app.get('port'),function(){
    console.log("The server started at port " + app.get('port'))
});


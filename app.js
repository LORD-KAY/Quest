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


// Calling the api configs here
app.use('/api/v1',apiRouter);
// app.use('/api/v2',apiRouter1);

http.createServer(app).listen(app.get('port'),function(){
    console.log("The server started at port " + app.get('port'))
});


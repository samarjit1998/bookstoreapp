var express = require('express');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var  logger = require('logger');
var path = require('path');
var book = require('./routes/book');
var auth=require('./routes/auth')
var mongoose=require('mongoose');
mongoose.Promise=require('bluebird');
mongoose.connect('mongodb://localhost:27027/adminportaldb',{
    userNewUrParser:true,
    promiseLibrary:require('bluebird')
})
.then(() => console.log('connection is successful'))
.catch((err) => console.error(err));inpm start
const { appendFileSync } = require('fs');
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.joint(__dirname,'build')));
app.use('/api/book',book);
app.use('/api/auth',auth);
app.use(function(req,reas,next){
    var err = new Error('Not Found');
    err.status= 404;
    next(err);
})
app.use(function(err,req,res,next){
    res.locals.message = err.message;
    res.locals.error = req.app.get('env')= 'developement'?err:{};
    res.status(err.status || 500);
    res.render('error');
})
module.exports = app;
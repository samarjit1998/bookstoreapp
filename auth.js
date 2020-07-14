var mongoose = require('mongoose');
var passport = require('passport');
var settings = require('../config/settings');
require(../config/passport')(passport);
var express=require('express');
var jwt= require('jsonwebtoken');
var router = express.Router();
var user = require('../MODELS/user');

router.post('/register',function(req,res){
    if(!req.body.username || !req.body.password){
        res.json(success:false,msg:'Please pass username and password'});
    }
    else{
        var newUser = new user({
            username:req.body.username,
            password:req.body.password
        })
        newUser.save(function(err){
            if(err){
                return res.json({success:false,msg:'Username already exists'})
            }
            res.json({success:true,msg:'user is created successfully'})
        })
    }
})
router.post('/login',function(req,res){
    user.findOne({
        username:req.body.username
    },function(err,user){
        if(err){
            throw err;
        }
        if(!user){
            res.status(401).send({success:false,msg:'Authentication failed,user not found'});

        }
        else{
            user.comparePassword(req.body.password,function(err,isMatch){
                if(isMatch&&!err){
                    var token = jwt.sign(user.toJSON(),settings.secret);
                    res.json({success:false,token:'JWT'+token});


                }
                else{
                    res.status(401).send({success:false,msg:'Authentication Failed,Password failed'});
                }
            })
        }
    })
})
module.exports= router;
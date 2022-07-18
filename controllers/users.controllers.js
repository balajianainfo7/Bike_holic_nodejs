const bcryptjs = require('bcryptjs');
const { verify } = require('jsonwebtoken');
const { result } = require('lodash');
const userService = require('../services/users.services');

exports.register = (req, res, next) => {
    const {password} = req.body;
    const salt = bcryptjs.genSaltSync(10);

    req.body.password = bcryptjs.hashSync(password, salt);

    userService.register(req.body, (error, result) => {
         if(error){
            return next(error);
         }
         return res.status(200).send({
            message: "Success",
            data: result,
         });
    });
};

exports.login = (req, res, next) => {
   const{ email, password} = req.body;
   userService.login({email, password}, (error, result) => {
    if(error){
        return next(error);
    }
    return res.status(200).send({
        message: "Success",
        data: result,
    });
   });
};

exports.userProfile = (req, res, next) =>{
  return res.status(200).json({message: "Authorized User"});
  
};

exports.otpLogin = (res, req, next) =>{
    userService.createOtp(req.body, (error, results) =>{
        if(error){
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results
        })
    });
};

exports.verifyOtp = (res, req, next) =>{
    userService.verifyOtp(req.body, (error, results) => {
        if(error){
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results,
        })
    });

    };

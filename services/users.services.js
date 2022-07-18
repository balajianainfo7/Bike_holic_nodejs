const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const auth = require('../middlewares/auth');
const otpGenerator = require('otp-generator');
const crypto = require('crypto');
const { parseInt } = require('lodash');
const key = "otp-service-key";

async function login({email, password}, callback){
    const user = await User.findOne({email});

    if(user != null){
        if(bcrypt.compareSync(password, user.password)){
            const token = auth.generateAccessToken(email);
            return callback(null, {...user.toJSON(), token});
        }
        else{
            return callback({
                message: "Invalid username/password",
            });
        }
    }
        else{
            return callback({
                message: "Invalid username/Password",
            });
        }

    }

    async function register(params, callback){
        if(params.username === undefined){
            return callback({message: "Username Required"});
        }

        const user = new User(params);
        user.save()
        .then((response) => {
            return callback(null, response);

        }).catch((error) => {
            return callback(error);
        });
    }

    async function createOtp(params, callback){
        
        const otp = otpGenerator.generate(4, {
            alphabets : false,
            upperCase : false,
            specialChars : false
        });
        const ttl = 5 * 60 * 1000;
        const expires = Date.now() + ttl;
        const data = `${params.phone}.${otp}.${expires}`;
        const hash = crypto.createHmac("sha256", key).update(data).digest("hex");
        const fullHash = `${hash}.${expires}`;

        console.log(`Your otp is ${otp}`);
        return callback(null, fullHash);

    }

    async function verifyOtp(params, callback){
        let [hashValue, expires] = params.hash.split('.') ;

        let now = Date.now();
        if(now > parseInt(expires)) return callback("opt Expired");

        let data = `${params.phone}.${params.otp}.${expires}`;
        let newCalculateHash = crypto
        .createHmac("sha256")
        .update(data)
        .digest("hex");

        if(newCalculateHash === hashValue){
            return callback(null, "Success");
        }
        return callback("Invalid otp");
    }

    module.exports = {
        login,
        register,
        createOtp,
        verifyOtp
    };
const userController = require('../controllers/users.controllers');

const express = require('express');
const routes = express.Router();

routes.post("/register", userController.register);
routes.post("/login", userController.login);
routes.get("/user-profile", userController.userProfile);
routes.post("/otpLogin", userController.otpLogin);
routes.post("/verifyOtp", userController.verifyOtp);


module.exports = routes;
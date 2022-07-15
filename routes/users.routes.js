const userController = require('../controllers/users.controllers');

const express = require('express');
const routes = express.Router();

routes.post("/register", userController.register);
routes.post("/login", userController.login);
routes.post("/xuser-profile", userController.userProfile);

module.exports = routes;
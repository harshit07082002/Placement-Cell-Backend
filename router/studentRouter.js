const express = require('express');
const authController = require('../controller/authController');
const studentController = require('../controller/studentController');
studentRouter = express.Router();


studentRouter.route('/signin').post(authController.signin);
studentRouter.route('/signup').post(authController.signup);
studentRouter.route('/').patch(authController.checkLogin, studentController.updateStudent);

module.exports = studentRouter;

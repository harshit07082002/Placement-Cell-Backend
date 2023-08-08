const express = require('express');
const authController = require('../controller/authController');
const adminController = require('./../controller/adminController');

adminRouter = express.Router();

adminRouter.route('/signin').post(authController.signin);
adminRouter.route('/').post(authController.restricTo, adminController.getDetails);
adminRouter.route('/signup').post(authController.signup);
adminRouter.route('/get-all-students').get(authController.restricTo, adminController.getAllStudents);
adminRouter.route('/get-student/:enrollmentNo').get(authController.restricTo, adminController.getStudent);


module.exports = adminRouter;

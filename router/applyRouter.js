const express = require('express');
const authController = require('../controller/authController');
const studentController = require('../controller/studentController');

applyRouter = express.Router();

applyRouter.route('/').post(authController.checkLogin, studentController.applyJob);
applyRouter.route('/update').post(authController.checkLogin, studentController.updateAppliedJob);

module.exports = applyRouter;

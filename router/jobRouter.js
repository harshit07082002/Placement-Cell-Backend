const express = require('express');
const authController = require('../controller/authController');
const jobController = require('../controller/jobController');

jobRouter = express.Router();

jobRouter.route('/')
  .post(authController.restricTo,
    jobController.addJob)
  .get(authController.checkLogin,
    jobController.getAllJobs);

jobRouter.route('/id/:id')
  .get(authController.checkLogin,
    jobController.getSpecificJob)
  .patch(authController.restricTo,
    jobController.updateJob
    );
jobRouter.route('/scgpa/:id').get(authController.checkLogin, jobController.filterSCGPA);
jobRouter.route('/:query').get(authController.checkLogin, jobController.getJobs);

module.exports = jobRouter;
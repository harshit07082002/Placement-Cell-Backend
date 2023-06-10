const express = require('express');
const checkAdminController = require('../controller/checkAdminController');

checkAdminRouter = express.Router();

checkAdminRouter.route('/').get(checkAdminController.checkAdmin);


module.exports = checkAdminRouter;

const express = require('express');
const adminRouter = require('./router/adminRouter');
const studentRouter = require('./router/studentRouter');
const jobRouter = require('./router/jobRouter');
const globalError = require('./controller/errorController');
const checkAdminRouter = require('./router/checkAdminRouter');
const applyRouter = require('./router/applyRouter');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(cors());

//Routers
console.log('hereee');
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/student', studentRouter);
app.use('/api/v1/job', jobRouter);
app.use('/api/v1/apply', applyRouter);
app.use('/api/v1/check', checkAdminRouter);
app.use(globalError);

module.exports = app;

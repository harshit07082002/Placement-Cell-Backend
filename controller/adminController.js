const catchAsync = require('./catchAsync');
const Student = require('../models/studentModel');
const Job = require('../models/jobModel');

exports.getAllStudents = (catchAsync(async (req, res, next) => {
    const data = await Student.find();
    res.status(200).json({
      status: 'success',
      length: data.length,
      students: data,
    });
}));
exports.getStudent = (catchAsync(async (req, res, next) => {
    const data = await Student.findOne({enrollmentNo: req.params.enrollmentNo});
    res.status(200).json({
      status: 'success',
      students: data,
    });
}));

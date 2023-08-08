const catchAsync = require('./catchAsync');
const Student = require('../models/studentModel');
const Job = require('../models/jobModel');
const Admin = require('../models/adminModel');

exports.getDetails = (catchAsync(async (req, res, next) => {
  const a= req.body;
  console.log(a);
    const data = await Admin.findById(req.body.id);
    res.status(200).json({
      status: 'success',
      admin: data,
    });
}));

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

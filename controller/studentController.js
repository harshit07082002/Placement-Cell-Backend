const catchAsync = require('./catchAsync');
const Student = require('../models/studentModel');
const apiError = require('../utils/apiError');
const Job = require('../models/jobModel');


exports.updateStudent = catchAsync(async (req, res, next) => {
  const data = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data,
  });
})

exports.getDetails = (catchAsync(async (req, res, next) => {
  const a= req.body;
  console.log(a);
    const data = await Student.findById(req.body.id);
    res.status(200).json({
      status: 'success',
      admin: data,
    });
}));

exports.applyJob = catchAsync(async (req, res, next) => {
  const enrollmentNo = req.body.enrollmentNo, job_id = req.body.job_id;
  console.log(req.body);
  if (!enrollmentNo || !job_id) {
    return next(new apiError('Details are not present', 403));
  }
  const data = await Student.findOne({enrollmentNo});
  const job = await Job.findOne({job_id});
  if (!data) {
    return next(new apiError('Invalid Enrollment No', 403));
  }
  if (!job) {
    return next(new apiError('Invalid job id', 403));
  }
  let found = false;
  data.companies.forEach(element => {
    if (element.jobid === job_id) {
      found = true;
    }
  });
  if (found) {
    return next(new apiError('You have already registered for this job', 403));
  }
  job.applied.push({enrollment_no: enrollmentNo, name: data.name, status: 'Under Review'});
  data.companies.push({name: job.company, jobid: job.job_id, status: 'Under Review', ctc: job.package});
  await Student.updateOne({enrollmentNo}, data, {
    new: true,
    runValidators: true,
  });
  await Job.updateOne({job_id}, job, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
  });
});

exports.updateAppliedJob = catchAsync(async (req, res, next) => {
  const enrollmentNo = req.body.enrollmentNo, job_id = req.body.job_id, status = req.body.status;
  if (!enrollmentNo || !job_id || !status) {
    return next(new apiError('Details are not present', 403));
  }
  const data = await Student.findOne({enrollmentNo});
  const job = await Job.findOne({job_id});
  if (!data) {
    return next(new apiError('Invalid Enrollment No', 403));
  }
  if (!job) {
    return next(new apiError('Invalid job id', 403));
  }
  let found = false;
  data.companies.forEach(element => {
    if (element.jobid === job_id) {
      element.status = status;
      found = true;
    }
  });
  if (!found) {
    return next(new apiError('You have not registered for this job', 403));
  }
  found = false;
  job.applied.forEach(element => {
    if (element.enrollment_no === enrollmentNo) {
      element.status = status;
      found = true;
    }
  });
  if (!found) {
    return next(new apiError('You have not registered for this job', 403));
  }
  await Student.updateOne({enrollmentNo}, data, {
    new: true,
    runValidators: true,
  });
  await Job.updateOne({job_id}, job, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
  });
})
const catchAsync = require('./catchAsync');
const authController = require('./authController');
const Job = require('../models/jobModel');
const Student = require('../models/studentModel');

const filter = (job, query) => {
  if (job.company.includes(query) || job.job_id.includes(query) || job.package === query
    || job.job_desc.includes(query) || job.requirements.includes(query)) {
      return true;
  }
  return false;
}

exports.getSpecificJob = catchAsync(async (req, res, next) => {
  const query = {};
  const isAdmin = await authController.isAdmin(req.headers.authorization);
  if (!isAdmin) {
    query['applied'] = 0;
  }
  const jobs = await Job.findOne({job_id: req.params.id}, query);
    res.status(200).json({
      status: 'success',
      data: jobs,
    });
});
exports.getJobsWithID = catchAsync(async (req, res, next) => {
  const data = await Student.findById(req.body.id);
  console.log(data);
  if (!data) {
    return next(new apiError('Invalid Enrollment No', 403));
  }
  res.status(200).json({
      status: 'success',
      data,
    });
});

exports.addJob = (catchAsync(async (req, res, next) => {
  const jobs = await Job.create(req.body);
  res.status(200).json({
    status: 'success',
    data: jobs,
  });
}));

exports.getAllJobs = catchAsync(async (req, res, next) => {
  const query = {};
  const isAdmin = await authController.isAdmin(req.headers.authorization);
  if (!isAdmin) {
    query['applied'] = 0;
  }
  const jobs = await Job.find({}, query);
  res.status(200).json({
    status: 'success',
    length: jobs.length,
    data: jobs,
  });
});

exports.getJobs = catchAsync(async (req, res, next) => {
  const query1 = {};
  const isAdmin = await authController.isAdmin(req.headers.authorization);
  if (!isAdmin) {
    query1['applied'] = 0;
  }
  const query = req.params.query;
  const jobs = await Job.find({}, query1);
  const final_jobs = [];
  jobs.forEach((element) => {
    if (filter(element, query)) {
      final_jobs.push(element);
    }
  })
  res.status(200).json({
    status: 'success',
    length: final_jobs.length,
    data: final_jobs,
  });
});

exports.filterSCGPA = catchAsync(async (req, res, next) => {
  const query = {};
  const isAdmin = await authController.isAdmin(req.headers.authorization);
  if (!isAdmin) {
    query['applied'] = 0;
  }
  const jobs = await Job.find({scgpa_req: {$lte: req.params.id}}, query);
  res.status(200).json({
    status: 'success',
    length: jobs.length,
    data: jobs,
  });
})

exports.updateJob = catchAsync(async (req, res, next) => {
  const data = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data,
  });
})
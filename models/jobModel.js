const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  enrollment_no: String,
  name: String,
  status: String
})

const jobSchema = new mongoose.Schema({
  job_id: {
    type: String,
    unique: [true, 'jobid should be unique'],
    required: [true, 'jobid should be present'],
  },
  company: {
    type: String,
    required: [true, 'company name should be present'],
  },
  package: {
    type: Number,
    required: [true, 'package must be present'],
  },
  job_desc: {
    type: String,
    required: [true, 'job description should be present'],
  },
  requirements: {
    type: String,
    required: [true, 'student requirements should be present'],
  },
  scgpa_req: {
    type: Number,
    required: [true, 'min scgpa allowed should be present'],
    max: 10
  },
  batch: {
    type: [Number],
    required: [true, 'batches who are eligible to register in the job'],
  },
  applied: {
    type: [studentSchema]
  }
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;

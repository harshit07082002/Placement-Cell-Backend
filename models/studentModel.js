const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const companiesSchema = new mongoose.Schema({
  name: String,
  jobid: String,
  status: String,
  ctc: Number
})

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'user must add their name'],
  },
  email: {
    type: String,
    required: [true, 'user must add their email Address'],
    unique: [true, 'email should be unique'],
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  enrollmentNo: {
    type: String,
    required: [true, 'user must add their enrollment no'],
    unique: [true, 'enrollmentNo should be unique']
  },
  phone: {
    type: Number,
    required: [true, 'user must add their phone no'],
    maxlength: 10,
    minlength: 10,
    unique: [true, 'phone no should be unique']
  },
  resumeURL: {
    type: String,
    required: [true, 'user must add their resume URL'],
    validate: [validator.isURL, 'Please enter a valid URL']
  },
  scgpa: {
    type: Number,
    required: [true, 'user must add their current scgpa'],
    max: 10
  },
  semester: {
    type: Number,
    required: [true, 'user must add their semester in which they are in'],
    max: 8
  },
  batch: {
    type: Number,
    required: [true, 'user must add their year in which they are graduating in'],
  },
  course: {
    type: String,
    required: [true, 'user must add their course in which they are enrolled in']
  },
  password: {
    type: String,
    required: [true, 'Add password'],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'add confirm password'],
    validate: {
      validator: function () {
        if (this.password === this.confirmPassword) return true;
        return false;
      },
      message: 'Password and ConfirmPassword does not match',
    },
  },
  companies: {
    type: [companiesSchema],
  },
  passwordChangedDate: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

studentSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
  }
});

studentSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  } else {
    this.passwordChangedDate = Date.now() - 1000;
    next();
  }
});

studentSchema.methods.checkPassword = async function (userPass, realPass) {
  return await bcrypt.compare(userPass, realPass);
};

studentSchema.methods.checkPasswordChange = function (tokenTime) {
  if (this.passwordChangedDate) {
    const time = parseInt(this.passwordChangedDate.getTime() / 1000, 10);
    return tokenTime < time;
  }
  return false;
};

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
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
  phone: {
    type: Number,
    required: [true, 'user must add their phone number'],
    maxlength: 10,
    minlength: 10,
    unique: [true, 'phone no should be unique']
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
  passwordChangedDate: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

adminSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
  }
});

adminSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  } else {
    this.passwordChangedDate = Date.now() - 1000;
    next();
  }
});

adminSchema.methods.checkPassword = async function (userPass, realPass) {
  return await bcrypt.compare(userPass, realPass);
};

adminSchema.methods.checkPasswordChange = function (tokenTime) {
  if (this.passwordChangedDate) {
    const time = parseInt(this.passwordChangedDate.getTime() / 1000, 10);
    return tokenTime < time;
  }
  return false;
};

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;

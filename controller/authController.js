const catchAsync = require('./catchAsync');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const apiError = require('../utils/apiError');
const { promisify } = require('util');
const Student = require('../models/studentModel');

//Sign jwt

const signJWT = (id, res, req) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: req.secure || req.headers['x-forwarded-proto'] === 'http',
  });

  return token;
};

exports.signup = catchAsync(async (req, res, next) => {
  let user;
  if (req.originalUrl.includes('admin')) {
    user = await Admin.create(req.body);
  } else {
    user = await Student.create(req.body);
  }
  res.status(200).json({
    status: 'success',
    data: {
      token: signJWT(user._id, res, req),
    },
  });
});

exports.signin = catchAsync(async (req, res, next) => {
  if (!req.body.email || !req.body.password)
    return next(new apiError('no email or password', 404));
  
  let user;
  if (req.originalUrl.includes('admin')) {
    user = await Admin.findOne({ email: req.body.email }).select(
      '+password active'
    );
  } else {
    user = await Student.findOne({ email: req.body.email }).select(
      '+password active'
    );
  }
  if (user == undefined || user.active == false)
    return next(new apiError('No Account found', 404));

  // Check the Password

  if (!(await user.checkPassword(req.body.password, user.password)))
    return next(new apiError('Wrong password', 400));

  // Send the response

  res.status(200).json({
    status: 'success',
    token: signJWT(user._id, res, req),
  });
});

exports.restricTo = catchAsync(async (req, res, next) => {
  //Check if token is present or not

  if (!req.headers.authorization)
    return next(new apiError('Not login please login', 403));

  const token = req.headers.authorization.split(' ')[1];
  if (!token || token == null || token == '')
    return next(new apiError('Not login please login', 403));

  //Check if token is valid or not

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  let user;
  user = await Admin.findById(decode.id).select('+role');

  if (!user) {
    return next(new apiError('Invalid Token', 404));
  }

  //Check if user has changed the password or not

  if (user.checkPasswordChange(decode.iat))
    return next(new apiError('Password Changed Login Again', 400));

  // Send the response

  req.user = user;
  return next();
});

exports.changePassword = catchAsync(async (req, res, next) => {
  if (
    !req.body.password ||
    !req.body.confirmPassword ||
    !req.body.currentPassword
  ) {
    return next(new apiError('Please enter the full details', 400));
  }

  if (!req.headers.authorization)
    return next(new apiError('Not login please login', 403));

  const token = req.headers.authorization.split(' ')[1];

  if (!token) return next(new apiError('Not login please login', 403));

  //Check if token is valid or not

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  let user;
  if (req.originalUrl.includes('admin')) {
    user = await Admin.findById(decode.id).select('+password');
  } else {
    user = await Student.findById(decode.id).select('+password');
  }

  if (!user) {
    return next(new apiError('Invalid Token', 404));
  }

  if (!(await user.checkPassword(req.body.currentPassword, user.password)))
    return next(new apiError('Wrong password!!', 400));

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  res.status(200).json({
    status: 'success',
    token: signJWT(user._id, res, req),
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  if (!req.params.token) return next(new apiError('No token!!', 403));

  const token = req.params.token;

  if (!token) return next(new apiError('Not Token', 403));

  //Check if token is valid or not

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  let user;
  if (req.originalUrl.includes('admin')) {
    user = await Admin.findById(decode.id).select('+password');
  } else {
    user = await Student.findById(decode.id).select('+password');
  }

  if (!user) {
    return next(new apiError('Invalid Token', 404));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  res.status(200).json({
    status: 'success',
    token: signJWT(user._id, res, req),
  });
});


exports.checkLogin = catchAsync(async (req, res, next) => {
  //Check if token is present or not

  if (!req.headers.authorization)
    return next(new apiError('Not login please login', 403));

  const token = req.headers.authorization.split(' ')[1];
  if (!token || token == null || token == '')
    return next(new apiError('Not login please login', 403));

  //Check if token is valid or not

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  let user1, user2;
  user1 = await Admin.findById(decode.id).select('+role');
  user2 = await Student.findById(decode.id).select('+role');

  let user = user1 ?? user2;

  if (!user) {
    return next(new apiError('Invalid Token', 404));
  }

  //Check if user has changed the password or not

  if (user.checkPasswordChange(decode.iat))
    return next(new apiError('Password Changed Login Again', 400));

  // Send the response

  req.user = user;
  return next();
});

exports.logout = (req, res, next) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 10000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};

exports.isAdmin = async (auth) => {

  if (!auth)
    return false;

  const token = auth.split(' ')[1];
  if (!token || token == null || token == '')
    return false;

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  let user;
  user = await Admin.findById(decode.id).select('+role');

  if (!user) {
    return false;
  }
  return true;
};
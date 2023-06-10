const apiError = require('../utils/apiError');

const CastError = (err) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new apiError(message, 400);
};
const codeError = (err) => {
  console.log('inside');
  const message = `duplicate value found of ${
    err.message.match(/(["'])(\\?.)*?\1/)[0]
  }`;
  return new apiError(message, 400);
};
const ValidationError = (error) => {
  const er = Object.values(error.errors).map((el) => el.message);
  return new apiError(er.join(' , '), 400);
};

const jwtError = (error) => {
  return new apiError('Invalid token!!', 400);
};
const tokenExpire = (error) => {
  return new apiError('Your token has been expired please login again..', 400);
};
const errDev = (res, error, req) => {
  const status = error.statusCode || 404;
  const message = error.message;
  const s = error.status || 'error';

  if (req.originalUrl.startsWith('/api')) {
    return res.status(status).json({
      status: s,
      message,
      error,
      stack: error.stack,
    });
  }

  return res.status(status).render('error', {
    title: 'Something went wrong',
    msg: message,
  });
};

const errProd = (res, error, req) => {
  if (req.originalUrl.startsWith('/api')) {
    if (error.isOperational) {
      const status = error.statusCode || 404;
      const message = error.message;
      const s = error.status || 'error';
      return res.status(status).json({
        status: s,
        message,
      });
    } else {
      return res.status(500).json({
        status: 'fail',
        error: 'something went wrong',
      });
    }
  }
  if (error.isOperational) {
    const status = error.statusCode || 404;
    const message = error.message;
    const s = error.status || 'error';
    return res.status(status).render('error', {
      title: 'Something went wrong',
      msg: message,
    });
  }
  return res.status(status).render('error', {
    title: 'Something went wrong',
    msg: 'Something went wrong',
  });
};

module.exports = (error, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('in dev');
    errDev(res, error, req);
  } else if (process.env.NODE_ENV === 'production') {
    console.log('in prod');
    if (error.name === 'CastError') {
      error = CastError(error);
    }
    if (error.name == 'ValidationError') {
      error = ValidationError(error);
    }
    if (error.code == '11000') error = codeError(error);
    if (error.name === 'JsonWebTokenError') error = jwtError(error);
    if (error.name === 'TokenExpiredError') error = tokenExpire(error);

    errProd(res, error, req);
  }
};

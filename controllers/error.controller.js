const AppError = require('../utils/appError');

const handleCastError22P02 = err => {
  const message = 'some type of data send does not match was expected';
  return new AppError(message, 400);
};

const handleJWTExpiredError = () =>
  AppError('your token has expired please login again', 401);

const handleJWTError = () =>
  new AppError('invalid token. please login again', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //operational, trusted error : send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //programming or other unknow error : dont leak error details
    console.error('ERROR ❌', err);
    res.status(500).json({
      status: 'fail',
      message: 'something went very wrong',
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (error.parent?.code === '22P02') {
      error = err;
    }

    if (error.parent?.code === '22P02') error = handleCastError22P02(error);

    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);

    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);

    sendErrorProd(err.res);
  }
};
module.exports = globalErrorHandler;

const CustomError = require('../error/custom-error.handler');

//  GLOBAL ERROR HANDLER MIDDLEWARE
// Bu middleware barcha controllerlardagi xatolarni ushlaydi

const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // MongoDB - Noto'g'ri ObjectId
  if (err.name === 'CastError') {
    const message = `${err.path} maydoni uchun noto'g'ri qiymat: ${err.value}`;
    error = new CustomError(message, 400);
  }

  // MongoDB - Duplicate key (unique field)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `'${value}' - bu ${field} allaqachon mavjud`;
    error = new CustomError(message, 409);
  }

  // MongoDB - Validation xatosi (schema darajasida)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'MongoDB Validatsiya xatosi',
      errors: messages,
    });
  }

  // JWT - Noto'g'ri token
  if (err.name === 'JsonWebTokenError') {
    error = new CustomError('Token noto\'g\'ri', 401);
  }

  // JWT - Token muddati o'tgan
  if (err.name === 'TokenExpiredError') {
    error = new CustomError('Token muddati tugagan, qayta kiring', 401);
  }

  // Development da to'liq xato ko'rsatish
  if (process.env.NODE_ENV === 'development') {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      stack: err.stack,
      error: err,
    });
  }

  // Production da faqat xabar
  res.status(error.statusCode).json({
    success: false,
    message: error.isOperational ? error.message : 'Server xatosi yuz berdi',
  });
};

module.exports = errorMiddleware;

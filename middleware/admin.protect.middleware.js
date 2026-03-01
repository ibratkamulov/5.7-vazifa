const CustomError =
require('../error/custom-error.handler');

const adminProtect = (req, res, next) => {

  if (!req.user || req.user.role !== 'admin') {
    return next(
      new CustomError(
        'Faqat admin ruxsatiga ega',
        403
      )
    );
  }

  next();
};

module.exports = { adminProtect };
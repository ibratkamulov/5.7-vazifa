//  BOOK VALIDATOR MIDDLEWARE
// Query parametrlarini ham tekshirish uchun kengaytirilgan validate

const Joi = require('joi');

// Query params uchun validation (filterlash, sahifalash)
const bookQueryValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  genre: Joi.string()
    .valid('roman', 'hikoya', 'she\'r', 'ilmiy', 'fantastika', 'detektiv', 'boshqa')
    .optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  search: Joi.string().max(100).optional(),
  sortBy: Joi.string().valid('price', 'title', 'publishedYear', 'rating', 'createdAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

// Body va query ni tekshirish
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, ''),
      }));

      return res.status(400).json({
        success: false,
        message: 'Query parametrlar xatosi',
        errors,
      });
    }

    req.query = value;
    next();
  };
};

module.exports = { validateQuery, bookQueryValidation };

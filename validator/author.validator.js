const Joi = require('joi');

// ✅ JOI VALIDATION - Author

const createAuthorValidation = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Muallif ismi kamida 2 ta belgi',
      'string.max': 'Muallif ismi 100 ta belgidan oshmasin',
      'any.required': 'Muallif ismi majburiy',
    }),

  bio: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Bio 500 ta belgidan oshmasin',
    }),

  birthYear: Joi.number()
    .integer()
    .min(1000)
    .max(new Date().getFullYear())
    .optional()
    .messages({
      'number.min': 'Tug\'ilgan yil 1000 dan katta bo\'lishi kerak',
      'number.max': 'Tug\'ilgan yil kelajakda bo\'lishi mumkin emas',
    }),

  nationality: Joi.string()
    .max(50)
    .optional()
    .allow(''),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .optional()
    .allow('')
    .messages({
      'string.email': 'Email noto\'g\'ri formatda',
    }),
});

const updateAuthorValidation = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  bio: Joi.string().max(500).optional().allow(''),
  birthYear: Joi.number().integer().min(1000).max(new Date().getFullYear()).optional(),
  nationality: Joi.string().max(50).optional().allow(''),
  email: Joi.string().email({ tlds: { allow: false } }).lowercase().optional().allow(''),
  isActive: Joi.boolean().optional(),
}).min(1).messages({
  'object.min': 'Kamida bitta maydon o\'zgartirilishi kerak',
});

module.exports = { createAuthorValidation, updateAuthorValidation };

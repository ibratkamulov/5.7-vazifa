const Joi = require('joi');

// ✅ JOI VALIDATION - Book

const createBookValidation = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .required()
    .messages({
      'any.required': 'Kitob nomi majburiy',
      'string.empty': 'Kitob nomi bo\'sh bo\'lmasin',
    }),

  author: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Muallif ID si noto\'g\'ri formatda (MongoDB ObjectId bo\'lishi kerak)',
      'any.required': 'Muallif majburiy',
    }),

  isbn: Joi.string()
    .pattern(/^(?:\d{10}|\d{13})$/)
    .optional()
    .messages({
      'string.pattern.base': 'ISBN 10 yoki 13 raqamdan iborat bo\'lishi kerak',
    }),

  genre: Joi.string()
    .valid('roman', 'hikoya', 'she\'r', 'ilmiy', 'fantastika', 'detektiv', 'boshqa')
    .required()
    .messages({
      'any.only': 'Janr: roman, hikoya, she\'r, ilmiy, fantastika, detektiv, boshqa',
      'any.required': 'Janr majburiy',
    }),

  publishedYear: Joi.number()
    .integer()
    .min(1000)
    .max(new Date().getFullYear() + 1)
    .optional()
    .messages({
      'number.min': 'Nashr yili noto\'g\'ri',
    }),

  pages: Joi.number()
    .integer()
    .min(1)
    .optional()
    .messages({
      'number.min': 'Sahifalar soni 1 dan katta bo\'lishi kerak',
    }),

  price: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.min': 'Narx manfiy bo\'lishi mumkin emas',
      'any.required': 'Narx majburiy',
    }),

  stock: Joi.number().integer().min(0).optional().default(0),

  description: Joi.string().max(1000).optional().allow(''),

  rating: Joi.number().min(0).max(5).optional().default(0),
});

const updateBookValidation = Joi.object({
  title: Joi.string().min(1).max(200).optional(),
  author: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  isbn: Joi.string().pattern(/^(?:\d{10}|\d{13})$/).optional(),
  genre: Joi.string().valid('roman', 'hikoya', 'she\'r', 'ilmiy', 'fantastika', 'detektiv', 'boshqa').optional(),
  publishedYear: Joi.number().integer().min(1000).max(new Date().getFullYear() + 1).optional(),
  pages: Joi.number().integer().min(1).optional(),
  price: Joi.number().min(0).optional(),
  stock: Joi.number().integer().min(0).optional(),
  description: Joi.string().max(1000).optional().allow(''),
  isAvailable: Joi.boolean().optional(),
  rating: Joi.number().min(0).max(5).optional(),
}).min(1).messages({
  'object.min': 'Kamida bitta maydon o\'zgartirilishi kerak',
});

module.exports = { createBookValidation, updateBookValidation };

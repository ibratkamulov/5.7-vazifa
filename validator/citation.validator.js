const Joi = require("joi");

const citationCreateValidator = Joi.object({
  book: Joi.string().hex().length(24).required(),

  text: Joi.string().min(5).max(1000).required(),
});


const citationUpdateValidator = Joi.object({
  book: Joi.string().hex().length(24),

  text: Joi.string().min(5).max(1000),
});
module.exports = { citationCreateValidator, citationUpdateValidator };

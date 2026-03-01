const { citationCreateValidator, citationUpdateValidator } = require("../validator/citation.validator");

const validateCitationCreate = (req, res, next) => {
  const { error } = citationCreateValidator.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({ message: messages });
  }
  next();
};

const validateCitationUpdate = (req, res, next) => {
  const { error } = citationUpdateValidator.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({ message: messages });
  }
  next();
};

module.exports = { validateCitationCreate, validateCitationUpdate };

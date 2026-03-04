const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const validateUpdateProfile = [
  body("firstName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be 2-50 characters"),

  body("lastName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be 2-50 characters"),

  body("phone")
    .optional()
    .matches(/^\+?[1-9]\d{7,14}$/)
    .withMessage("Please enter a valid phone number"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Please enter a valid email address"),

  handleValidationErrors,
];

const validateChangePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your new password"),

  handleValidationErrors,
];

const validateSettings = [
  body("language")
    .optional()
    .isIn(["English", "Russian", "Uzbek"])
    .withMessage("Invalid language selection"),

  body("theme").optional().isBoolean().withMessage("Theme must be boolean"),

  handleValidationErrors,
];

module.exports = {
  validateUpdateProfile,
  validateChangePassword,
  validateSettings,
};

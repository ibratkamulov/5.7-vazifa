const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  updateSettings,
  updateAvatar,
} = require("../controller/profile.controller");

const {
  validateUpdateProfile,
  validateChangePassword,
  validateSettings,
} = require("../middleware/profile.validator.middleware");

const { authProtect } = require("../middleware/auth.protect.middleware");
const upload = require("../middleware/upload");

// All routes are protected
router.use(authProtect);

// GET    /api/profile/me          - Get current user profile
router.get("/me", getProfile);

// PUT    /api/profile/update      - Update profile (My account tab)
router.put("/update", validateUpdateProfile, updateProfile);

// PUT    /api/profile/change-password  - Change password (Security tab)
router.put("/change-password", validateChangePassword, changePassword);

// PUT    /api/profile/settings    - Update settings (Settings tab)
router.put("/settings", validateSettings, updateSettings);

// PUT    /api/profile/avatar      - Upload/update avatar
router.put("/avatar", upload.single("avatar"), updateAvatar);

module.exports = router;

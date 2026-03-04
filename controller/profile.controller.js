const Profile = require("../schema/profile.schema");
const bcrypt = require("bcrypt");
const CustomError = require("../error/custom-error.handler");
const path = require("path");
const fs = require("fs");

// GET /api/profile/me
const getProfile = async (req, res, next) => {
  try {
    const user = await Profile.findById(req.user.id).select("-password");
    if (!user) throw new CustomError("User not found", 404);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/profile/update
const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, email } = req.body;

    const updated = await Profile.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, phone, email },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/profile/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      throw new CustomError("New passwords do not match", 400);
    }

    const user = await Profile.findById(req.user.id);
    if (!user) throw new CustomError("User not found", 404);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new CustomError("Current password is incorrect", 400);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/profile/settings
const updateSettings = async (req, res, next) => {
  try {
    const { language, theme } = req.body;

    const updated = await Profile.findByIdAndUpdate(
      req.user.id,
      { language, theme },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/profile/avatar
const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) throw new CustomError("No file uploaded", 400);

    const user = await Profile.findById(req.user.id);
    if (!user) throw new CustomError("User not found", 404);

    // Delete old avatar if exists
    if (user.avatar) {
      const oldPath = path.join(__dirname, "..", user.avatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    const updated = await Profile.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarPath },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  updateSettings,
  updateAvatar,
};

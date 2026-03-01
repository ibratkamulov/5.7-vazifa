const express = require("express");
const router = express.Router();

// controllers
const {
  getAllCitations,
  getCitationById,
  getCitationByBook,
  createCitation,
  updateCitation,
  deleteCitation,
} = require("../controller/citation.controller");

// validators
const {
  validateCitationCreate,
  validateCitationUpdate,
} = require("../middleware/citation.validator.middleware");

// middlewares
const { protect } =
require("../middleware/auth.protect.middleware");

const { adminProtect } =
require("../middleware/admin.protect.middleware");


// ===== PUBLIC =====
router.get("/", getAllCitations);
router.get("/book/:bookId", getCitationByBook);
router.get("/:id", getCitationById);


// ===== ADMIN ONLY =====
router.post(
  "/",
  protect,
  adminProtect,
  validateCitationCreate,
  createCitation
);

router.put(
  "/:id",
  protect,
  adminProtect,
  validateCitationUpdate,
  updateCitation
);

router.delete(
  "/:id",
  protect,
  adminProtect,
  deleteCitation
);

module.exports = router;
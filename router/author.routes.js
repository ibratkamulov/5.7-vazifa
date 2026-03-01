const express = require('express');
const router = express.Router();

// Controllers
const {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require('../controller/author.controller');

// Middlewares
const validate = require('../middleware/author.validator.middleware');
const { protect, authorize } = require('../middleware/auth.protect.middleware');

// JOI Validators
const { createAuthorValidation, updateAuthorValidation } = require('../validator/author.validator');

// GET /api/authors
router.get('/', getAllAuthors);

// GET /api/authors/:id
router.get('/:id', getAuthorById);

// POST /api/authors (faqat admin)
// protect → foydalanuvchi tizimga kirganmi?
// authorize('admin') → admin rolimi?
// validate(createAuthorValidation) → JOI tekshiruvi
// createAuthor → Controller (MongoDB validation ham ishlaydi)
router.post(
  '/',
  protect,
  authorize('admin'),
  validate(createAuthorValidation),
  createAuthor
);

// PUT /api/authors/:id (faqat admin)
router.put(
  '/:id',
  protect,
  authorize('admin'),
  validate(updateAuthorValidation),
  updateAuthor
);

// DELETE /api/authors/:id (faqat admin)
router.delete('/:id', protect, authorize('admin'), deleteAuthor);

module.exports = router;

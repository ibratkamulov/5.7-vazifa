const express = require('express');
const router = express.Router();

// Controllers
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  uploadFileBook
} = require('../controller/book.controller');

// Middlewares
const validate = require('../middleware/author.validator.middleware');
const { validateQuery, bookQueryValidation } = require('../middleware/book.validator.middleware');
const { protect, authorize } = require('../middleware/auth.protect.middleware');

// JOI Validators
const { createBookValidation, updateBookValidation } = require('../validator/book.validator');

// Upload
const { upload } = require('../middleware/upload');

// Audio stream
const { stream } = require('../controller/audio.controller');


// GET /api/books?page=1&limit=10&genre=roman&minPrice=5000
router.get('/', validateQuery(bookQueryValidation), getAllBooks);

// GET /api/books/:id
router.get('/:id', getBookById);

// POST /api/books (faqat admin)
router.post(
  '/',
  protect,
  authorize('admin'),
  validate(createBookValidation),
  createBook
);

// PUT /api/books/:id (faqat admin)
router.put(
  '/:id',
  protect,
  authorize('admin'),
  validate(updateBookValidation),
  updateBook
);

// Audio upload
router.post('/:bookId/audio', upload.single('audio'), uploadFileBook);

// Audio stream
router.get('/:bookId/audio', stream);

// DELETE /api/books/:id (faqat admin)
router.delete('/:id', protect, authorize('admin'), deleteBook);

module.exports = router;
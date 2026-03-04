const mongoose = require('mongoose');

// ✅ MONGODB SCHEMA VALIDATION - Book
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Kitob nomi majburiy'],
      trim: true,
      minlength: [1, 'Kitob nomi bo\'sh bo\'lmasligi kerak'],
      maxlength: [200, 'Kitob nomi 200 ta belgidan oshmasin'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
      required: [true, 'Muallif majburiy'],
    },
    isbn: {
      type: String,
      unique: true,
      trim: true,
      match: [/^(?:\d{10}|\d{13})$/, 'ISBN 10 yoki 13 raqamdan iborat bo\'lishi kerak'],
    },
    genre: {
      type: String,
      required: [true, 'Janr majburiy'],
      enum: {
        values: ['roman', 'hikoya', 'she\'r', 'ilmiy', 'fantastika', 'detektiv', 'boshqa'],
        message: 'Bunday janr mavjud emas',
      },
    },
    audioUrl: {
      type: String,
      required: false,
      
    },
    publishedYear: {
      type: Number,
      min: [1000, 'Nashr yili 1000 dan katta bo\'lishi kerak'],
      max: [new Date().getFullYear() + 1, 'Nashr yili noto\'g\'ri'],
    },
    pages: {
      type: Number,
      min: [1, 'Sahifalar soni 1 dan katta bo\'lishi kerak'],
    },
    price: {
      type: Number,
      required: [true, 'Narx majburiy'],
      min: [0, 'Narx manfiy bo\'lishi mumkin emas'],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Ombordagi miqdor manfiy bo\'lishi mumkin emas'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Tavsif 1000 ta belgidan oshmasin'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Reyting 0 dan kichik bo\'lishi mumkin emas'],
      max: [5, 'Reyting 5 dan katta bo\'lishi mumkin emas'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index
bookSchema.index({ title: 'text', description: 'text' });
bookSchema.index({ genre: 1, price: 1 });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

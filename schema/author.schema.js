const mongoose = require('mongoose');

// ✅ MONGODB SCHEMA VALIDATION - Author
const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Muallif ismi majburiy'],
      trim: true,
      minlength: [2, 'Ism kamida 2 ta belgi'],
      maxlength: [100, 'Ism 100 ta belgidan oshmasin'],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio 500 ta belgidan oshmasin'],
    },
    birthYear: {
      type: Number,
      min: [1000, 'Tug\'ilgan yil 1000 dan katta bo\'lishi kerak'],
      max: [new Date().getFullYear(), 'Tug\'ilgan yil kelajakda bo\'lishi mumkin emas'],
    },
    nationality: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // null qiymatlar uchun unique tekshirilmaydi
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Email noto\'g\'ri formatda'],
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field - kitoblar soni
authorSchema.virtual('bookCount').get(function () {
  return this.books ? this.books.length : 0;
});

// Index qo'shish (qidirish tezligi uchun)
authorSchema.index({ name: 'text' });

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;

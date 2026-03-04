const Book = require('../schema/book.schema');
const Author = require('../schema/author.schema');
const CustomError = require('../error/custom-error.handler');
const path = require('path');
const fs = require('fs');

//  BARCHA KITOBLARNI OLISH (filterlash va sahifalash bilan)
const getAllBooks = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      genre,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Filter yaratish
    const filter = {};
    if (genre) filter.genre = genre;
    if (search) filter.$text = { $search: search };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [books, total] = await Promise.all([
      Book.find(filter)
        .populate('author', 'name nationality')
        .skip(skip)
        .limit(Number(limit))
        .sort(sortOptions),
      Book.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

//  BITTA KITOB
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('author');

    if (!book) {
      return next(new CustomError('Kitob topilmadi', 404));
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

//  KITOB YARATISH
const createBook = async (req, res, next) => {
  try {
    // Muallif mavjudligini tekshirish
    const author = await Author.findById(req.body.author);
    if (!author) {
      return next(new CustomError('Ko\'rsatilgan muallif topilmadi', 404));
    }

    //  MongoDB schema validation ishlaydi
    const book = await Book.create(req.body);

    // Muallifning kitoblar ro'yxatiga qo'shish
    await Author.findByIdAndUpdate(
      req.body.author,
      { $push: { books: book._id } }
    );

    res.status(201).json({
      success: true,
      message: 'Kitob muvaffaqiyatli yaratildi',
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

//  KITOB YANGILASH
const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true, // MongoDB schema validationni ishlatadi
      }
    ).populate('author', 'name');

    if (!book) {
      return next(new CustomError('Kitob topilmadi', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Kitob yangilandi',
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

//  KITOB O'CHIRISH
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return next(new CustomError('Kitob topilmadi', 404));
    }

    // Muallifdan ham o'chirish
    await Author.findByIdAndUpdate(
      book.author,
      { $pull: { books: book._id } }
    );

    res.status(200).json({
      success: true,
      message: 'Kitob o\'chirildi',
    });
  } catch (error) {
    next(error);
  }
};

const uploadFileBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const foundedBook = await Book.findById(bookId);
    if (!foundedBook) {
      return res.status(404).json({ message: 'Kitob topilmadi' });
    }

    if (foundedBook.audioUrl) {
      const fileUrl = path.join(__dirname, '..', foundedBook.audioUrl);
      if (fs.existsSync(fileUrl)) {
        fs.unlinkSync(fileUrl);
      }
      }
      const changer = req.file.path.replace(/\\/g, '/');
      foundedBook.audioUrl = changer;
      await foundedBook.save();
      return res.status(200).json({
        success: true,
        message: 'Audio fayl muvaffaqiyatli yangilandi',
        data: { audioUrl: changer },
      });
    }
   catch (error) {
    next(error);
  }
};


module.exports = { getAllBooks, 
  getBookById, 
  createBook, 
  updateBook, 
  deleteBook, uploadFileBook, };

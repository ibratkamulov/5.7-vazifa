const Author = require('../schema/author.schema');
const CustomError = require('../error/custom-error.handler');


const getAllAuthors = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, isActive } = req.query;

    const filter = {};
    if (search) filter.$text = { $search: search };
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const skip = (page - 1) * limit;

    const [authors, total] = await Promise.all([
      Author.find(filter)
        .populate('books', 'title genre price')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      Author.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: authors,
    });
  } catch (error) {
    next(error);
  }
};


const getAuthorById = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id).populate('books');

    if (!author) {
      return next(new CustomError('Muallif topilmadi', 404));
    }

    res.status(200).json({
      success: true,
      data: author,
    });
  } catch (error) {
    next(error);
  }
};

// MUALLIF YARATISH
// JOI Middleware allaqachon tekshirgan (1-qatlam)
// MongoDB schema ham tekshiradi (2-qatlam)
const createAuthor = async (req, res, next) => {
  try {
    const author = await Author.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Muallif muvaffaqiyatli yaratildi',
      data: author,
    });
  } catch (error) {
    next(error); // Duplicate email → error middleware ushlaydi
  }
};

// MUALLIF YANGILASH
const updateAuthor = async (req, res, next) => {
  try {
    const author = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,           // Yangilangan hujjatni qaytaradi
        runValidators: true, // MongoDB schema validationni ishga tushiradi
      }
    );

    if (!author) {
      return next(new CustomError('Muallif topilmadi', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Muallif yangilandi',
      data: author,
    });
  } catch (error) {
    next(error);
  }
};

//  MUALLIF O'CHIRISH
const deleteAuthor = async (req, res, next) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);

    if (!author) {
      return next(new CustomError('Muallif topilmadi', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Muallif o\'chirildi',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };

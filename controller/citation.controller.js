const Citation = require("../schema/citation.schema");
const Book = require("../schema/book.schema");

// CREATE
const createCitation = async (req, res, next) => {
  try {

    const exists = await Citation.findOne({
      book: req.body.book
    });

    if (exists) {
      return res.status(400).json({
        message: "Bu kitobda iqtibos mavjud"
      });
    }

    const citation =
      await Citation.create(req.body);

    res.status(201).json({
      success: true,
      data: citation
    });

  } catch (err) {
    next(err);
  }
};

// GET ALL
const getAllCitations = async (req, res) => {
  const citations = await Citation.find()
    .populate({
      path: "book",
      populate: { path: "author" }
    });

  res.json(citations);
};

// GET BY ID
const getCitationById = async (req, res) => {

  const citation = await Citation.findById(req.params.id)
    .populate({
      path: "book",
      populate: { path: "author" }
    });

  if (!citation) {
    return res.status(404).json({
      message: "Iqtibos topilmadi"
    });
  }

  res.json(citation);
};

// UPDATE
const updateCitation = async (req, res) => {
  const citation =
    await Citation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

  res.json(citation);
};

// DELETE
const deleteCitation = async (req, res) => {
  await Citation.findByIdAndDelete(req.params.id);

  res.json({
    message: "Iqtibos o'chirildi"
  });
};

// GET BY BOOK
const getCitationByBook = async (req, res) => {

  const citation = await Citation.findOne({
    book: req.params.bookId
  }).populate({
    path: "book",
    populate: { path: "author" }
  });

  if (!citation) {
    return res.status(404).json({
      message: "Iqtibos topilmadi"
    });
  }

  res.json(citation);
};

module.exports = {
  getAllCitations,
  getCitationById,
  getCitationByBook,
  createCitation,
  updateCitation,
  deleteCitation
};
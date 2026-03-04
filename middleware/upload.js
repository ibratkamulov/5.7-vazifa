const multer = require('multer');
const fs = require('fs');
const path = require('path');

// storage
const audioStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/audio';

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// file filter
const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/flac',
    'audio/aac',
    'audio/webm',
    'audio/opus'
  ];

  const isAllowed = allowedTypes.includes(file.mimetype);

  if (isAllowed) {
    cb(null, true);
  } else {
    cb(new Error('Faqat audio fayllar ruxsat etiladi'), false);
  }
};

// multer instance
const upload = multer({
  storage: audioStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: fileFilter
});

module.exports = { upload };
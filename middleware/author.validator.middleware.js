//  JOI VALIDATOR MIDDLEWARE
// Bu middleware JOI schema orqali request body ni tekshiradi
// Router da ishlatiladi: router.post('/register', validate(registerValidation), controller)

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,    // Barcha xatolarni birdan ko'rsatadi (true bo'lsa birinchi xatoda to'xtaydi)
      allowUnknown: false,  // Noma'lum maydonlarga ruxsat bermaydi
      stripUnknown: true,   // Noma'lum maydonlarni o'chirib tashlaydi
    });

    if (error) {
      // Barcha xato xabarlarini array sifatida qaytarish
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, ''),
      }));

      return res.status(400).json({
        success: false,
        message: 'Validatsiya xatosi',
        errors,
      });
    }

    // Tozalangan qiymatni req.body ga yozish
    req.body = value;
    next();
  };
};

module.exports = validate;

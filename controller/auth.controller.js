const CustomErrorhandler = require('../error/custom-error.handler');
const AuthSchema = require('../schema/auth.schema');
const sendMessage = require('../utils/send-email');
const bcrypt = require('bcryptjs');
const { registerValidation } =
  require('../validator/auth.validator');


const register = async (req, res, next) => {
  try {

    // ✅ JOI VALIDATION
    const { error } =
      registerValidation.validate(req.body);

    if (error) {
      throw CustomErrorhandler.BadRequest(
        error.details[0].message
      );
    }

    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    const foundedUser =
      await AuthSchema.findOne({ email: normalizedEmail });

    // USER BOR LEKIN VERIFY BO'LMAGAN
    if (foundedUser && !foundedUser.verified) {

      const code = Array.from(
        { length: 6 },
        () => Math.floor(Math.random() * 10)
      ).join('');

      foundedUser.otp = code;
      foundedUser.otptime =
        new Date(Date.now() + 600000);

      await foundedUser.save();

      await sendMessage(name, code, email);

      return res.status(200).json({
        message: "Yangi OTP yuborildi"
      });
    }

    // USER ALLAQACHON VERIFIED
    if (foundedUser) {
      throw CustomErrorhandler.BadRequest(
        'Bu email allaqachon royxatdan otgan'
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 12);

    const code = Array.from(
      { length: 6 },
      () => Math.floor(Math.random() * 10)
    ).join('');

    await sendMessage(name, code, email);

    await AuthSchema.create({
      name,
      email,
      password: hashedPassword,
      otp: code,
      otptime: new Date(Date.now() + 120000)
    });

    res.status(200).json({
      message:
        "Ro'yxatdan o'tish muvaffaqiyatli amalga oshirildi. Iltimos, emailingizni tekshiring."
    });

  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email.toLowerCase();

    const foundedUser =
      await AuthSchema.findOne({ email: normalizedEmail });

    if (!foundedUser) {
      throw CustomErrorhandler.BadRequest(
        "Bunday foydalanuvchi topilmadi"
      );
    }

    if (
      !foundedUser.otptime ||
      foundedUser.otptime < new Date()
    ) {
      throw CustomErrorhandler.BadRequest(
        "OTP muddati tugagan"
      );
    }

    if (foundedUser.otp !== otp) {
      throw CustomErrorhandler.BadRequest(
        "OTP noto'g'ri"
      );
    }

    foundedUser.verified = true;
    foundedUser.otp = null;
    foundedUser.otptime = null;

    await foundedUser.save();

    res.json({
      message:
        "Foydalanuvchi muvaffaqiyatli tasdiqlandi."
    });

  } catch (error) {
    next(error);
  }
};



const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase();

    const foundedUser =
      await AuthSchema.findOne({
        email: normalizedEmail
      });

    if (!foundedUser) {
      throw CustomErrorhandler.BadRequest("Email yoki parol noto‘g‘ri");
    }

    if (!foundedUser.verified) {
      throw CustomErrorhandler.BadRequest("Avval emailingizni tasdiqlang");
    }

    const isMatch = await bcrypt.compare(
      password,
      foundedUser.password
    );

    if (!isMatch) {
      throw CustomErrorhandler.BadRequest("Email yoki parol noto‘g‘ri");
    }

    const token = jwt.sign(
      {
        id: foundedUser._id,
        role: foundedUser.role || "user"
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Tizimga muvaffaqiyatli kirdingiz",
      token
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verify,
  login
};

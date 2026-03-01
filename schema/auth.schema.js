const { Schema, model } = require('mongoose');

const Auth = new Schema({
  name: {
    type: String,
    required: [true, 'Ism majburiy'],
    minlength: [3, 'Ism kamida 3 ta belgidan iborat bo\'lishi kerak'],
    maxlength: [50, 'Ism 50 ta belgidan iborat bo\'lishi kerak'],
    set: value => value.trim()
  },

  email: {
    type: String,
    required: [true, 'Email majburiy'],
    unique: true,
    lowercase: true,
    trim: true
  },

  verified: {
  type: Boolean,
  default: false
  },

  password: {
    type: String,
    required: [true, 'Parol majburiy'],
    minlength: [6, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'],
    maxlength: [100, 'Parol 100 ta belgidan iborat bo\'lishi kerak']
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  otp: {
    type: String
  },

  otptime: {
    type: Date
  }

}, {
  versionKey: false,
  timestamps: true
});

module.exports = model('auth', Auth);
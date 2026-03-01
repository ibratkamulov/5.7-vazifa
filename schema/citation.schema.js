const { Schema, model } = require("mongoose");

const citationSchema = new Schema(
{
  book: {
    type: Schema.Types.ObjectId,
    ref: "Book",
    required: true,
    unique: true
  },

  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 1000
  }
},
{
  timestamps: true,
  versionKey: false
});

module.exports = model("Citation", citationSchema);
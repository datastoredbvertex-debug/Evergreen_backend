const mongoose = require('mongoose');
const moment = require('moment-timezone');

const categorySchema = mongoose.Schema({
  category: { type: String, required: true },
  datetime: {
    type: String,
    default: moment().tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss')
  }
});

categorySchema.pre('save', function (next) {
  // Capitalize the first letter of description
  if (this.isModified('category')) {
    this.category = this.category.charAt(0).toUpperCase() + this.category.slice(1);
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;

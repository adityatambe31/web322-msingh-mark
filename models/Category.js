const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Category', CategorySchema);
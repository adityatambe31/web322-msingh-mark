const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  id: Number,
  category: Number,
  postDate: Date,
  featureImage: String,
  price: Number,
  title: String,
  body: String,
  published: Boolean
});

module.exports = mongoose.model('Item', ItemSchema);
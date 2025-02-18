const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, text: true },
  author: { type: String, required: true, text: true },
  genre: { type: String, required: true },
  price: { type: Number, required: true },
  publishedYear: Number,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

// Текстовый индекс для полнотекстового поиска
bookSchema.index({ title: 'text', author: 'text' });

module.exports = mongoose.model('Book', bookSchema);

const mongoose = require('mongoose');

// Схема для ответа на отзыв (вложенный документ)
const replySchema = new mongoose.Schema({
  adminName: String,
  comment: String,
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const reviewSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: String,
  comment: String,
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema] // вложенные документы для ответов
});

module.exports = mongoose.model('Review', reviewSchema);

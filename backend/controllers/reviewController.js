const Review = require('../models/Review');
const Book = require('../models/Book');

// Создать новый отзыв
exports.createReview = async (req, res) => {
  try {
    const { bookId, userId, userName, comment, rating } = req.body;

    // Проверяем, существует ли книга
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Книга не найдена' });
    }

    const review = new Review({
      bookId,
      userId,
      userName,
      comment,
      rating,
      createdAt: new Date()
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Получить отзывы для конкретной книги
exports.getReviewsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const reviews = await Review.find({ bookId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Обновить отзыв
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Отзыв не найден' });
    }

    review.comment = req.body.comment || review.comment;
    review.rating = req.body.rating || review.rating;

    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Удалить отзыв
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Отзыв не найден' });
    }
    await review.remove();
    res.json({ message: 'Отзыв удален' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

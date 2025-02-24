const Book = require('../models/Book');
const Review = require('../models/Review');

// 1. Получить количество книг и среднюю цену по жанрам
exports.getGenreAnalytics = async (req, res) => {
  try {
    const result = await Book.aggregate([
      {
        $group: {
          _id: "$genre",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" }
        }
      }
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Получить книги с их отзывами с использованием $lookup
exports.getBooksWithReviews = async (req, res) => {
  try {
    const result = await Book.aggregate([
      {
        $lookup: {
          from: "reviews",      
          localField: "_id",
          foreignField: "bookId",
          as: "reviews"
        }
      }
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Рассчитать средний рейтинг для каждой книги с использованием $group и $lookup
exports.getAverageRatingPerBook = async (req, res) => {
  try {
    const result = await Review.aggregate([
      {
        $group: {
          _id: "$bookId",
          avgRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book"
        }
      },
      { $unwind: "$book" },
      {
        $project: {
          _id: 0,
          bookId: "$book._id",
          title: "$book.title",
          avgRating: 1,
          reviewCount: 1
        }
      }
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

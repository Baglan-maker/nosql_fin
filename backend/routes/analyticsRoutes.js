const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middlewares/authMiddleware'); 

// Аналитика по жанрам: количество книг и средняя цена
router.get('/genre', authMiddleware, analyticsController.getGenreAnalytics);

// Получить книги с их отзывами (с использованием $lookup)
router.get('/books-with-reviews', authMiddleware, analyticsController.getBooksWithReviews);

// Получить средний рейтинг для каждой книги
router.get('/average-rating', authMiddleware, analyticsController.getAverageRatingPerBook);

module.exports = router;

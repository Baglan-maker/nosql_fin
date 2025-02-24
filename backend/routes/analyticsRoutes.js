const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Аналитика по жанрам: количество книг и средняя цена
router.get('/genre', analyticsController.getGenreAnalytics);

// Получить книги с их отзывами (с использованием $lookup)
router.get('/books-with-reviews', analyticsController.getBooksWithReviews);

// Получить средний рейтинг для каждой книги
router.get('/average-rating', analyticsController.getAverageRatingPerBook);

module.exports = router;

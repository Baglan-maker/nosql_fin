const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Создать новый отзыв
router.post('/', reviewController.createReview);

// Получить все отзывы для книги
router.get('/book/:bookId', reviewController.getReviewsByBook);

// Обновить отзыв по ID
router.put('/:id', reviewController.updateReview);

// Удалить отзыв по ID
router.delete('/:id', reviewController.deleteReview);

module.exports = router;

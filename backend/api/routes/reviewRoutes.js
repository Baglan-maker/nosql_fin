const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware'); 

// Создать новый отзыв
router.post('/', reviewController.createReview);

// Получить все отзывы для книги
router.get('/book/:bookId', authMiddleware, reviewController.getReviewsByBook);

// Обновить отзыв по ID
router.put('/:id', authMiddleware, reviewController.updateReview);

// Удалить отзыв по ID
router.delete('/:id', authMiddleware, reviewController.deleteReview);

router.post('/:id/reply', authMiddleware, reviewController.addReply);


module.exports = router;

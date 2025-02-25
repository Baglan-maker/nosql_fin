const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middlewares/authMiddleware'); 
const checkRole = require('../middlewares/roleMiddleware');

// Получить список всех книг
router.get('/', authMiddleware, bookController.getAllBooks);

// Получить книгу по ID
router.get('/:id', authMiddleware, bookController.getBookById);

// Создать новую книгу
router.post('/', authMiddleware, bookController.createBook);

// Обновить данные книги
router.put('/:id',authMiddleware, bookController.updateBook);

// Удалить книгу
router.delete('/:id', authMiddleware, checkRole(['admin']), bookController.deleteBook);

module.exports = router;

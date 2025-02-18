const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Получить список всех книг
router.get('/', bookController.getAllBooks);

// Получить книгу по ID
router.get('/:id', bookController.getBookById);

// Создать новую книгу
router.post('/', bookController.createBook);

// Обновить данные книги
router.put('/:id', bookController.updateBook);

// Удалить книгу
router.delete('/:id', bookController.deleteBook);

module.exports = router;

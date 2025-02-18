const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Регистрация пользователя
router.post('/register', userController.createUser);

// Вход пользователя
router.post('/login', userController.loginUser);

// Получить список всех пользователей
router.get('/', userController.getAllUsers);

// Получить данные пользователя по ID
router.get('/:id', userController.getUserById);

// Обновить данные пользователя
router.put('/:id', userController.updateUser);

// Удалить пользователя
router.delete('/:id', userController.deleteUser);

module.exports = router;

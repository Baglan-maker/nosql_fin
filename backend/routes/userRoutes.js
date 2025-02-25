const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware'); 

// Маршруты для управления профилем (доступны только для аутентифицированных пользователей)
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);

// Регистрация пользователя
router.post('/register', [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }, userController.createUser);
  
// Вход пользователя
router.post('/login', userController.loginUser);

// Получить список всех пользователей
router.get('/', authMiddleware, userController.getAllUsers);

// Получить данные пользователя по ID
router.get('/:id', authMiddleware, userController.getUserById);

// Обновить данные пользователя
router.put('/:id', authMiddleware, userController.updateUser);

// Удалить пользователя
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;

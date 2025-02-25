const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Используйте переменные окружения для секрета
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// Регистрация нового пользователя
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, addresses } = req.body;
    
    // Проверяем, существует ли уже пользователь с таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }
    
    // Хэширование пароля
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      addresses
    });
    
    const newUser = await user.save();
    res.status(201).json(newUser);
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Вход (аутентификация) пользователя
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }
    
    // Сравнение паролей
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }
    
    const token = jwt.sign({ id: user._id, role: user.role  }, JWT_SECRET, { expiresIn: '2m' });
    
    res.json({ token, user });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Получение списка всех пользователей (без паролей)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Получение пользователя по ID (без пароля)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Обновление данных пользователя
exports.updateUser = async (req, res) => {
  try {
    const { name, email, addresses, password } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    user.name = name || user.name;
    user.email = email || user.email;
    user.addresses = addresses || user.addresses;
    
    // Если указан новый пароль – хэшируем его
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    
    const updatedUser = await user.save();
    res.json(updatedUser);
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Удаление пользователя
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    await user.remove();
    res.json({ message: 'Пользователь удален' });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Получение профиля залогиненного пользователя
exports.getProfile = async (req, res) => {
  try {
    // req.user должен содержать id пользователя, полученный из токена
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Обновление профиля залогиненного пользователя
exports.updateProfile = async (req, res) => {
  try {
    // Обновляем пользователя по id, извлеченному из req.user
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

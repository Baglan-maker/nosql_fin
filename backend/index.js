const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // если используем переменные окружения

const app = express();

// Middleware для парсинга JSON и работы с CORS
app.use(express.json());
app.use(cors());

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/bookCatalog', {})
  .then(() => console.log('MongoDB подключена'))
  .catch(err => console.error(err));

// Подключаем маршруты
const bookRoutes = require('./routes/bookRoutes');
app.use('/api/books', bookRoutes);

const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/reviews', reviewRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));

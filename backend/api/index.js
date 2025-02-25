const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // если используем переменные окружения

const path = require('path');
const app = express();

// Middleware для парсинга JSON и работы с CORS
app.use(express.json());
app.use(cors());

// Отдаем статические файлы из папки frontend
app.use(express.static(path.join(__dirname, '../frontend')));


// Подключение к MongoDB
mongoose.connect('mongodb+srv://bagl203456:xTevqEP8XWPEYsG8@cluster0.jvw05.mongodb.net/bookCatalog', {})
  .then(() => console.log('MongoDB подключена'))
  .catch(err => console.error(err));

// Подключаем маршруты
const bookRoutes = require('../routes/bookRoutes');
app.use('/api/books', bookRoutes);

const reviewRoutes = require('../routes/reviewRoutes');
app.use('/api/reviews', reviewRoutes);

const userRoutes = require('../routes/userRoutes');
app.use('/api/users', userRoutes);

const analyticsRoutes = require('../routes/analyticsRoutes');
app.use('/api/analytics', analyticsRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));

const Book = require('../models/Book');

// Получить список всех книг
exports.getAllBooks = async (req, res) => {
  try {
    let queryObj = {};

    // Полнотекстовый поиск по полям title и author
    const searchQuery = req.query.q;
    if (searchQuery) {
      queryObj.$text = { $search: searchQuery };
    }

    // Фильтрация по жанру (category)
    if (req.query.genre) {
      queryObj.genre = req.query.genre;
    }

    // Фильтрация по диапазону года (используем поле publishedYear)
    if (req.query.minYear || req.query.maxYear) {
      queryObj.publishedYear = {};
      if (req.query.minYear) {
        queryObj.publishedYear.$gte = Number(req.query.minYear);
      }
      if (req.query.maxYear) {
        queryObj.publishedYear.$lte = Number(req.query.maxYear);
      }
    }

    // Формирование объекта сортировки
    let sortObj = {};
    if (req.query.sortField) {
      const sortField = req.query.sortField;
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      sortObj[sortField] = sortOrder;
    }

    let query = Book.find(queryObj);
    if (Object.keys(sortObj).length > 0) {
      query = query.sort(sortObj);
    }

    const books = await query;
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Получить книгу по ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book)
      return res.status(404).json({ message: 'Книга не найдена' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Создать новую книгу
exports.createBook = async (req, res) => {
  const { title, author, genre, price, publishedYear, description } = req.body;
  const book = new Book({
    title,
    author,
    genre,
    price,
    publishedYear,
    description
  });
  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Обновить данные книги
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book)
      return res.status(404).json({ message: 'Книга не найдена' });
    
    // Обновляем поля, если они переданы в запросе
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.genre = req.body.genre || book.genre;
    book.price = req.body.price || book.price;
    book.publishedYear = req.body.publishedYear || book.publishedYear;
    book.description = req.body.description || book.description;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Удалить книгу
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book)
      return res.status(404).json({ message: 'Книга не найдена' });
    
    await book.deleteOne();
    res.json({ message: 'Книга удалена' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


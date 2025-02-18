const Book = require('../models/Book');

// Получить список всех книг
exports.getAllBooks = async (req, res) => {
  try {
    // При желании можно добавить фильтры, сортировку или поиск
    const books = await Book.find();
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
    
    await book.remove();
    res.json({ message: 'Книга удалена' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


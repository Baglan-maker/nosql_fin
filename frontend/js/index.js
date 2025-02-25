document.addEventListener('DOMContentLoaded', () => {
    // Загружаем книги без фильтров при загрузке страницы
    fetchBooks();
  
    // Обработчик поиска
    document.getElementById('searchButton').addEventListener('click', () => {
      applyFiltersAndSearch();
    });
  
    // Обработчик очистки поиска
    document.getElementById('clearSearchButton').addEventListener('click', () => {
      document.getElementById('searchInput').value = '';
      applyFiltersAndSearch();
    });
  
    // Обработчик кнопки "Apply Filters & Sorting"
    document.getElementById('applyFiltersButton').addEventListener('click', () => {
      applyFiltersAndSearch();
    });
  
    // Logout
    document.getElementById('logoutLink').addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    });
  });
  
  // Функция, которая собирает все параметры и вызывает fetchBooks
  function applyFiltersAndSearch() {
    const searchQuery = document.getElementById('searchInput').value;
    const genre = document.getElementById('genreFilter').value;
    const minYear = document.getElementById('minYear').value;
    const maxYear = document.getElementById('maxYear').value;
    const sortField = document.getElementById('sortField').value;
    const sortOrder = document.getElementById('sortOrder').value;
  
    const filters = {
      genre: genre,
      minYear: minYear,
      maxYear: maxYear,
    };
  
    const sort = {
      field: sortField,
      order: sortOrder,
    };
  
    fetchBooks(searchQuery, filters, sort);
  }
  
  // Функция для загрузки книг с учётом параметров
  function fetchBooks(searchQuery = '', filters = {}, sort = {}) {
    let url = `${location.origin}/api/books`;
    let params = new URLSearchParams();
  
    if (searchQuery) {
      params.append('q', searchQuery);
    }
    if (filters.genre) {
      params.append('genre', filters.genre);
    }
    if (filters.minYear) {
      params.append('minYear', filters.minYear);
    }
    if (filters.maxYear) {
      params.append('maxYear', filters.maxYear);
    }
    if (sort.field) {
      params.append('sortField', sort.field);
      params.append('sortOrder', sort.order);
    }
    if (params.toString()) {
      url += '?' + params.toString();
    }
  
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        const tbody = document.querySelector('#booksTable tbody');
        tbody.innerHTML = '';
        data.forEach(book => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${book.price}</td>
            <td>${book.publishedYear || ''}</td>
            <td>
              <a href="bookDetail.html?id=${book._id}">View Details</a>
              <a href="editBook.html?id=${book._id}">Edit</a>
              <button onclick="deleteBook('${book._id}')">Delete</button>
            </td>
          `;
          tbody.appendChild(tr);
        });
      })
      .catch(error => console.error(error));
  }
  
  function deleteBook(id) {
    if (confirm('Are you sure you want to delete this book?')) {
      fetch(`${location.origin}/api/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })           .then(response => response.json())
        .then(data => {
          if (data.message === 'Книга удалена') {
            applyFiltersAndSearch();
          } else {
            alert('Ошибка удаления: ' + data.message);
          }
        })
        .catch(error => console.error(error));
    }
  }
  
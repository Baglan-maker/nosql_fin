document.addEventListener('DOMContentLoaded', () => {
    // Обработчик кнопки выхода
    document.getElementById('logoutLink').addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    });
  
    fetchGenreAnalytics();
    fetchBooksWithReviews();
    fetchAverageRating();
  });
  
  // 1. Получение аналитики по жанрам (группировка по жанрам, количество и средняя цена)
  function fetchGenreAnalytics() {
    fetch('http://localhost:5000/api/analytics/genre', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById('genreResults');
        if (data.length === 0) {
          container.innerHTML = '<p>No genre analytics data available.</p>';
          return;
        }
        let html = `
          <table>
            <thead>
              <tr>
                <th>Genre</th>
                <th>Count</th>
                <th>Average Price</th>
              </tr>
            </thead>
            <tbody>`;
        data.forEach(item => {
          html += `
              <tr>
                <td>${item._id}</td>
                <td>${item.count}</td>
                <td>${item.avgPrice.toFixed(2)}</td>
              </tr>`;
        });
        html += `
            </tbody>
          </table>`;
        container.innerHTML = html;
      })
      .catch(err => {
        console.error(err);
        document.getElementById('genreResults').innerHTML = '<p>Error loading genre analytics.</p>';
      });
  }
  
  // 2. Получение аналитики "Books with Reviews" с использованием $lookup
  function fetchBooksWithReviews() {
    fetch('http://localhost:5000/api/analytics/books-with-reviews', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById('booksReviewsResults');
        if (data.length === 0) {
          container.innerHTML = '<p>No books with reviews data available.</p>';
          return;
        }
        let html = '';
        data.forEach(book => {
          html += `
            <div class="book-review-item">
              <h3>${book.title}</h3>
              <p><strong>Author:</strong> ${book.author}</p>
              <p><strong>Genre:</strong> ${book.genre}</p>
              <p><strong>Price:</strong> ${book.price}</p>
              <p><strong>Published Year:</strong> ${book.publishedYear || ''}</p>`;
          if (book.reviews && book.reviews.length > 0) {
            html += `<ul>`;
            book.reviews.forEach(review => {
              html += `<li><strong>${review.userName}:</strong> ${review.comment} (Rating: ${review.rating})</li>`;
            });
            html += `</ul>`;
          } else {
            html += `<p>No reviews.</p>`;
          }
          html += `</div>`;
        });
        container.innerHTML = html;
      })
      .catch(err => {
        console.error(err);
        document.getElementById('booksReviewsResults').innerHTML = '<p>Error loading books with reviews analytics.</p>';
      });
  }
  
  // 3. Получение среднего рейтинга для каждой книги
  function fetchAverageRating() {
    fetch('http://localhost:5000/api/analytics/average-rating', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById('averageRatingResults');
        if (data.length === 0) {
          container.innerHTML = '<p>No average rating data available.</p>';
          return;
        }
        let html = `
          <table>
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Average Rating</th>
                <th>Review Count</th>
              </tr>
            </thead>
            <tbody>`;
        data.forEach(item => {
          html += `
              <tr>
                <td>${item.title}</td>
                <td>${item.avgRating.toFixed(2)}</td>
                <td>${item.reviewCount}</td>
              </tr>`;
        });
        html += `
            </tbody>
          </table>`;
        container.innerHTML = html;
      })
      .catch(err => {
        console.error(err);
        document.getElementById('averageRatingResults').innerHTML = '<p>Error loading average rating analytics.</p>';
      });
  }
  
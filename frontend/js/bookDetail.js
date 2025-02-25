import { checkAuthFetch } from './utils.js';

// Функция для получения параметров URL
function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
  }
  
  const bookId = getQueryParam('id');
  
  document.addEventListener('DOMContentLoaded', () => {
    if (!bookId) {
      alert('Book ID is missing in URL');
      return;
    }
  
    loadBookDetails();
    loadReviews();
    setupReviewForm();
  });
  
  // Загрузка деталей книги
  function loadBookDetails() {
    checkAuthFetch(`${location.origin}/api/books/${bookId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
        .then(book => {
        const bookInfo = document.getElementById('bookInfo');
        bookInfo.innerHTML = `
          <h2>${book.title}</h2>
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>Genre:</strong> ${book.genre}</p>
          <p><strong>Price:</strong> ${book.price}</p>
          <p><strong>Published Year:</strong> ${book.publishedYear || ''}</p>
          <p>${book.description || ''}</p>
        `;
      })
      .catch(error => console.error('Error loading book details:', error));
  }
  
  // Загрузка отзывов для книги
  function loadReviews() {
    checkAuthFetch(`${location.origin}/api/reviews/book/${bookId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
      .then(reviews => {
        const reviewsList = document.getElementById('reviewsList');
        reviewsList.innerHTML = '';
        if (reviews.length === 0) {
          reviewsList.innerHTML = '<li>No reviews yet.</li>';
          return;
        }
        reviews.forEach(review => {
          const li = document.createElement('li');
          li.innerHTML = `<strong>${review.userName}:</strong> ${review.comment} (Rating: ${review.rating})`;
  
          // Если есть ответы, отобразим их
          if (review.replies && review.replies.length > 0) {
            const repliesList = document.createElement('ul');
            repliesList.classList.add('replies-list');
            review.replies.forEach(reply => {
              const replyLi = document.createElement('li');
              replyLi.innerHTML = `<strong>${reply.responderName}:</strong> ${reply.comment}`;
              repliesList.appendChild(replyLi);
            });
            li.appendChild(repliesList);
          }
  
          // Кнопка "Reply" для добавления ответа
          const replyButton = document.createElement('button');
          replyButton.textContent = "Reply";
          replyButton.addEventListener('click', () => {
            const existingForm = li.querySelector('.reply-form');
            if (existingForm) {
              existingForm.remove();
            } else {
              const form = document.createElement('form');
              form.classList.add('reply-form');
  
              const user = localStorage.getItem('user')
                ? JSON.parse(localStorage.getItem('user'))
                : null;
              let formInnerHTML = "";
              if (user) {
                formInnerHTML = `
                  <p>Reply as: <strong>${user.name}</strong></p>
                  <textarea name="replyComment" placeholder="Your reply" required></textarea>
                  <button type="submit">Submit Reply</button>
                `;
              } else {
                formInnerHTML = `
                  <input type="text" name="responderName" placeholder="Your name" required>
                  <textarea name="replyComment" placeholder="Your reply" required></textarea>
                  <button type="submit">Submit Reply</button>
                `;
              }
              form.innerHTML = formInnerHTML;
  
              form.addEventListener('submit', function(e) {
                e.preventDefault();
                let responderName = "";
                if (user) {
                  responderName = user.name;
                } else {
                  responderName = form.querySelector('input[name="responderName"]').value;
                }
                const replyComment = form.querySelector('textarea[name="replyComment"]').value;
                addReply(review._id, responderName, replyComment);
              });
  
              li.appendChild(form);
            }
          });
          li.appendChild(replyButton);
          reviewsList.appendChild(li);
        });
      })
      .catch(error => console.error('Error loading reviews:', error));
  }
  
  // Функция для отправки нового ответа (reply) к отзыву
  function addReply(reviewId, responderName, replyComment) {
    checkAuthFetch(`${location.origin}/api/reviews/${reviewId}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ responderName, comment: replyComment })
    })
    .then(res => res.json())
        .then(data => {
        alert('Reply added successfully!');
        loadReviews(); // обновляем список отзывов
      })
      .catch(error => {
        console.error('Error adding reply:', error);
        alert('Error adding reply');
      });
  }
  
  // Настройка формы для отправки отзыва
  function setupReviewForm() {
    const reviewForm = document.getElementById('reviewForm');
    const userNameField = document.getElementById('userNameField');
  
    // Предположим, что если пользователь залогинен, его данные сохранены в localStorage
    const user = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null;
  
    if (user) {
      userNameField.innerHTML = `<p>Review as: <strong>${user.name}</strong></p>`;
    } else {
      userNameField.innerHTML = `
        <label for="userName">Your Name:</label>
        <input type="text" id="userName" required>
      `;
    }
  
    reviewForm.addEventListener('submit', function(e) {
      e.preventDefault();
      let userName, userId;
      if (user) {
        userName = user.name;
        userId = user._id;
      } else {
        userName = document.getElementById('userName').value;
        userId = null;
      }
      const comment = document.getElementById('comment').value;
      const rating = parseInt(document.getElementById('rating').value);
  
      const reviewData = { bookId, userId, userName, comment, rating };
  
      checkAuthFetch(`${location.origin}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      })
      .then(res => res.json())
              .then(data => {
          alert('Review submitted successfully!');
          reviewForm.reset();
          loadReviews();
        })
        .catch(error => {
          console.error('Error submitting review:', error);
          alert('Error submitting review');
        });
    });
  }
  
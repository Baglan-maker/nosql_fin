document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get('id');
    if (bookId) {
      fetch(`http://localhost:5000/api/books/${bookId}`)
        .then(response => response.json())
        .then(book => {
          document.getElementById('bookId').value = book._id;
          document.getElementById('title').value = book.title;
          document.getElementById('author').value = book.author;
          document.getElementById('genre').value = book.genre;
          document.getElementById('price').value = book.price;
          document.getElementById('publishedYear').value = book.publishedYear;
          document.getElementById('description').value = book.description;
        })
        .catch(error => console.error(error));
    }
  });
  
  document.getElementById('editBookForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const bookId = document.getElementById('bookId').value;
    const updatedData = {
      title: document.getElementById('title').value,
      author: document.getElementById('author').value,
      genre: document.getElementById('genre').value,
      price: parseFloat(document.getElementById('price').value),
      publishedYear: parseInt(document.getElementById('publishedYear').value),
      description: document.getElementById('description').value
    };
    
    fetch(`http://localhost:5000/api/books/${bookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {
      alert('Book updated successfully!');
      window.location.href = 'index.html';
    })
    .catch(error => console.error(error));
  });
  
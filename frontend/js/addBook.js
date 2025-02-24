document.getElementById('addBookForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
      title: document.getElementById('title').value,
      author: document.getElementById('author').value,
      genre: document.getElementById('genre-add').value,
      price: parseFloat(document.getElementById('price').value),
      publishedYear: parseInt(document.getElementById('publishedYear').value),
      description: document.getElementById('description').value
    };
    
    fetch('http://localhost:5000/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      alert('Book added successfully!');
      window.location.href = 'index.html';
    })
    .catch(error => console.error(error));
  });
  
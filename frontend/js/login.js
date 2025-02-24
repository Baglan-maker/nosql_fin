document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const loginData = { email, password };
    
    fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
      if(data.token) {
        localStorage.setItem('token', data.token);
        alert('Login successful!');
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        window.location.href = 'index.html';
      } else {
        alert('Login failed: ' + data.message);
      }
    })
    .catch(err => {
      console.error(err);
      alert('Login failed');
    });
  });
  
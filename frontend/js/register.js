document.getElementById('addAddressButton').addEventListener('click', () => {
    const container = document.getElementById('addressesContainer');
    
    // Создаем новый блок адреса
    const addressBlock = document.createElement('div');
    addressBlock.classList.add('address-block');
    
    addressBlock.innerHTML = `
      <label>Street:</label>
      <input type="text" name="street" required>
      <br>
      <label>City:</label>
      <input type="text" name="city" required>
      <br>
      <label>State:</label>
      <input type="text" name="state" required>
      <br>
      <label>Zip:</label>
      <input type="text" name="zip" required>
      <br>
      <button type="button" class="removeAddressButton">Remove Address</button>
      <hr>
    `;
    
    container.appendChild(addressBlock);
    
    // Добавляем обработчик для удаления этого блока
    addressBlock.querySelector('.removeAddressButton').addEventListener('click', () => {
      container.removeChild(addressBlock);
    });
  });
  
  document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Собираем данные адресов
    const addresses = [];
    document.querySelectorAll('.address-block').forEach(block => {
      const street = block.querySelector('input[name="street"]').value;
      const city = block.querySelector('input[name="city"]').value;
      const state = block.querySelector('input[name="state"]').value;
      const zip = block.querySelector('input[name="zip"]').value;
      
      addresses.push({ street, city, state, zip });
    });
    
    const userData = { name, email, password, addresses };
    
    fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
      if (data._id) {
        alert('Registration successful!');
        window.location.href = 'login.html';
      } else {
        alert('Registration failed: ' + data.message);
      }
    })
    .catch(err => {
      console.error(err);
      alert('Registration failed');
    });
  });
  
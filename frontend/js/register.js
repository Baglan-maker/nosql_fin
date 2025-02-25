// Обработчик "глазка" для переключения отображения пароля
document.getElementById('togglePassword').addEventListener('click', function () {
  const passwordField = document.getElementById('password');
  const currentType = passwordField.getAttribute('type');
  const newType = currentType === 'password' ? 'text' : 'password';
  passwordField.setAttribute('type', newType);
  // Меняем иконку (можно настроить по вкусу)
  this.textContent = newType === 'password' ? '👁' : '👁‍🗨';
});


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
    
    document.getElementById('registerError').style.display = 'none';
    document.getElementById('registerError').textContent = '';
    document.getElementById('passwordError').style.display = 'none';
    document.getElementById('passwordError').textContent = '';

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (password.length < 6) {
      document.getElementById('passwordError').textContent = 'Password must be at least 6 characters long.';
      document.getElementById('passwordError').style.display = 'block';
      return;
    }
      
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
    
    fetch(`${location.origin}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    .then(response => {
      if (!response.ok) {
        // Если сервер возвращает ошибки валидации
        return response.json().then(errData => {
          throw errData;
        });
      }
      return response.json();
    })
    .then(data => {
      if (data._id) {
        // Регистрация успешна, перенаправляем на страницу логина
        window.location.href = 'login.html';
      } else {
        throw { message: 'Registration failed' };
      }
    })
    .catch(err => {
      console.error(err);
      // Если пришел массив ошибок (express-validator возвращает errors в виде массива)
      let errorMessage = '';
      if (err.errors && Array.isArray(err.errors)) {
        err.errors.forEach(error => {
          errorMessage += `${error.msg}\n`;
        });
      } else if (err.message) {
        errorMessage = err.message;
      } else {
        errorMessage = 'Registration failed';
      }
      const errorDiv = document.getElementById('registerError');
      errorDiv.textContent = errorMessage;
      errorDiv.style.display = 'block';
    });
});
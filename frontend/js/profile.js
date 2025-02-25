document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('logoutLink').addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    });
  
    loadUserProfile();
  
    document.getElementById('editProfileBtn').addEventListener('click', () => {
      toggleEdit(true);
    });
  
    document.getElementById('cancelEditBtn').addEventListener('click', () => {
      toggleEdit(false);
    });
  
    document.getElementById('addAddressBtn').addEventListener('click', addAddressBlock);
  
    document.getElementById('profileForm').addEventListener('submit', (e) => {
      e.preventDefault();
      updateUserProfile();
    });
  });
  
  // Загружает данные профиля с сервера
  function loadUserProfile() {
    fetch(`${location.origin}/api/users/profile`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
        if (!response.ok) { // Проверяем статус ответа
          return response.json().then(err => {
            throw new Error(err.message || 'Unauthorized'); 
          });
        }
        return response.json();
      })
      .then(user => {
        console.log('User profile:', user);

        // Отобразить информацию в карточке
        document.getElementById('displayName').textContent = user.name || 'No name provided';
        document.getElementById('displayEmail').textContent = user.email || 'No email provided';
        const addressesList = document.getElementById('addressesList');
        addressesList.innerHTML = '';
        if (user.addresses && user.addresses.length > 0) {
          user.addresses.forEach(addr => {
            const li = document.createElement('li');
            li.textContent = `${addr.street}, ${addr.city}, ${addr.state}, ${addr.zip}`;
            addressesList.appendChild(li);
          });
        } else {
          addressesList.innerHTML = '<li>No addresses.</li>';
        }
  
        // Сохраняем пользователя в localStorage для дальнейшего использования
        localStorage.setItem('user', JSON.stringify(user));
  
        // Заполняем форму редактирования (если открыта)
        document.getElementById('name').value = user.name || '';
        document.getElementById('email').value = user.email || '';
        const editContainer = document.getElementById('addressesEditContainer');
        editContainer.innerHTML = '';
        if (user.addresses && user.addresses.length > 0) {
          user.addresses.forEach(addr => {
            addAddressBlock(addr);
          });
        }
      })
      .catch(error => {
        console.error('Error loading profile:', error.message);
        //alert('Session expired or unauthorized. Redirecting to login.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.replace('login.html?error=tokenExpired');
      });
  }
  
  // Переключает режим редактирования
  function toggleEdit(isEditing) {
    document.getElementById('editProfileSection').style.display = isEditing ? 'block' : 'none';
    document.getElementById('profileInfo').style.display = isEditing ? 'none' : 'block';
    if (isEditing) {
      loadUserProfile();
    }
  }
  
  // Добавляет блок для ввода адреса. Если передан объект addr, заполняет поля.
  function addAddressBlock(addr = {}) {
    const container = document.getElementById('addressesEditContainer');
    const div = document.createElement('div');
    div.classList.add('address-block');
    div.innerHTML = `
      <label>Street:</label>
      <input type="text" name="street" value="${addr.street || ''}" required>
      <br>
      <label>City:</label>
      <input type="text" name="city" value="${addr.city || ''}" required>
      <br>
      <label>State:</label>
      <input type="text" name="state" value="${addr.state || ''}" required>
      <br>
      <label>Zip:</label>
      <input type="text" name="zip" value="${addr.zip || ''}" required>
      <br>
      <button type="button" class="removeAddressBtn">Remove Address</button>
      <hr>
    `;
    container.appendChild(div);
    div.querySelector('.removeAddressBtn').addEventListener('click', () => {
      container.removeChild(div);
    });
  }
  
  // Отправляет обновлённые данные профиля на сервер
  function updateUserProfile() {
    const updatedData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      addresses: []
    };
  
    // Собираем данные из блоков адресов
    document.querySelectorAll('#addressesEditContainer .address-block').forEach(block => {
      const street = block.querySelector('input[name="street"]').value;
      const city = block.querySelector('input[name="city"]').value;
      const state = block.querySelector('input[name="state"]').value;
      const zip = block.querySelector('input[name="zip"]').value;
      updatedData.addresses.push({ street, city, state, zip });
    });
  
    fetch(`${location.origin}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updatedData)
    })
      .then(response => response.json())
      .then(data => {
        alert('Profile updated successfully!');
        toggleEdit(false);
        loadUserProfile();
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        alert('Error updating profile');
      });
  }
  
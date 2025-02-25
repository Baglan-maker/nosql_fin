export function checkAuthFetch(url, options = {}) {
    return fetch(url, options).then(response => {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.replace('login.html?error=tokenExpired');
        return Promise.reject("Unauthorized");
      }
      return response;
    });
  }
  
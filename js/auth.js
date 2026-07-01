/* Authentication page JavaScript */
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const AUTH_KEY = 'drixLoggedIn';
const REGISTERED_USER_KEY = 'drixRegisteredUser';
const DEFAULT_USER = { username: 'drixeg', password: '123456' };

const isAuthenticated = () => localStorage.getItem(AUTH_KEY) === 'true';
const setAuthenticated = (value) => localStorage.setItem(AUTH_KEY, value ? 'true' : 'false');
const getRedirectTarget = () => new URLSearchParams(window.location.search).get('redirect') || 'dashboard.html';

const getRegisteredUser = () => {
  const stored = localStorage.getItem(REGISTERED_USER_KEY);
  if (!stored) return DEFAULT_USER;
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_USER;
  }
};

const saveRegisteredUser = (user) => {
  localStorage.setItem(REGISTERED_USER_KEY, JSON.stringify(user));
};

const validateAuthForm = (form) => {
  const requiredFields = Array.from(form.querySelectorAll('[required]'));
  return requiredFields.every((field) => field.value.trim().length > 0);
};

const redirectAfterLogin = () => {
  const target = getRedirectTarget();
  window.location.replace(target);
};

const loginUsingCredentials = (username, password) => {
  const registeredUser = getRegisteredUser();
  return registeredUser.username === username && registeredUser.password === password;
};

if (loginForm) {
  if (isAuthenticated()) {
    redirectAfterLogin();
  }

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateAuthForm(loginForm)) {
      alert('من فضلك املأ اسم المستخدم وكلمة المرور.');
      return;
    }

    const username = document.getElementById('login-username')?.value.trim();
    const password = document.getElementById('login-password')?.value.trim();

    if (loginUsingCredentials(username, password)) {
      setAuthenticated(true);
      redirectAfterLogin();
    } else {
      alert('في حاجه غلط ف حاجه من الاتنين');
    }
  });
}

if (registerForm) {
  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateAuthForm(registerForm)) {
      alert('من فضلك املأ كل الحقول.');
      return;
    }

    const username = document.getElementById('register-username')?.value.trim();
    const fullName = document.getElementById('register-name')?.value.trim();
    const email = document.getElementById('register-email')?.value.trim();
    const phone = document.getElementById('register-phone')?.value.trim();
    const password = document.getElementById('register-password')?.value.trim();
    const confirmPassword = document.getElementById('register-confirm')?.value.trim();

    if (password !== confirmPassword) {
      alert('كلمة المرور وتأكيدها لازم يكونوا نفسهم.');
      return;
    }

    saveRegisteredUser({ username, fullName, email, phone, password });
    setAuthenticated(true);
    redirectAfterLogin();
  });
}

const logout = () => {
  setAuthenticated(false);
  window.location.replace('login.html');
};

const initLogoutButton = () => {
  const logoutButton = document.getElementById('logout-button');
  logoutButton?.addEventListener('click', (event) => {
    event.preventDefault();
    logout();
  });
};

document.addEventListener('DOMContentLoaded', initLogoutButton);

if (window.location.pathname.endsWith('dashboard.html') && !isAuthenticated()) {
  window.location.replace('login.html?redirect=dashboard.html');
}

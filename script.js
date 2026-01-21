// ============================================
// STUDENT COMMUNITY - FRONTEND
// ============================================

// CONFIGURATION
const CONFIG = {
  BACKEND_URL: "https://script.google.com/macros/s/AKfycbzSPAlSGpoAF8TgFCrjZzSO3THpnr7gZs0omcekXgQdfzbs-FiVxX8EXkDwFZa43KtRIg/exec", // Deploy ke baad jo URL aya
  APP_NAME: "Student Community",
  VERSION: "1.0"
};

// STATE MANAGEMENT
let currentUser = null;
let userCounter = localStorage.getItem('userCounter') || 1;

// ============================================
// DOM ELEMENTS
// ============================================
const loginToggle = document.getElementById('loginToggle');
const registerToggle = document.getElementById('registerToggle');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotForm = document.getElementById('forgotForm');
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const cancelForgot = document.getElementById('cancelForgot');

// Form Elements
const loginFormElement = document.getElementById('loginFormElement');
const registerFormElement = document.getElementById('registerFormElement');
const forgotFormElement = document.getElementById('forgotFormElement');

// Image Upload
const uploadArea = document.getElementById('uploadArea');
const profilePicInput = document.getElementById('profilePic');
const previewContainer = document.getElementById('previewContainer');

// Password Strength
const passwordInput = document.getElementById('registerPassword');
const strengthBar = document.querySelector('.strength-bar');
const strengthText = document.querySelector('.strength-text');

// ============================================
// BACKEND API FUNCTIONS
// ============================================

async function callBackend(action, data = {}) {
  try {
    showLoader();
    
    const response = await fetch(CONFIG.BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: action,
        ...data
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const result = await response.json();
    hideLoader();
    
    console.log(`🔹 ${action} Response:`, result);
    return result;
    
  } catch (error) {
    hideLoader();
    console.error(`❌ ${action} Error:`, error);
    
    return {
      success: false,
      message: "🌐 Network error. Please check your connection."
    };
  }
}

// ============================================
// UI FUNCTIONS
// ============================================

function showLoader(text = "Processing...") {
  const loader = document.getElementById('loader') || createLoader();
  loader.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
  loader.style.display = 'block';
}

function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = 'none';
}

function createLoader() {
  const loader = document.createElement('div');
  loader.id = 'loader';
  loader.className = 'loader';
  loader.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #3b82f6;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    z-index: 1000;
    display: none;
  `;
  document.body.appendChild(loader);
  return loader;
}

function showMessage(message, type = 'success') {
  const messageEl = document.getElementById('message') || createMessageBox();
  messageEl.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    ${message}
  `;
  messageEl.className = `message ${type}`;
  messageEl.style.display = 'block';
  
  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 3000);
}

function createMessageBox() {
  const box = document.createElement('div');
  box.id = 'message';
  box.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 1000;
    display: none;
    min-width: 300px;
    text-align: center;
  `;
  document.body.appendChild(box);
  return box;
}

// ============================================
// FORM HANDLERS
// ============================================

// Toggle between forms
loginToggle.addEventListener('click', () => toggleForm('login'));
registerToggle.addEventListener('click', () => toggleForm('register'));
switchToRegister.addEventListener('click', (e) => { e.preventDefault(); toggleForm('register'); });
switchToLogin.addEventListener('click', (e) => { e.preventDefault(); toggleForm('login'); });

function toggleForm(form) {
  // Reset all
  loginToggle.classList.remove('active');
  registerToggle.classList.remove('active');
  loginForm.classList.remove('active');
  registerForm.classList.remove('active');
  forgotForm.classList.remove('active');
  
  // Activate selected
  if (form === 'login') {
    loginToggle.classList.add('active');
    loginForm.classList.add('active');
  } else if (form === 'register') {
    registerToggle.classList.add('active');
    registerForm.classList.add('active');
  } else if (form === 'forgot') {
    forgotForm.classList.add('active');
  }
}

// Forgot password
forgotPasswordLink.addEventListener('click', (e) => {
  e.preventDefault();
  toggleForm('forgot');
});

cancelForgot.addEventListener('click', () => {
  toggleForm('login');
});

// Password visibility toggle
document.querySelectorAll('.toggle-password').forEach(button => {
  button.addEventListener('click', function() {
    const input = this.previousElementSibling;
    const icon = this.querySelector('i');
    
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  });
});

// Phone number formatting
document.querySelectorAll('input[type="tel"]').forEach(input => {
  input.addEventListener('input', function(e) {
    let value = this.value.replace(/\D/g, '');
    
    if (value.length > 0) {
      if (value.length <= 4) {
        value = value;
      } else if (value.length <= 11) {
        value = value.substring(0, 4) + '-' + value.substring(4);
      } else {
        value = value.substring(0, 11);
      }
    }
    
    this.value = value;
  });
});

// Password strength indicator
passwordInput.addEventListener('input', function() {
  const password = this.value;
  let score = 0;
  
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 20;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 20;
  if (/[^A-Za-z0-9]/.test(password)) score += 20;
  
  strengthBar.style.width = score + '%';
  
  if (score <= 40) {
    strengthBar.style.backgroundColor = '#ef4444';
    strengthText.textContent = 'Weak';
  } else if (score <= 80) {
    strengthBar.style.backgroundColor = '#f59e0b';
    strengthText.textContent = 'Medium';
  } else {
    strengthBar.style.backgroundColor = '#10b981';
    strengthText.textContent = 'Strong';
  }
});

// Image upload
uploadArea.addEventListener('click', () => profilePicInput.click());

profilePicInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  // Validation
  if (file.size > 2 * 1024 * 1024) {
    showMessage('❌ Image must be less than 2MB', 'error');
    this.value = '';
    return;
  }
  
  if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
    showMessage('❌ Only JPG/PNG images allowed', 'error');
    this.value = '';
    return;
  }
  
  // Preview
  const reader = new FileReader();
  reader.onload = function(e) {
    previewContainer.innerHTML = `
      <img src="${e.target.result}" alt="Preview">
      <button type="button" class="remove-image">
        <i class="fas fa-trash"></i> Remove
      </button>
    `;
    previewContainer.style.display = 'block';
    
    previewContainer.querySelector('.remove-image').addEventListener('click', () => {
      profilePicInput.value = '';
      previewContainer.style.display = 'none';
    });
  };
  reader.readAsDataURL(file);
});

// ============================================
// FORM SUBMISSIONS
// ============================================

// 1. REGISTRATION
registerFormElement.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // Get form data
  const formData = {
    firstName: document.getElementById('firstName').value.trim(),
    lastName: document.getElementById('lastName').value.trim(),
    education: document.getElementById('education').value,
    skills: document.getElementById('skills').value.trim(),
    phone: document.getElementById('registerPhone').value,
    password: document.getElementById('registerPassword').value
  };
  
  // Validation
  if (!/^[A-Za-z ]{2,20}$/.test(formData.firstName)) {
    showMessage('❌ First name: 2-20 letters only', 'error');
    return;
  }
  
  if (!/^[A-Za-z ]{2,20}$/.test(formData.lastName)) {
    showMessage('❌ Last name: 2-20 letters only', 'error');
    return;
  }
  
  if (!formData.education) {
    showMessage('❌ Please select education level', 'error');
    return;
  }
  
  if (!/^03\d{2}-\d{7}$/.test(formData.phone)) {
    showMessage('❌ Phone format: 03XX-XXXXXXX', 'error');
    return;
  }
  
  if (formData.password.length < 6) {
    showMessage('❌ Password must be at least 6 characters', 'error');
    return;
  }
  
  if (formData.password !== document.getElementById('confirmPassword').value) {
    showMessage('❌ Passwords do not match', 'error');
    return;
  }
  
  if (!document.getElementById('terms').checked) {
    showMessage('❌ Please accept terms & conditions', 'error');
    return;
  }
  
  // Handle profile picture
  if (profilePicInput.files[0]) {
    const reader = new FileReader();
    formData.profilePic = await new Promise((resolve) => {
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(profilePicInput.files[0]);
    });
  }
  
  // Call backend
  const result = await callBackend('register', { userData: formData });
  
  if (result.success) {
    showMessage(`✅ ${result.message} Username: ${result.username}`, 'success');
    
    // Reset form
    registerFormElement.reset();
    previewContainer.style.display = 'none';
    strengthBar.style.width = '0%';
    strengthText.textContent = 'Password strength';
    
    // Switch to login and auto-fill
    setTimeout(() => {
      toggleForm('login');
      document.getElementById('loginPhone').value = formData.phone;
    }, 1500);
    
  } else {
    showMessage(`❌ ${result.message}`, 'error');
  }
});

// 2. LOGIN
loginFormElement.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const phone = document.getElementById('loginPhone').value;
  const password = document.getElementById('loginPassword').value;
  
  // Validation
  if (!/^03\d{2}-\d{7}$/.test(phone)) {
    showMessage('❌ Invalid phone format', 'error');
    return;
  }
  
  if (password.length < 6) {
    showMessage('❌ Password too short', 'error');
    return;
  }
  
  // Remember me
  if (document.getElementById('rememberMe').checked) {
    localStorage.setItem('rememberedPhone', phone);
  }
  
  // Call backend
  const result = await callBackend('login', { phone, password });
  
  if (result.success) {
    showMessage(`✅ Welcome back, ${result.userData.firstName}!`, 'success');
    
    // Save user data
    localStorage.setItem('currentUser', JSON.stringify(result.userData));
    localStorage.setItem('userToken', 'logged_in_' + Date.now());
    
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);
    
  } else {
    showMessage(`❌ ${result.message}`, 'error');
  }
});

// 3. FORGOT PASSWORD
forgotFormElement.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const phone = document.getElementById('forgotPhone').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmNewPassword').value;
  
  // Validation
  if (!/^03\d{2}-\d{7}$/.test(phone)) {
    showMessage('❌ Invalid phone format', 'error');
    return;
  }
  
  if (newPassword.length < 6) {
    showMessage('❌ Password must be at least 6 characters', 'error');
    return;
  }
  
  if (newPassword !== confirmPassword) {
    showMessage('❌ Passwords do not match', 'error');
    return;
  }
  
  // Check phone exists
  const checkResult = await callBackend('checkPhone', { phone });
  
  if (!checkResult.exists) {
    showMessage('❌ Phone number not found', 'error');
    return;
  }
  
  // Reset password
  const resetResult = await callBackend('resetPassword', { 
    phone, 
    newPassword 
  });
  
  if (resetResult.success) {
    showMessage('✅ Password reset successful!', 'success');
    
    // Reset form and switch to login
    forgotFormElement.reset();
    toggleForm('login');
    document.getElementById('loginPhone').value = phone;
    
  } else {
    showMessage(`❌ ${resetResult.message}`, 'error');
  }
});

// ============================================
// INITIALIZATION
// ============================================

async function initApp() {
  console.log(`${CONFIG.APP_NAME} v${CONFIG.VERSION} initializing...`);
  
  // Create UI elements
  createLoader();
  createMessageBox();
  
  // Load remembered phone
  const rememberedPhone = localStorage.getItem('rememberedPhone');
  if (rememberedPhone) {
    document.getElementById('loginPhone').value = rememberedPhone;
    document.getElementById('rememberMe').checked = true;
  }
  
  // Update users count
  updateUsersCount();
  
  // Test backend connection
  const connected = await testConnection();
  
  if (connected) {
    console.log('✅ Backend connected successfully');
  } else {
    console.warn('⚠️ Backend connection issue');
    showMessage('⚠️ Running in offline mode', 'warning');
  }
}

async function testConnection() {
  try {
    const response = await fetch(CONFIG.BACKEND_URL);
    const data = await response.json();
    return data.success !== false;
  } catch (error) {
    return false;
  }
}

async function updateUsersCount() {
  try {
    const result = await callBackend('getUsersCount');
    if (result.success) {
      const footer = document.querySelector('.footer');
      const existing = document.getElementById('usersCount');
      
      if (existing) existing.remove();
      
      const countEl = document.createElement('p');
      countEl.id = 'usersCount';
      countEl.innerHTML = `<i class="fas fa-users"></i> ${result.count} Students Registered`;
      footer.insertBefore(countEl, document.querySelector('.copyright'));
    }
  } catch (error) {
    // Silent fail
  }
}

// Start the app
document.addEventListener('DOMContentLoaded', initApp);
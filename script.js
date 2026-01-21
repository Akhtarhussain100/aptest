// DOM Elements
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

// Image Upload Elements
const uploadArea = document.getElementById('uploadArea');
const profilePicInput = document.getElementById('profilePic');
const previewContainer = document.getElementById('previewContainer');

// Password Toggle
const togglePasswordButtons = document.querySelectorAll('.toggle-password');

// User counter for auto username generation
let userCounter = 1;

// ✅ BACKEND CONFIGURATION - APNI WEB APP URL YAHAN DALEN
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbzpD_1HGR25eO-mnV3blH6ic0sTXaxexlkrnzlX6yuJNR9wIvPXS3kKF5Bgi9c9e7xJgA/exec";

// ✅ BACKEND API FUNCTIONS
async function callBackend(action, data) {
    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: action,
                ...data
            })
        });
        
        const result = await response.json();
        console.log(`Backend response for ${action}:`, result);
        return result;
    } catch (error) {
        console.error('Backend connection error:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection and try again.'
        };
    }
}

// ✅ Toggle between Login and Register
loginToggle.addEventListener('click', () => {
    loginToggle.classList.add('active');
    registerToggle.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    forgotForm.classList.remove('active');
});

registerToggle.addEventListener('click', () => {
    registerToggle.classList.add('active');
    loginToggle.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
    forgotForm.classList.remove('active');
});

switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    registerToggle.click();
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    loginToggle.click();
});

// ✅ Forgot Password Link
forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.remove('active');
    registerForm.classList.remove('active');
    forgotForm.classList.add('active');
    loginToggle.classList.remove('active');
    registerToggle.classList.remove('active');
});

cancelForgot.addEventListener('click', () => {
    loginToggle.click();
});

// ✅ Toggle Password Visibility
togglePasswordButtons.forEach(button => {
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

// ✅ Image Upload Functionality
uploadArea.addEventListener('click', () => {
    profilePicInput.click();
});

profilePicInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            alert('❌ File size must be less than 2MB');
            this.value = '';
            return;
        }
        
        // Validate file type
        if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
            alert('❌ Only JPG and PNG files are allowed');
            this.value = '';
            return;
        }
        
        // Create preview
        const reader = new FileReader();
        reader.onload = function(e) {
            previewContainer.innerHTML = `
                <img src="${e.target.result}" alt="Profile Preview">
                <button type="button" class="remove-image">
                    <i class="fas fa-trash"></i> Remove Image
                </button>
            `;
            previewContainer.style.display = 'block';
            
            // Add remove functionality
            const removeBtn = previewContainer.querySelector('.remove-image');
            removeBtn.addEventListener('click', () => {
                profilePicInput.value = '';
                previewContainer.style.display = 'none';
                previewContainer.innerHTML = '';
            });
        };
        reader.readAsDataURL(file);
    }
});

// ✅ Drag and Drop for Image Upload
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#3b82f6';
    uploadArea.style.backgroundColor = '#f0f9ff';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#cbd5e1';
    uploadArea.style.backgroundColor = 'white';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#cbd5e1';
    uploadArea.style.backgroundColor = 'white';
    
    if (e.dataTransfer.files.length) {
        profilePicInput.files = e.dataTransfer.files;
        const event = new Event('change');
        profilePicInput.dispatchEvent(event);
    }
});

// ✅ Password Strength Indicator
const passwordInput = document.getElementById('registerPassword');
const strengthBar = document.querySelector('.strength-bar');
const strengthText = document.querySelector('.strength-text');

passwordInput.addEventListener('input', function() {
    const password = this.value;
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    // Update UI
    const width = strength * 20;
    strengthBar.style.width = width + '%';
    
    if (strength <= 2) {
        strengthBar.style.backgroundColor = '#ef4444';
        strengthText.textContent = 'Weak Password';
        strengthText.style.color = '#ef4444';
    } else if (strength <= 4) {
        strengthBar.style.backgroundColor = '#f59e0b';
        strengthText.textContent = 'Medium Password';
        strengthText.style.color = '#f59e0b';
    } else {
        strengthBar.style.backgroundColor = '#10b981';
        strengthText.textContent = 'Strong Password';
        strengthText.style.color = '#10b981';
    }
});

// ✅ Phone Number Formatting
const phoneInputs = document.querySelectorAll('input[type="tel"]');

phoneInputs.forEach(input => {
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

// ✅ Remember Me functionality
const rememberMe = document.getElementById('rememberMe');
const loginPhoneInput = document.getElementById('loginPhone');

// Load saved phone number if Remember Me was checked
window.addEventListener('load', () => {
    const savedPhone = localStorage.getItem('rememberedPhone');
    if (savedPhone) {
        loginPhoneInput.value = savedPhone;
        rememberMe.checked = true;
    }
});

// Save phone number when Remember Me is checked
rememberMe.addEventListener('change', function() {
    if (!this.checked) {
        localStorage.removeItem('rememberedPhone');
    }
});

// ✅ LOGIN FORM SUBMISSION WITH BACKEND
loginFormElement.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const phone = document.getElementById('loginPhone').value;
    const password = document.getElementById('loginPassword').value;
    
    // Validate phone format
    if (!/^03\d{2}-\d{7}$/.test(phone)) {
        alert('❌ Please enter a valid phone number in format: 03XX-XXXXXXX');
        return;
    }
    
    // Validate password length
    if (password.length < 6 || password.length > 20) {
        alert('❌ Password must be between 6-20 characters');
        return;
    }
    
    // Show loading state
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    submitBtn.disabled = true;
    
    try {
        // Call backend API
        const result = await callBackend('login', { 
            phone: phone, 
            password: password 
        });
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        if (result.success) {
            // Save to Remember Me
            if (rememberMe.checked) {
                localStorage.setItem('rememberedPhone', phone);
            } else {
                localStorage.removeItem('rememberedPhone');
            }
            
            // Save user data to localStorage for dashboard
            localStorage.setItem('currentUser', JSON.stringify(result.userData));
            
            // Show success message
            alert(`✅ ${result.message}\nWelcome back, ${result.userData.firstName}!`);
            
            // Redirect to dashboard (you'll create this file later)
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            
        } else {
            alert(`❌ ${result.message}`);
        }
    } catch (error) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        alert('❌ Login failed. Please try again.');
        console.error('Login error:', error);
    }
});

// ✅ REGISTRATION FORM SUBMISSION WITH BACKEND
registerFormElement.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const education = document.getElementById('education').value;
    const skills = document.getElementById('skills').value.trim();
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsAccepted = document.getElementById('terms').checked;
    
    // Validate first name
    if (!/^[A-Za-z ]{2,20}$/.test(firstName)) {
        alert('❌ First name must be 2-20 letters only');
        return;
    }
    
    // Validate last name
    if (!/^[A-Za-z ]{2,20}$/.test(lastName)) {
        alert('❌ Last name must be 2-20 letters only');
        return;
    }
    
    // Validate education
    if (!education) {
        alert('❌ Please select your education level');
        return;
    }
    
    // Validate phone
    if (!/^03\d{2}-\d{7}$/.test(phone)) {
        alert('❌ Please enter a valid phone number in format: 03XX-XXXXXXX');
        return;
    }
    
    // Validate password
    if (password.length < 6 || password.length > 20) {
        alert('❌ Password must be between 6-20 characters');
        return;
    }
    
    // Check password match
    if (password !== confirmPassword) {
        alert('❌ Passwords do not match!');
        return;
    }
    
    // Check terms
    if (!termsAccepted) {
        alert('❌ You must agree to the terms and conditions');
        return;
    }
    
    // Show loading state
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitBtn.disabled = true;
    
    try {
        // 1. First check if phone already exists
        const checkResult = await callBackend('checkPhone', { phone });
        
        if (checkResult.exists) {
            alert('❌ This phone number is already registered. Please use a different number or try login.');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        // 2. Upload profile picture if exists
        let profilePicUrl = null;
        if (profilePicInput.files[0]) {
            const reader = new FileReader();
            const base64Image = await new Promise((resolve) => {
                reader.onload = function(e) {
                    resolve(e.target.result);
                };
                reader.readAsDataURL(profilePicInput.files[0]);
            });
            
            // Upload to Drive
            const uploadResult = await callBackend('uploadProfilePic', {
                imageData: base64Image,
                username: `temp_${Date.now()}`
            });
            
            if (uploadResult.success) {
                profilePicUrl = uploadResult.directUrl;
            }
        }
        
        // 3. Prepare user data
        const userData = {
            firstName: firstName,
            lastName: lastName,
            education: education,
            skills: skills || 'Not specified',
            phone: phone,
            password: password, // Note: In production, hash this!
            profilePic: profilePicUrl
        };
        
        // 4. Send to Google Sheets
        const result = await callBackend('register', { userData });
        
        if (result.success) {
            alert(`✅ ${result.message}\nYour username: ${result.username}\nPlease note it down!`);
            
            // Reset form
            registerFormElement.reset();
            previewContainer.style.display = 'none';
            previewContainer.innerHTML = '';
            strengthBar.style.width = '0%';
            strengthBar.style.backgroundColor = '#ef4444';
            strengthText.textContent = 'Password strength';
            strengthText.style.color = '#64748b';
            
            // Switch to login
            setTimeout(() => {
                loginToggle.click();
                // Auto-fill phone in login form
                document.getElementById('loginPhone').value = phone;
            }, 500);
            
        } else {
            alert(`❌ ${result.message}`);
        }
    } catch (error) {
        alert('❌ Registration failed. Please try again.');
        console.error('Registration error:', error);
    } finally {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// ✅ FORGOT PASSWORD FORM SUBMISSION WITH BACKEND
forgotFormElement.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const phone = document.getElementById('forgotPhone').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    // Validate phone
    if (!/^03\d{2}-\d{7}$/.test(phone)) {
        alert('❌ Please enter a valid phone number in format: 03XX-XXXXXXX');
        return;
    }
    
    // Validate password
    if (newPassword.length < 6 || newPassword.length > 20) {
        alert('❌ Password must be between 6-20 characters');
        return;
    }
    
    // Check password match
    if (newPassword !== confirmNewPassword) {
        alert('❌ Passwords do not match!');
        return;
    }
    
    // Show loading
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting...';
    submitBtn.disabled = true;
    
    try {
        // Check if phone exists
        const checkResult = await callBackend('checkPhone', { phone });
        
        if (!checkResult.exists) {
            alert('❌ Phone number not found in our system');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        // Reset password
        const resetResult = await callBackend('resetPassword', { 
            phone, 
            newPassword 
        });
        
        if (resetResult.success) {
            alert('✅ Password reset successful! You can now login with your new password.');
            forgotFormElement.reset();
            loginToggle.click();
            // Auto-fill phone in login form
            document.getElementById('loginPhone').value = phone;
        } else {
            alert(`❌ ${resetResult.message}`);
        }
    } catch (error) {
        alert('❌ Password reset failed. Please try again.');
        console.error('Reset password error:', error);
    } finally {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// ✅ UPDATE USERS COUNT ON PAGE LOAD
async function updateUsersCount() {
    try {
        const result = await callBackend('getUsersCount', {});
        if (result.success) {
            const footer = document.querySelector('.footer');
            
            // Remove existing count if present
            const existingCount = document.getElementById('usersCount');
            if (existingCount) {
                existingCount.remove();
            }
            
            // Add new count
            const countElement = document.createElement('p');
            countElement.id = 'usersCount';
            countElement.innerHTML = `<i class="fas fa-users"></i> ${result.count} Students Registered`;
            footer.insertBefore(countElement, document.querySelector('.copyright'));
        }
    } catch (error) {
        console.log('Could not load users count');
    }
}

// ✅ TEST BACKEND CONNECTION ON LOAD
async function testBackendConnection() {
    try {
        const response = await fetch(BACKEND_URL);
        const data = await response.json();
        console.log('Backend connection test:', data);
        return data.status === 'active';
    } catch (error) {
        console.warn('Backend connection test failed:', error);
        return false;
    }
}

// ✅ INITIALIZE ON PAGE LOAD
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Student Community loaded');
    
    // Test backend connection
    const isConnected = await testBackendConnection();
    if (isConnected) {
        console.log('✅ Backend connected successfully');
    } else {
        console.warn('⚠️ Backend connection issue - using offline mode');
    }
    
    // Update users count
    updateUsersCount();
    
    // Check if there are existing users in localStorage for counter
    const existingUsers = JSON.parse(localStorage.getItem('students')) || [];
    userCounter = existingUsers.length + 1;
});
// Authentication System with LocalStorage

// Initialize users in localStorage if not exists
function initializeStorage() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
}

// Get all users from localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

// Set current user
function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;

    return Math.min(strength, 100);
}

// Update password strength indicator
function updatePasswordStrength(password, strengthFill, strengthText) {
    const strength = checkPasswordStrength(password);
    strengthFill.style.width = strength + '%';

    if (strength < 25) {
        strengthFill.style.background = '#ef4444';
        strengthText.textContent = 'Çok zayıf';
        strengthText.style.color = '#ef4444';
    } else if (strength < 50) {
        strengthFill.style.background = '#f59e0b';
        strengthText.textContent = 'Zayıf';
        strengthText.style.color = '#f59e0b';
    } else if (strength < 75) {
        strengthFill.style.background = '#eab308';
        strengthText.textContent = 'Orta';
        strengthText.style.color = '#eab308';
    } else {
        strengthFill.style.background = '#22c55e';
        strengthText.textContent = 'Güçlü';
        strengthText.style.color = '#22c55e';
    }
}

// Show error message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Clear error message
function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// Clear all errors
function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
}

// Login function
function login(email, password, rememberMe) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const currentUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            rememberMe: rememberMe
        };
        setCurrentUser(currentUser);
        return { success: true, user: currentUser };
    }

    return { success: false, message: 'Email veya şifre hatalı' };
}

// Signup function
function signup(name, email, password) {
    const users = getUsers();

    // Check if user already exists
    if (users.some(u => u.email === email)) {
        return { success: false, message: 'Bu email adresi zaten kullanılıyor' };
    }

    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    // Auto login after signup
    const currentUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        rememberMe: true
    };
    setCurrentUser(currentUser);

    return { success: true, user: currentUser };
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Check authentication
function isAuthenticated() {
    return getCurrentUser() !== null;
}

// Initialize storage
initializeStorage();

// Login page logic
if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    // Password visibility toggle
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.querySelector('.eye-icon').textContent = type === 'password' ? '👁️' : '🙈';
    });

    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearAllErrors();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validation
        if (!email) {
            showError('emailError', 'Email adresi gereklidir');
            return;
        }

        if (!isValidEmail(email)) {
            showError('emailError', 'Geçerli bir email adresi girin');
            return;
        }

        if (!password) {
            showError('passwordError', 'Şifre gereklidir');
            return;
        }

        // Attempt login
        const result = login(email, password, rememberMe);

        if (result.success) {
            // Success animation
            loginForm.style.opacity = '0';
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 300);
        } else {
            showError('passwordError', result.message);
        }
    });
}

// Signup page logic
if (document.getElementById('signupForm')) {
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    // Password visibility toggles
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.querySelector('.eye-icon').textContent = type === 'password' ? '👁️' : '🙈';
    });

    toggleConfirmPassword.addEventListener('click', () => {
        const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
        confirmPasswordInput.type = type;
        toggleConfirmPassword.querySelector('.eye-icon').textContent = type === 'password' ? '👁️' : '🙈';
    });

    // Password strength indicator
    passwordInput.addEventListener('input', () => {
        updatePasswordStrength(passwordInput.value, strengthFill, strengthText);
    });

    // Signup form submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearAllErrors();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;

        // Validation
        if (!name) {
            showError('nameError', 'Ad soyad gereklidir');
            return;
        }

        if (name.length < 2) {
            showError('nameError', 'Ad soyad en az 2 karakter olmalıdır');
            return;
        }

        if (!email) {
            showError('emailError', 'Email adresi gereklidir');
            return;
        }

        if (!isValidEmail(email)) {
            showError('emailError', 'Geçerli bir email adresi girin');
            return;
        }

        if (!password) {
            showError('passwordError', 'Şifre gereklidir');
            return;
        }

        if (password.length < 8) {
            showError('passwordError', 'Şifre en az 8 karakter olmalıdır');
            return;
        }

        if (password !== confirmPassword) {
            showError('confirmPasswordError', 'Şifreler eşleşmiyor');
            return;
        }

        if (!terms) {
            alert('Kullanım şartlarını kabul etmelisiniz');
            return;
        }

        // Attempt signup
        const result = signup(name, email, password);

        if (result.success) {
            // Success animation
            signupForm.style.opacity = '0';
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 300);
        } else {
            showError('emailError', result.message);
        }
    });
}

// Export functions for use in other scripts
window.authUtils = {
    isAuthenticated,
    getCurrentUser,
    logout
};

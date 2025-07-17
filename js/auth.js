// Authentication JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const termsCheckbox = document.getElementById('terms');

    // Show/hide messages
    function showMessage(element, message, type = 'error') {
        element.textContent = message;
        element.classList.add('show');
        element.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideMessage(element);
        }, 5000);
    }

    function hideMessage(element) {
        element.classList.remove('show');
        element.style.display = 'none';
    }

    function hideAllMessages() {
        hideMessage(errorMessage);
        hideMessage(successMessage);
    }

    // Form validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        return password.length >= 8;
    }

    function validateStrongPassword(password) {
        const requirements = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password)
        };
        return requirements;
    }

    function validateName(name) {
        return name.trim().length >= 2 && /^[a-zA-Z\s'-]+$/.test(name.trim());
    }

    function validatePasswordMatch(password, confirmPassword) {
        return password === confirmPassword && password.length > 0;
    }

    function validateForm() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email) {
            showMessage(errorMessage, 'Please enter your email address.');
            emailInput.focus();
            return false;
        }

        if (!validateEmail(email)) {
            showMessage(errorMessage, 'Please enter a valid email address.');
            emailInput.focus();
            return false;
        }

        if (!password) {
            showMessage(errorMessage, 'Please enter your password.');
            passwordInput.focus();
            return false;
        }

        if (!validatePassword(password)) {
            showMessage(errorMessage, 'Password must be at least 6 characters long.');
            passwordInput.focus();
            return false;
        }

        return true;
    }

    // Enhanced loading state
    function setLoadingState(isLoading, button = loginBtn) {
        if (isLoading) {
            button?.classList.add('btn-loading');
            if (button) button.disabled = true;
        } else {
            button?.classList.remove('btn-loading');
            if (button) button.disabled = false;
        }
    }

    // Password requirements indicator
    function updatePasswordRequirements(password) {
        const requirements = validateStrongPassword(password);
        const requirementElements = {
            length: document.getElementById('length'),
            lowercase: document.getElementById('lowercase'),
            uppercase: document.getElementById('uppercase'),
            number: document.getElementById('number')
        };

        Object.keys(requirements).forEach(key => {
            const element = requirementElements[key];
            if (element) {
                if (requirements[key]) {
                    element.classList.add('valid');
                } else {
                    element.classList.remove('valid');
                }
            }
        });
    }

    // Registration form validation
    function validateRegistrationForm() {
        const firstName = firstNameInput?.value.trim();
        const lastName = lastNameInput?.value.trim();
        const email = emailInput?.value.trim();
        const password = passwordInput?.value.trim();
        const confirmPassword = confirmPasswordInput?.value.trim();
        const termsAccepted = termsCheckbox?.checked;

        if (firstName && !validateName(firstName)) {
            showMessage(errorMessage, 'Please enter a valid first name (at least 2 characters, letters only).');
            firstNameInput?.focus();
            return false;
        }

        if (lastName && !validateName(lastName)) {
            showMessage(errorMessage, 'Please enter a valid last name (at least 2 characters, letters only).');
            lastNameInput?.focus();
            return false;
        }

        if (!email) {
            showMessage(errorMessage, 'Please enter your email address.');
            emailInput?.focus();
            return false;
        }

        if (!validateEmail(email)) {
            showMessage(errorMessage, 'Please enter a valid email address.');
            emailInput?.focus();
            return false;
        }

        if (!password) {
            showMessage(errorMessage, 'Please enter a password.');
            passwordInput?.focus();
            return false;
        }

        const passwordRequirements = validateStrongPassword(password);
        if (!passwordRequirements.length || !passwordRequirements.lowercase || !passwordRequirements.uppercase || !passwordRequirements.number) {
            showMessage(errorMessage, 'Password must meet all requirements shown below.');
            passwordInput?.focus();
            return false;
        }

        if (!validatePasswordMatch(password, confirmPassword)) {
            showMessage(errorMessage, 'Passwords do not match.');
            confirmPasswordInput?.focus();
            return false;
        }

        if (!termsAccepted) {
            showMessage(errorMessage, 'You must agree to the Terms of Service and Privacy Policy.');
            return false;
        }

        return true;
    }

    // Form submission enhancement
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            hideAllMessages();
            
            if (!validateForm()) {
                e.preventDefault();
                return false;
            }
            
            setLoadingState(true);
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            hideAllMessages();
            
            if (!validateRegistrationForm()) {
                e.preventDefault();
                return false;
            }
            
            setLoadingState(true, registerBtn);
        });
    }

    // Field error handling
    function showFieldError(input, message) {
        const fieldError = document.getElementById(input.id + '-error');
        if (fieldError) {
            fieldError.textContent = message;
            fieldError.classList.add('show');
            fieldError.style.display = 'block';
        }
        input.classList.add('error');
        input.classList.remove('success');
    }

    function hideFieldError(input) {
        const fieldError = document.getElementById(input.id + '-error');
        if (fieldError) {
            fieldError.classList.remove('show');
            fieldError.style.display = 'none';
        }
        input.classList.remove('error');
    }

    function showFieldSuccess(input) {
        const fieldError = document.getElementById(input.id + '-error');
        if (fieldError) {
            fieldError.classList.remove('show');
            fieldError.style.display = 'none';
        }
        input.classList.remove('error');
        input.classList.add('success');
    }

    // Real-time validation
    emailInput?.addEventListener('blur', function() {
        const email = this.value.trim();
        if (email) {
            if (!validateEmail(email)) {
                showFieldError(this, 'Please enter a valid email address');
            } else {
                showFieldSuccess(this);
            }
        } else {
            hideFieldError(this);
        }
    });

    passwordInput?.addEventListener('blur', function() {
        const password = this.value.trim();
        if (password) {
            if (!validatePassword(password)) {
                showFieldError(this, 'Password must be at least 8 characters long');
            } else {
                showFieldSuccess(this);
            }
        } else {
            hideFieldError(this);
        }
    });

    // Clear validation errors on input
    emailInput?.addEventListener('input', function() {
        hideFieldError(this);
        hideAllMessages();
    });

    passwordInput?.addEventListener('input', function() {
        hideFieldError(this);
        hideAllMessages();
        
        // Update password requirements for registration form
        if (registerForm) {
            updatePasswordRequirements(this.value);
        }
    });

    // Registration form field validation
    firstNameInput?.addEventListener('blur', function() {
        const firstName = this.value.trim();
        if (firstName) {
            if (!validateName(firstName)) {
                showFieldError(this, 'Please enter a valid first name (at least 2 characters, letters only)');
            } else {
                showFieldSuccess(this);
            }
        } else {
            hideFieldError(this);
        }
    });

    lastNameInput?.addEventListener('blur', function() {
        const lastName = this.value.trim();
        if (lastName) {
            if (!validateName(lastName)) {
                showFieldError(this, 'Please enter a valid last name (at least 2 characters, letters only)');
            } else {
                showFieldSuccess(this);
            }
        } else {
            hideFieldError(this);
        }
    });

    confirmPasswordInput?.addEventListener('blur', function() {
        const password = passwordInput?.value.trim();
        const confirmPassword = this.value.trim();
        if (confirmPassword) {
            if (!validatePasswordMatch(password, confirmPassword)) {
                showFieldError(this, 'Passwords do not match');
            } else {
                showFieldSuccess(this);
            }
        } else {
            hideFieldError(this);
        }
    });

    // Clear validation errors on input for registration fields
    firstNameInput?.addEventListener('input', function() {
        hideFieldError(this);
        hideAllMessages();
    });

    lastNameInput?.addEventListener('input', function() {
        hideFieldError(this);
        hideAllMessages();
    });

    confirmPasswordInput?.addEventListener('input', function() {
        hideFieldError(this);
        hideAllMessages();
    });

    // Memberstack integration enhancements
    if (window.$memberstackDom) {
        const memberstack = window.$memberstackDom;
        
        // Listen for authentication events
        memberstack.getCurrentMember().then(({ data: member }) => {
            if (member) {
                // User is already logged in, redirect to dashboard
                window.location.href = 'portal.html';
            }
        });

        // Handle login success
        loginForm?.addEventListener('submit', function(e) {
            setTimeout(() => {
                memberstack.getCurrentMember().then(({ data: member }) => {
                    if (member) {
                        showMessage(successMessage, 'Login successful! Redirecting...', 'success');
                        setTimeout(() => {
                            window.location.href = 'portal.html';
                        }, 1000);
                    } else {
                        setLoadingState(false);
                    }
                }).catch(error => {
                    setLoadingState(false);
                    showMessage(errorMessage, 'Login failed. Please check your credentials and try again.');
                });
            }, 1000);
        });
    }

    // Enhanced Google login
    const googleBtn = document.querySelector('[data-ms-auth-provider="google"]');
    if (googleBtn) {
        googleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            hideAllMessages();
            
            // Add loading state to Google button
            const originalText = this.innerHTML;
            this.innerHTML = '<div class="loading-spinner"></div>Connecting...';
            this.style.pointerEvents = 'none';
            
            // Reset button after timeout
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.pointerEvents = 'auto';
            }, 5000);
        });
    }

    // Password toggle functionality
    function addPasswordToggle(fieldId) {
        const passwordField = document.getElementById(fieldId);
        if (!passwordField) return;

        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'password-toggle';
        toggleBtn.innerHTML = '👁️';
        toggleBtn.setAttribute('aria-label', 'Toggle password visibility');
        
        passwordField.parentNode.style.position = 'relative';
        passwordField.parentNode.appendChild(toggleBtn);
        
        toggleBtn.addEventListener('click', function() {
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                this.innerHTML = '🙈';
            } else {
                passwordField.type = 'password';
                this.innerHTML = '👁️';
            }
        });
    }

    // Add password toggles to all password fields
    addPasswordToggle('password');
    addPasswordToggle('confirmPassword');
    addPasswordToggle('newPassword');
    addPasswordToggle('confirmNewPassword');
});
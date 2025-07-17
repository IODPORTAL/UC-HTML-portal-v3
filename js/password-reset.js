// Password Reset JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const resetPasswordSection = document.getElementById('resetPasswordSection');
    const resetBtn = document.getElementById('resetBtn');
    const updatePasswordBtn = document.getElementById('updatePasswordBtn');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
    const resetTokenInput = document.getElementById('resetToken');
    
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const resetErrorMessage = document.getElementById('resetErrorMessage');
    const resetSuccessMessage = document.getElementById('resetSuccessMessage');

    // Check if there's a reset token in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        // Show reset password form instead of forgot password form
        document.querySelector('.auth-main').style.display = 'none';
        resetPasswordSection.style.display = 'block';
        resetTokenInput.value = token;
    }

    // Show/hide messages
    function showMessage(element, message, type = 'error') {
        element.textContent = message;
        element.classList.add('show');
        element.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                hideMessage(element);
            }, 5000);
        }
    }

    function hideMessage(element) {
        element.classList.remove('show');
        element.style.display = 'none';
    }

    function hideAllMessages() {
        hideMessage(errorMessage);
        hideMessage(successMessage);
        hideMessage(resetErrorMessage);
        hideMessage(resetSuccessMessage);
    }

    // Enhanced loading state
    function setLoadingState(isLoading, button) {
        if (isLoading) {
            button?.classList.add('btn-loading');
            if (button) button.disabled = true;
        } else {
            button?.classList.remove('btn-loading');
            if (button) button.disabled = false;
        }
    }

    // Password requirements indicator for reset form
    function updateResetPasswordRequirements(password) {
        const requirements = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password)
        };

        const requirementElements = {
            length: document.getElementById('reset-length'),
            lowercase: document.getElementById('reset-lowercase'),
            uppercase: document.getElementById('reset-uppercase'),
            number: document.getElementById('reset-number')
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

    // Validation functions
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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

    function validatePasswordMatch(password, confirmPassword) {
        return password === confirmPassword && password.length > 0;
    }

    // Forgot password form validation
    function validateForgotPasswordForm() {
        const email = document.getElementById('email')?.value.trim();

        if (!email) {
            showMessage(errorMessage, 'Please enter your email address.');
            return false;
        }

        if (!validateEmail(email)) {
            showMessage(errorMessage, 'Please enter a valid email address.');
            return false;
        }

        return true;
    }

    // Reset password form validation
    function validateResetPasswordForm() {
        const newPassword = newPasswordInput?.value.trim();
        const confirmNewPassword = confirmNewPasswordInput?.value.trim();

        if (!newPassword) {
            showMessage(resetErrorMessage, 'Please enter a new password.');
            return false;
        }

        const passwordRequirements = validateStrongPassword(newPassword);
        if (!passwordRequirements.length || !passwordRequirements.lowercase || !passwordRequirements.uppercase || !passwordRequirements.number) {
            showMessage(resetErrorMessage, 'Password must meet all requirements shown below.');
            return false;
        }

        if (!validatePasswordMatch(newPassword, confirmNewPassword)) {
            showMessage(resetErrorMessage, 'Passwords do not match.');
            return false;
        }

        return true;
    }

    // Form submission handlers
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            hideAllMessages();
            
            if (!validateForgotPasswordForm()) {
                e.preventDefault();
                return false;
            }
            
            setLoadingState(true, resetBtn);
            
            // Simulate success message (Memberstack will handle the actual sending)
            setTimeout(() => {
                setLoadingState(false, resetBtn);
                showMessage(successMessage, 'Password reset link sent! Check your email for instructions.', 'success');
            }, 2000);
        });
    }

    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', function(e) {
            hideAllMessages();
            
            if (!validateResetPasswordForm()) {
                e.preventDefault();
                return false;
            }
            
            setLoadingState(true, updatePasswordBtn);
        });
    }

    // Real-time validation for reset password form
    newPasswordInput?.addEventListener('input', function() {
        updateResetPasswordRequirements(this.value);
    });

    confirmNewPasswordInput?.addEventListener('blur', function() {
        const newPassword = newPasswordInput?.value.trim();
        const confirmNewPassword = this.value.trim();
        
        if (confirmNewPassword && newPassword !== confirmNewPassword) {
            this.classList.add('error');
        } else {
            this.classList.remove('error');
        }
    });

    confirmNewPasswordInput?.addEventListener('input', function() {
        this.classList.remove('error');
    });

    // Memberstack integration
    if (window.$memberstackDom) {
        const memberstack = window.$memberstackDom;
        
        // Handle forgot password success
        forgotPasswordForm?.addEventListener('submit', function(e) {
            setTimeout(() => {
                // Check if the request was successful
                setLoadingState(false, resetBtn);
                showMessage(successMessage, 'If an account with that email exists, you will receive password reset instructions.', 'success');
            }, 2000);
        });

        // Handle reset password success
        resetPasswordForm?.addEventListener('submit', function(e) {
            setTimeout(() => {
                setLoadingState(false, updatePasswordBtn);
                showMessage(resetSuccessMessage, 'Password updated successfully! You can now log in with your new password.', 'success');
                
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 3000);
            }, 2000);
        });
    }
});
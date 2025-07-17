// Apply Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize application form
    initApplicationForm();
});

function initApplicationForm() {
    const form = document.getElementById('applicationForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-steps .step');
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');
    let currentStep = 1;

    // Cohort data
    const cohortData = {
        'data-science': {
            fulltime: [
                { date: '17th December 2024', status: 'available' },
                { date: '14th January 2025', status: 'filling-fast' },
                { date: '11th February 2025', status: 'available' }
            ],
            parttime: [
                { date: '17th December 2024', status: 'available' },
                { date: '14th January 2025', status: 'available' },
                { date: '11th February 2025', status: 'available' }
            ]
        },
        'cyber-security': {
            fulltime: [
                { date: '8th September 2024', status: 'filling-fast' },
                { date: '6th October 2024', status: 'available' },
                { date: '3rd November 2024', status: 'available' }
            ],
            parttime: [
                { date: '8th September 2024', status: 'available' },
                { date: '6th October 2024', status: 'available' },
                { date: '3rd November 2024', status: 'available' }
            ]
        },
        'software-engineering': {
            fulltime: [
                { date: '6th October 2024', status: 'available' },
                { date: '3rd November 2024', status: 'filling-fast' },
                { date: '1st December 2024', status: 'available' }
            ],
            parttime: [
                { date: '6th October 2024', status: 'available' },
                { date: '3rd November 2024', status: 'available' },
                { date: '1st December 2024', status: 'available' }
            ]
        }
    };

    // Next button handlers
    nextBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (validateCurrentStep(currentStep)) {
                if (currentStep < steps.length) {
                    currentStep++;
                    showStep(currentStep);
                    updateProgressSteps();
                    
                    // Update cohort options when reaching step 4
                    if (currentStep === 4) {
                        updateCohortOptions();
                    }
                }
            }
        });
    });

    // Previous button handlers
    prevBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
                updateProgressSteps();
            }
        });
    });

    // Progress step click handlers
    progressSteps.forEach((step, index) => {
        step.addEventListener('click', function() {
            const stepNumber = index + 1;
            if (stepNumber < currentStep || validateStepsUpTo(stepNumber - 1)) {
                currentStep = stepNumber;
                showStep(currentStep);
                updateProgressSteps();
                
                if (currentStep === 4) {
                    updateCohortOptions();
                }
            }
        });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateCurrentStep(currentStep)) {
            submitApplication();
        }
    });

    // Programme selection handler
    const programmeInputs = document.querySelectorAll('input[name="programme"]');
    programmeInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (currentStep === 4) {
                updateCohortOptions();
            }
        });
    });

    // Study mode handler
    const studyModeSelect = document.getElementById('studyMode');
    if (studyModeSelect) {
        studyModeSelect.addEventListener('change', function() {
            updateCohortOptions();
        });
    }

    function showStep(stepNumber) {
        // Hide all steps
        steps.forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        const currentStepElement = document.querySelector(`[data-step="${stepNumber}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
    }

    function updateProgressSteps() {
        progressSteps.forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber === currentStep) {
                step.classList.add('active');
            } else if (stepNumber < currentStep) {
                step.classList.add('completed');
            }
        });
    }

    function validateCurrentStep(stepNumber) {
        const currentStepElement = document.querySelector(`[data-step="${stepNumber}"]`);
        if (!currentStepElement) return false;

        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            // Remove previous error styling
            field.classList.remove('error');
            
            if (field.type === 'radio') {
                const radioGroup = currentStepElement.querySelectorAll(`[name="${field.name}"]`);
                const isChecked = Array.from(radioGroup).some(radio => radio.checked);
                if (!isChecked) {
                    isValid = false;
                    // Add error styling to radio group container
                    const container = field.closest('.programme-selection') || field.closest('.cohort-options');
                    if (container) {
                        container.classList.add('error');
                    }
                }
            } else if (field.type === 'checkbox') {
                if (!field.checked) {
                    isValid = false;
                    field.classList.add('error');
                }
            } else {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                }
            }
        });

        if (!isValid) {
            // Show error message
            showErrorMessage('Please fill in all required fields.');
        }

        return isValid;
    }

    function validateStepsUpTo(stepNumber) {
        for (let i = 1; i <= stepNumber; i++) {
            if (!validateCurrentStep(i)) {
                return false;
            }
        }
        return true;
    }

    function updateCohortOptions() {
        const selectedProgramme = document.querySelector('input[name="programme"]:checked');
        const studyMode = document.getElementById('studyMode').value;
        const cohortOptionsContainer = document.querySelector('.cohort-options');

        if (!selectedProgramme || !studyMode || !cohortOptionsContainer) {
            return;
        }

        const programmeValue = selectedProgramme.value;
        const cohorts = cohortData[programmeValue] && cohortData[programmeValue][studyMode];

        if (!cohorts) {
            cohortOptionsContainer.innerHTML = '<p>No cohorts available for selected options.</p>';
            return;
        }

        cohortOptionsContainer.innerHTML = '';

        cohorts.forEach((cohort, index) => {
            const cohortOption = document.createElement('div');
            cohortOption.className = 'cohort-option';
            
            const cohortId = `cohort-${programmeValue}-${studyMode}-${index}`;
            
            cohortOption.innerHTML = `
                <input type="radio" id="${cohortId}" name="cohort" value="${cohort.date}" required>
                <label for="${cohortId}" class="cohort-card">
                    <div class="cohort-info">
                        <span class="cohort-date">${cohort.date}</span>
                        <span class="cohort-status ${cohort.status}">${getStatusText(cohort.status)}</span>
                    </div>
                </label>
            `;

            cohortOptionsContainer.appendChild(cohortOption);
        });
    }

    function getStatusText(status) {
        switch (status) {
            case 'available':
                return 'Available';
            case 'filling-fast':
                return 'Filling Fast';
            case 'waitlist':
                return 'Waitlist Only';
            default:
                return 'Available';
        }
    }

    function showErrorMessage(message) {
        // Remove existing error messages
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Create and show error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background: #f8d7da;
            color: #721c24;
            padding: 1rem;
            border-radius: 4px;
            margin-bottom: 1rem;
            border: 1px solid #f5c6cb;
        `;
        errorDiv.textContent = message;

        const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.insertBefore(errorDiv, currentStepElement.firstChild.nextSibling);
        }

        // Remove error message after 5 seconds
        setTimeout(() => {
            if (errorDiv && errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            background: #d4edda;
            color: #155724;
            padding: 1.5rem;
            border-radius: 8px;
            margin: 2rem 0;
            border: 1px solid #c3e6cb;
            text-align: center;
            font-weight: 600;
        `;
        successDiv.textContent = message;

        const formContainer = document.querySelector('.application-form');
        formContainer.innerHTML = '';
        formContainer.appendChild(successDiv);
    }

    function submitApplication() {
        // Collect form data
        const formData = new FormData(form);
        const applicationData = {};

        for (let [key, value] of formData.entries()) {
            applicationData[key] = value;
        }

        // Add timestamp
        applicationData.submittedAt = new Date().toISOString();

        // Simulate API submission
        console.log('Application submitted:', applicationData);

        // Show success message
        showSuccessMessage('Thank you for your application! We will review your submission and contact you within 2 business days to discuss the next steps.');

        // In a real application, you would send the data to your backend
        // Example:
        // fetch('/api/applications', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(applicationData)
        // });
    }

    // Add CSS for error styling
    const style = document.createElement('style');
    style.textContent = `
        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
            border-color: #dc3545;
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
        }
        
        .programme-selection.error .programme-card,
        .cohort-options.error .cohort-card {
            border-color: #dc3545;
        }
        
        .checkbox-label input[type="checkbox"].error + .checkmark {
            border-color: #dc3545;
        }
    `;
    document.head.appendChild(style);
}
// Portal JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Memberstack
    window.$memberstackDom.getCurrentMember()
        .then(({ data: member }) => {
            if (!member) {
                window.location.href = '/login';
                return;
            }
            initializePortal(member);
        })
        .catch(error => {
            console.error('Memberstack error:', error);
            window.location.href = '/login';
        });
});

function initializePortal(member) {
    // Get user stage from custom fields - ensure it's a number
    const userStage = parseInt(member.customFields?.stage) || 1;
    
    console.log('User stage:', userStage); // Debug log
    console.log('Member custom fields:', member.customFields); // Debug log
    
    // Update welcome message with user's first name
    const firstName = member.customFields?.['first-name'] || member.auth?.email?.split('@')[0] || '';
    
    // Update welcome message
    const welcomeElement = document.getElementById('user-firstname');
    if (welcomeElement && firstName) {
        welcomeElement.textContent = firstName;
    }
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize submenu
    initializeSubmenu();
    
    // Load content based on stage
    loadContentByStage(userStage);
    
    // Load dashboard content based on stage
    loadDashboardContent(member);
    
    // Update user info
    updateUserInfo(member);
    
    // Initialize tab navigation
    initializeTabs();
    
    // Load career consultation content
    loadCareerConsultation();
    
    // Store member globally for debugging
    window.currentMember = member;
}

function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    const pages = document.querySelectorAll('.portal-page');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetPage = this.getAttribute('data-page');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show target page
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(targetPage).classList.add('active');
            
            // Update URL hash without triggering scroll
            history.pushState(null, null, '#' + targetPage);
            
            // Scroll to top of content
            window.scrollTo(0, 0);
        });
    });
    
    // Handle initial hash
    const initialHash = window.location.hash.slice(1) || 'dashboard';
    const initialNav = document.querySelector(`[data-page="${initialHash}"]`);
    if (initialNav) {
        initialNav.click();
    }
    
    // Prevent default hash behavior on page load
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 0);
}

function initializeSubmenu() {
    const submenuItems = document.querySelectorAll('.has-submenu');
    
    submenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.closest('.submenu')) return;
            
            e.preventDefault();
            this.classList.toggle('open');
        });
    });
    
    // Handle submenu item clicks
    const submenuLinks = document.querySelectorAll('.submenu .nav-item');
    submenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
}

function loadContentByStage(stage) {
    // Load eligibility content
    loadEligibilityContent(stage);
    
    // Load apply content
    loadApplyContent(stage);
}

function loadDashboardContent(member) {
    const dashboardCards = document.getElementById('dashboard-cards');
    if (!dashboardCards) return;
    
    const stage = parseInt(member.customFields?.stage) || 1;
    
    // Build dashboard content based on stage
    let dashboardHTML = '';
    
    // Get Started Card - varies by stage
    if (stage === 0) {
        // Ineligible - show career consultation
        dashboardHTML += `
            <div class="card">
                <div class="card-icon">
                    <i class="fas fa-comments"></i>
                </div>
                <h3>Career Consultation</h3>
                <p>Our career advisors can help you find the right path for your tech journey.</p>
                <a href="#career-consultation" class="btn btn-primary">Contact Career Advisor</a>
            </div>
        `;
    } else if (stage === 1) {
        // New user - show eligibility check
        dashboardHTML += `
            <div class="card">
                <div class="card-icon">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <h3>Get Started</h3>
                <p>Check your eligibility for our programs and begin your application process.</p>
                <a href="#eligibility" class="btn btn-primary">Check Eligibility</a>
            </div>
        `;
    } else if (stage >= 2) {
        // Eligible or Enrolled - show success message
        dashboardHTML += `
            <div class="card">
                <div class="card-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>You're Eligible!</h3>
                <p>Congratulations! You meet the requirements for our programs. View upcoming cohorts and start your application.</p>
                <div class="eligible-info">
                    <span class="badge-success">✓ Eligibility Confirmed</span>
                </div>
            </div>
        `;
    }
    
    // Application Status Card - varies by stage
    if (stage === 0) {
        dashboardHTML += `
            <div class="card">
                <div class="card-icon">
                    <i class="fas fa-clipboard-list"></i>
                </div>
                <h3>Application Status</h3>
                <p>Schedule a consultation to discuss your eligibility and application options.</p>
                <div class="status-indicator">
                    <span class="status-badge ineligible">Consultation Needed</span>
                </div>
            </div>
        `;
    } else if (stage === 1) {
        dashboardHTML += `
            <div class="card">
                <div class="card-icon">
                    <i class="fas fa-clipboard-list"></i>
                </div>
                <h3>Application Status</h3>
                <p>Complete the eligibility check to begin your application.</p>
                <div class="status-indicator">
                    <span class="status-badge">Not Started</span>
                </div>
            </div>
        `;
    } else if (stage === 2) {
        dashboardHTML += `
            <div class="card">
                <div class="card-icon">
                    <i class="fas fa-clipboard-list"></i>
                </div>
                <h3>Application Status</h3>
                <p>You're eligible! Start your application now.</p>
                <div class="status-indicator">
                    <span class="status-badge eligible">Ready to Apply</span>
                </div>
                <a href="#apply" class="btn btn-primary" style="margin-top: 1rem;">Start Application</a>
            </div>
        `;
    } else if (stage === 3) {
        dashboardHTML += `
            <div class="card">
                <div class="card-icon">
                    <i class="fas fa-clipboard-list"></i>
                </div>
                <h3>Application Status</h3>
                <p>Your application has been approved and you're enrolled!</p>
                <div class="status-indicator">
                    <span class="status-badge enrolled">Enrolled</span>
                </div>
            </div>
        `;
    }
    
    // Course Resources Card - always show
    dashboardHTML += `
        <div class="card">
            <div class="card-icon">
                <i class="fas fa-book-open"></i>
            </div>
            <h3>Course Resources</h3>
            <p>Access course outlines and career consultation resources.</p>
            <a href="#course-outlines" class="btn btn-secondary">View Resources</a>
        </div>
    `;
    
    dashboardCards.innerHTML = dashboardHTML;
}

function loadEligibilityContent(stage) {
    const eligibilityContent = document.getElementById('eligibility-content');
    
    if (stage === 0) {
        // Show ineligible message
        eligibilityContent.innerHTML = `
            <div class="card">
                <div class="card-icon">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <h3>Additional Support Needed</h3>
                <p>Based on your responses, we recommend speaking with a career advisor to explore the best pathway for your tech career journey.</p>
                
                <div class="advisor-info">
                    <h4>Next Steps:</h4>
                    <p>Our career advisors can help you:</p>
                    <ul>
                        <li>Identify prerequisite courses or skills needed</li>
                        <li>Explore alternative program options</li>
                        <li>Create a personalized learning path</li>
                        <li>Discuss flexible scheduling options</li>
                    </ul>
                </div>
                
                <div class="action-buttons">
                    <a href="#career-consultation" class="btn btn-primary">
                        <i class="fas fa-calendar-check"></i>
                        Book Career Consultation
                    </a>
                    <button onclick="resetEligibilityCheck()" class="btn btn-secondary">
                        <i class="fas fa-redo"></i>
                        Try Again
                    </button>
                </div>
            </div>
        `;
    } else if (stage === 1) {
        // Show eligibility checker form
        eligibilityContent.innerHTML = `
            <div class="card">
                <div class="eligibility-intro">
                    <p><strong>Let's check if you're ready to start your tech journey!</strong></p>
                    <p>Answer these quick questions to see if you meet the program requirements.</p>
                </div>
                
                <form id="eligibility-form">
                    <div class="form-group">
                        <label class="form-label" for="education-level">
                            <i class="fas fa-graduation-cap"></i>
                            What is your highest level of education?
                        </label>
                        <select class="form-control" id="education-level" required>
                            <option value="">Select your education level</option>
                            <option value="high-school">High School Diploma</option>
                            <option value="some-college">Some College (No Degree)</option>
                            <option value="associate">Associate Degree</option>
                            <option value="bachelor">Bachelor's Degree</option>
                            <option value="master">Master's Degree or Higher</option>
                            <option value="professional">Professional Qualification</option>
                        </select>
                        <small class="form-hint">We require a minimum of a Bachelor's degree or equivalent professional qualification</small>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="time-commitment">
                            <i class="fas fa-clock"></i>
                            Can you commit to the required study hours?
                        </label>
                        <select class="form-control" id="time-commitment" required>
                            <option value="">Select your availability</option>
                            <option value="fulltime-yes">Yes - I can commit 40+ hours/week (Full-time)</option>
                            <option value="parttime-yes">Yes - I can commit 20+ hours/week (Part-time)</option>
                            <option value="unsure">I'm not sure about my availability</option>
                            <option value="no">No - I cannot commit to these hours currently</option>
                        </select>
                        <small class="form-hint">Our programs require dedicated study time for successful completion</small>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="program-preference">
                            <i class="fas fa-laptop-code"></i>
                            Which program format interests you most?
                        </label>
                        <div class="radio-group">
                            <label class="radio-option">
                                <input type="radio" name="program-format" value="fulltime" required>
                                <span class="radio-label">
                                    <strong>Full-time Intensive</strong>
                                    <small>12 weeks, Monday-Friday, 9am-5pm</small>
                                </span>
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="program-format" value="parttime" required>
                                <span class="radio-label">
                                    <strong>Part-time Flexible</strong>
                                    <small>24 weeks, Evenings & Weekends</small>
                                </span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary btn-lg">
                            <i class="fas fa-check-circle"></i>
                            Check My Eligibility
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        // Handle form submission
        document.getElementById('eligibility-form').addEventListener('submit', handleEligibilitySubmit);
    } else if (stage >= 2) {
        // Show eligible message
        eligibilityContent.innerHTML = `
            <div class="card">
                <div class="success-animation">
                    <div class="card-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                </div>
                <h3>Congratulations! You're Eligible!</h3>
                <p>You meet all the requirements for our programs. You're ready to take the next step in your tech career journey.</p>
                
                <div class="next-steps">
                    <h4>Ready to Apply?</h4>
                    <p>Choose your program and secure your spot in the next cohort.</p>
                    <a href="#apply" class="btn btn-primary btn-lg">
                        <i class="fas fa-arrow-right"></i>
                        Start Application
                    </a>
                </div>
            </div>
        `;
    }
}

function loadApplyContent(stage) {
    const applyContent = document.getElementById('apply-content');
    
    if (stage < 2) {
        // Not eligible yet
        applyContent.innerHTML = `
            <div class="card">
                <p>Please complete the eligibility check first to access the application.</p>
                <a href="#eligibility" class="btn btn-primary">Check Eligibility</a>
            </div>
        `;
    } else if (stage === 2) {
        // Eligible, can apply
        applyContent.innerHTML = `
            <div class="apply-container">
                <!-- Progress Indicator -->
                <div class="progress-indicator">
                    <div class="progress-step active" data-step="1">
                        <div class="step-number">1</div>
                        <div class="step-label">Select Program</div>
                    </div>
                    <div class="progress-line"></div>
                    <div class="progress-step" data-step="2">
                        <div class="step-number">2</div>
                        <div class="step-label">Choose Cohort</div>
                    </div>
                    <div class="progress-line"></div>
                    <div class="progress-step" data-step="3">
                        <div class="step-number">3</div>
                        <div class="step-label">Payment</div>
                    </div>
                </div>
                
                <div class="card">
                    <div id="apply-step-1" class="apply-step active">
                        <h3>Step 1: Select Your Program</h3>
                        <p class="step-description">Choose the program that aligns with your career goals</p>
                        
                        <div class="course-selection">
                            <label class="course-option">
                                <input type="radio" name="course" value="data-science">
                                <div class="course-card">
                                    <div class="course-icon">
                                        <i class="fas fa-chart-line"></i>
                                    </div>
                                    <h4>Data Science & AI</h4>
                                    <p>Master data analysis, machine learning, and AI fundamentals</p>
                                    <ul class="course-highlights">
                                        <li>Python & R Programming</li>
                                        <li>Machine Learning & Deep Learning</li>
                                        <li>Data Visualization & Statistics</li>
                                    </ul>
                                </div>
                            </label>
                            
                            <label class="course-option">
                                <input type="radio" name="course" value="software-engineering">
                                <div class="course-card">
                                    <div class="course-icon">
                                        <i class="fas fa-code"></i>
                                    </div>
                                    <h4>Software Engineering</h4>
                                    <p>Learn full-stack development and modern programming practices</p>
                                    <ul class="course-highlights">
                                        <li>Frontend & Backend Development</li>
                                        <li>Cloud Computing & DevOps</li>
                                        <li>Agile Methodologies</li>
                                    </ul>
                                </div>
                            </label>
                            
                            <label class="course-option">
                                <input type="radio" name="course" value="cyber-security">
                                <div class="course-card">
                                    <div class="course-icon">
                                        <i class="fas fa-shield-alt"></i>
                                    </div>
                                    <h4>Cyber Security</h4>
                                    <p>Develop skills in security analysis and threat prevention</p>
                                    <ul class="course-highlights">
                                        <li>Network Security & Cryptography</li>
                                        <li>Ethical Hacking & Penetration Testing</li>
                                        <li>Security Compliance & Risk Management</li>
                                    </ul>
                                </div>
                            </label>
                        </div>
                        
                        <div class="step-actions">
                            <button class="btn btn-primary" onclick="moveToStep2()" disabled id="step1-continue">
                                Continue to Cohort Selection
                                <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div id="apply-step-2" class="apply-step" style="display: none;">
                        <!-- Step 2 content will be loaded here -->
                    </div>
                    
                    <div id="apply-step-3" class="apply-step" style="display: none;">
                        <!-- Step 3 content will be loaded here -->
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners for course selection
        setTimeout(() => {
            const courseInputs = document.querySelectorAll('input[name="course"]');
            const continueBtn = document.getElementById('step1-continue');
            
            courseInputs.forEach(input => {
                input.addEventListener('change', function() {
                    continueBtn.disabled = false;
                    continueBtn.classList.add('btn-ready');
                });
            });
        }, 100);
    } else {
        // Already enrolled
        applyContent.innerHTML = `
            <div class="card">
                <div class="card-icon">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <h3>You're Enrolled!</h3>
                <p>Thank you for your payment. Our admissions team will contact you within 24 hours with next steps.</p>
                <p><strong>What happens next:</strong></p>
                <ul>
                    <li>You'll receive a welcome email with important information</li>
                    <li>An admissions advisor will schedule your orientation call</li>
                    <li>You'll get access to pre-course materials</li>
                </ul>
            </div>
        `;
    }
}

async function handleEligibilitySubmit(e) {
    e.preventDefault();
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking eligibility...';
    
    // Get form values
    const education = document.getElementById('education-level').value;
    const commitment = document.getElementById('time-commitment').value;
    const programFormat = document.querySelector('input[name="program-format"]:checked')?.value;
    
    // Simulate processing delay for better UX
    setTimeout(async () => {
        try {
            // Check eligibility criteria
            const hasRequiredEducation = ['bachelor', 'master', 'professional'].includes(education);
            const canCommitTime = ['fulltime-yes', 'parttime-yes'].includes(commitment);
            
            let newStage;
            if (hasRequiredEducation && canCommitTime) {
                // Eligible
                newStage = 2;
            } else {
                // Not eligible - need to speak to career advisor
                newStage = 0;
            }
            
            // Update Memberstack custom field
            await window.$memberstackDom.updateMember({
                customFields: {
                    stage: newStage,
                    'preferred-format': programFormat || '',
                    'education-level': education,
                    'time-availability': commitment
                }
            });
            
            // Show appropriate message with animation
            if (newStage === 2) {
                // Success animation
                showNotification('success', 'Congratulations! You are eligible for our programs.');
            } else {
                // Show guidance for ineligible users
                showNotification('info', 'Let\'s explore alternative pathways for your tech journey.');
            }
            
            // Reload page after a short delay to ensure Memberstack data is updated
            setTimeout(() => {
                // Keep the current hash to stay on the eligibility page
                window.location.href = window.location.pathname + '#eligibility';
                window.location.reload();
            }, 1500);
            
        } catch (error) {
            console.error('Error updating member:', error);
            showNotification('error', 'An error occurred. Please try again.');
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    }, 800);
}

// Add reset function for eligibility check
window.resetEligibilityCheck = async function() {
    try {
        // Reset stage to 1
        await window.$memberstackDom.updateMember({
            customFields: {
                stage: 1
            }
        });
        
        showNotification('info', 'Resetting eligibility check...');
        
        // Reload page after a short delay
        setTimeout(() => {
            window.location.href = window.location.pathname + '#eligibility';
            window.location.reload();
        }, 1000);
    } catch (error) {
        console.error('Error resetting eligibility:', error);
        showNotification('error', 'An error occurred. Please refresh the page.');
    }
};

// Notification system
function showNotification(type, message) {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

function updateUserInfo(member) {
    const userInfo = document.getElementById('user-info');
    if (!userInfo) return;
    
    // Get user stage and status
    const stage = parseInt(member.customFields?.stage) || 1;
    let statusText, statusClass;
    
    switch(stage) {
        case 0:
            statusText = 'Ineligible - Consultation Recommended';
            statusClass = 'status-ineligible';
            break;
        case 1:
            statusText = 'New Applicant';
            statusClass = 'status-new';
            break;
        case 2:
            statusText = 'Eligible - Ready to Apply';
            statusClass = 'status-eligible';
            break;
        case 3:
            statusText = 'Enrolled Student';
            statusClass = 'status-enrolled';
            break;
        default:
            statusText = 'Unknown';
            statusClass = '';
    }
    
    // Build comprehensive profile
    const profileContent = document.querySelector('.profile-content');
    if (profileContent) {
        profileContent.innerHTML = `
            <!-- Account Overview -->
            <div class="profile-section">
                <h3>Account Overview</h3>
                <div class="profile-grid">
                    <div class="profile-card">
                        <div class="profile-icon">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="profile-details">
                            <label>Full Name</label>
                            <p>${member.customFields?.['first-name'] || ''} ${member.customFields?.['last-name'] || 'Not provided'}</p>
                        </div>
                    </div>
                    
                    <div class="profile-card">
                        <div class="profile-icon">
                            <i class="fas fa-envelope"></i>
                        </div>
                        <div class="profile-details">
                            <label>Email Address</label>
                            <p>${member.auth.email}</p>
                        </div>
                    </div>
                    
                    <div class="profile-card">
                        <div class="profile-icon">
                            <i class="fas fa-phone"></i>
                        </div>
                        <div class="profile-details">
                            <label>Phone Number</label>
                            <p>${member.customFields?.phone || 'Not provided'}</p>
                        </div>
                    </div>
                    
                </div>
            </div>
            
            <!-- Application Status -->
            <div class="profile-section">
                <h3>Application Status</h3>
                <div class="status-overview">
                    <div class="status-indicator-large ${statusClass}">
                        <i class="fas fa-${stage === 3 ? 'graduation-cap' : stage === 2 ? 'check-circle' : stage === 0 ? 'exclamation-circle' : 'clock'}"></i>
                        <span>${statusText}</span>
                    </div>
                    
                    ${stage === 2 ? `
                        <div class="status-action">
                            <p>You're eligible to apply for our programs!</p>
                            <a href="#apply" class="btn btn-primary">Continue Application</a>
                        </div>
                    ` : stage === 1 ? `
                        <div class="status-action">
                            <p>Start by checking your eligibility for our programs.</p>
                            <a href="#eligibility" class="btn btn-primary">Check Eligibility</a>
                        </div>
                    ` : stage === 0 ? `
                        <div class="status-action">
                            <p>Book a free consultation to discuss your options.</p>
                            <a href="#career-consultation" class="btn btn-primary">Book Consultation</a>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Progress Timeline -->
                <div class="progress-timeline">
                    <div class="timeline-item ${stage >= 1 ? 'completed' : ''}">
                        <div class="timeline-marker">
                            <i class="fas fa-user-plus"></i>
                        </div>
                        <div class="timeline-content">
                            <h4>Account Created</h4>
                            <p>Welcome to UC Online</p>
                        </div>
                    </div>
                    
                    <div class="timeline-item ${stage >= 2 ? 'completed' : ''} ${stage === 1 ? 'current' : ''}">
                        <div class="timeline-marker">
                            <i class="fas fa-clipboard-check"></i>
                        </div>
                        <div class="timeline-content">
                            <h4>Eligibility Check</h4>
                            <p>${stage >= 2 ? 'Completed - You are eligible!' : 'Pending'}</p>
                        </div>
                    </div>
                    
                    <div class="timeline-item ${stage >= 3 ? 'completed' : ''} ${stage === 2 ? 'current' : ''}">
                        <div class="timeline-marker">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <div class="timeline-content">
                            <h4>Application & Payment</h4>
                            <p>${stage >= 3 ? 'Completed' : 'Not started'}</p>
                        </div>
                    </div>
                    
                    <div class="timeline-item ${stage >= 3 ? 'completed current' : ''}">
                        <div class="timeline-marker">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <div class="timeline-content">
                            <h4>Enrollment</h4>
                            <p>${stage >= 3 ? 'Active Student' : 'Not enrolled'}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Enrollment Details (if enrolled) -->
            ${stage === 3 ? `
                <div class="profile-section">
                    <h3>Enrollment Details</h3>
                    <div class="enrollment-info">
                        <div class="info-row">
                            <label>Program:</label>
                            <span>${member.customFields?.['enrolled-course'] || 'Not specified'}</span>
                        </div>
                        <div class="info-row">
                            <label>Cohort:</label>
                            <span>${member.customFields?.['enrolled-cohort'] || 'Not specified'}</span>
                        </div>
                        <div class="info-row">
                            <label>Start Date:</label>
                            <span>${member.customFields?.['cohort-start-date'] || 'March 2025'}</span>
                        </div>
                        <div class="info-row">
                            <label>Payment Status:</label>
                            <span class="payment-paid"><i class="fas fa-check-circle"></i> Paid</span>
                        </div>
                    </div>
                </div>
            ` : ''}
            
            <!-- Account Settings -->
            <div class="profile-section">
                <h3>Account Settings</h3>
                <div class="settings-options">
                    <button class="btn btn-secondary" onclick="editProfile()">
                        <i class="fas fa-edit"></i> Edit Profile
                    </button>
                    <button class="btn btn-secondary" onclick="changePassword()">
                        <i class="fas fa-key"></i> Change Password
                    </button>
                    ${member.customFields?.['consultation-requested'] === 'true' ? `
                        <button class="btn btn-secondary" disabled>
                            <i class="fas fa-calendar-check"></i> Consultation Requested
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

// Profile editing functions
window.editProfile = function() {
    showNotification('info', 'Profile editing feature coming soon!');
};

window.changePassword = function() {
    showNotification('info', 'Please use the password reset link sent to your email.');
};

function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContent = document.querySelector('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active tab
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const course = this.getAttribute('data-course');
            loadCourseOutline(course);
        });
    });
    
    // Load first tab by default
    if (tabBtns.length > 0) {
        tabBtns[0].click();
    }
}

function loadCourseOutline(course) {
    const tabContent = document.querySelector('.tab-content');
    
    // Course outline information
    const courseInfo = {
        'data-science': {
            title: 'Data Science & AI Professional Certificate',
            description: 'Transform raw data into actionable insights with our comprehensive data science program.',
            pdfUrl: 'https://drive.google.com/file/d/1abc123def456/preview', // Replace with actual URL
            highlights: [
                'Python & R Programming Fundamentals',
                'Statistical Analysis & Machine Learning',
                'Deep Learning & Neural Networks',
                'Data Visualization with Tableau & PowerBI',
                'Real-world Industry Projects'
            ]
        },
        'software-engineering': {
            title: 'Software Engineering Professional Certificate',
            description: 'Master full-stack development and modern software engineering practices.',
            pdfUrl: 'https://drive.google.com/file/d/2ghi789jkl012/preview', // Replace with actual URL
            highlights: [
                'Frontend Development (React, Vue, Angular)',
                'Backend Development (Node.js, Python, Java)',
                'Cloud Computing & DevOps',
                'Database Design & Management',
                'Agile & Scrum Methodologies'
            ]
        },
        'cyber-security': {
            title: 'Cyber Security Professional Certificate',
            description: 'Protect digital assets and become a cybersecurity expert.',
            pdfUrl: 'https://drive.google.com/file/d/3mno345pqr678/preview', // Replace with actual URL
            highlights: [
                'Network Security Fundamentals',
                'Ethical Hacking & Penetration Testing',
                'Security Operations & Incident Response',
                'Cloud Security & Compliance',
                'Security Architecture & Risk Management'
            ]
        }
    };
    
    const info = courseInfo[course];
    
    tabContent.innerHTML = `
        <div class="course-outline-content">
            <div class="outline-header">
                <h4>${info.title}</h4>
                <p>${info.description}</p>
            </div>
            
            <div class="outline-highlights">
                <h5>What You'll Learn:</h5>
                <ul>
                    ${info.highlights.map(item => `<li><i class="fas fa-check-circle"></i> ${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="pdf-viewer">
                <div class="pdf-actions">
                    <a href="${info.pdfUrl.replace('/preview', '/view')}" target="_blank" class="btn btn-secondary">
                        <i class="fas fa-external-link-alt"></i> Open in New Tab
                    </a>
                    <a href="${info.pdfUrl.replace('/preview', '/export?format=pdf')}" download class="btn btn-secondary">
                        <i class="fas fa-download"></i> Download PDF
                    </a>
                </div>
                <div class="pdf-container">
                    <iframe 
                        src="${info.pdfUrl}" 
                        width="100%" 
                        height="800" 
                        frameborder="0"
                        title="${info.title} Course Outline"
                        loading="lazy">
                    </iframe>
                </div>
            </div>
        </div>
    `;
}

// Additional functions for apply flow
window.moveToStep2 = function() {
    const selectedCourse = document.querySelector('input[name="course"]:checked');
    if (!selectedCourse) {
        showNotification('error', 'Please select a course to continue.');
        return;
    }
    
    // Update progress indicator
    updateProgressIndicator(2);
    
    // Animate transition
    const step1 = document.getElementById('apply-step-1');
    const step2 = document.getElementById('apply-step-2');
    
    step1.style.opacity = '0';
    setTimeout(() => {
        step1.style.display = 'none';
        step2.style.display = 'block';
        step2.style.opacity = '0';
        
        // Load step 2 content with course-specific cohorts
        const courseName = selectedCourse.parentElement.querySelector('h4').textContent;
        step2.innerHTML = `
            <h3>Step 2: Select Your Cohort</h3>
            <p class="step-description">Choose your preferred schedule for <strong>${courseName}</strong></p>
            
            <div class="cohort-selection">
                <label class="cohort-option">
                    <input type="radio" name="cohort" value="fulltime-march">
                    <div class="cohort-card">
                        <div class="cohort-header">
                            <h4>Full-time Intensive</h4>
                            <span class="cohort-badge">Most Popular</span>
                        </div>
                        <div class="cohort-details">
                            <div class="detail-item">
                                <i class="fas fa-calendar"></i>
                                <span><strong>Start:</strong> March 3, 2025</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-clock"></i>
                                <span><strong>Schedule:</strong> Mon-Fri, 9am-5pm NZST</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-hourglass-half"></i>
                                <span><strong>Duration:</strong> 12 weeks</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-users"></i>
                                <span><strong>Class Size:</strong> Max 25 students</span>
                            </div>
                        </div>
                        <p class="cohort-description">Immersive learning experience with daily live sessions and hands-on projects</p>
                    </div>
                </label>
                
                <label class="cohort-option">
                    <input type="radio" name="cohort" value="parttime-march">
                    <div class="cohort-card">
                        <div class="cohort-header">
                            <h4>Part-time Flexible</h4>
                            <span class="cohort-badge flexible">Work-Friendly</span>
                        </div>
                        <div class="cohort-details">
                            <div class="detail-item">
                                <i class="fas fa-calendar"></i>
                                <span><strong>Start:</strong> March 10, 2025</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-clock"></i>
                                <span><strong>Schedule:</strong> Evenings & Weekends</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-hourglass-half"></i>
                                <span><strong>Duration:</strong> 24 weeks</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-users"></i>
                                <span><strong>Class Size:</strong> Max 25 students</span>
                            </div>
                        </div>
                        <p class="cohort-description">Balance your career transition with current commitments</p>
                    </div>
                </label>
            </div>
            
            <div class="step-actions">
                <button class="btn btn-secondary" onclick="backToStep1()">
                    <i class="fas fa-arrow-left"></i>
                    Back
                </button>
                <button class="btn btn-primary" onclick="moveToStep3()" disabled id="step2-continue">
                    Continue to Payment
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `;
        
        setTimeout(() => {
            step2.style.opacity = '1';
            
            // Add event listeners for cohort selection
            const cohortInputs = document.querySelectorAll('input[name="cohort"]');
            const continueBtn = document.getElementById('step2-continue');
            
            cohortInputs.forEach(input => {
                input.addEventListener('change', function() {
                    continueBtn.disabled = false;
                    continueBtn.classList.add('btn-ready');
                });
            });
        }, 50);
    }, 300);
};

// Update progress indicator
function updateProgressIndicator(step) {
    const steps = document.querySelectorAll('.progress-step');
    const lines = document.querySelectorAll('.progress-line');
    
    steps.forEach((stepEl, index) => {
        if (index < step) {
            stepEl.classList.add('completed');
            stepEl.classList.remove('active');
        } else if (index === step - 1) {
            stepEl.classList.add('active');
            stepEl.classList.remove('completed');
        } else {
            stepEl.classList.remove('active', 'completed');
        }
    });
    
    lines.forEach((line, index) => {
        if (index < step - 1) {
            line.classList.add('completed');
        } else {
            line.classList.remove('completed');
        }
    });
}

window.backToStep1 = function() {
    updateProgressIndicator(1);
    
    const step1 = document.getElementById('apply-step-1');
    const step2 = document.getElementById('apply-step-2');
    
    step2.style.opacity = '0';
    setTimeout(() => {
        step2.style.display = 'none';
        step1.style.display = 'block';
        step1.style.opacity = '0';
        setTimeout(() => {
            step1.style.opacity = '1';
        }, 50);
    }, 300);
};

window.moveToStep3 = function() {
    const selectedCohort = document.querySelector('input[name="cohort"]:checked');
    if (!selectedCohort) {
        showNotification('error', 'Please select a cohort to continue.');
        return;
    }
    
    // Update progress indicator
    updateProgressIndicator(3);
    
    // Get selected course and cohort details
    const courseName = document.querySelector('input[name="course"]:checked').parentElement.querySelector('h4').textContent;
    const cohortName = selectedCohort.parentElement.querySelector('h4').textContent;
    
    // Animate transition
    const step2 = document.getElementById('apply-step-2');
    const step3 = document.getElementById('apply-step-3');
    
    step2.style.opacity = '0';
    setTimeout(() => {
        step2.style.display = 'none';
        step3.style.display = 'block';
        step3.style.opacity = '0';
        
        // Load payment options
        step3.innerHTML = `
            <h3>Step 3: Complete Your Enrollment</h3>
            <p class="step-description">You're almost there! Choose your payment option to secure your spot.</p>
            
            <div class="payment-summary">
                <h4>Order Summary</h4>
                <div class="summary-item">
                    <span>Program:</span>
                    <strong>${courseName}</strong>
                </div>
                <div class="summary-item">
                    <span>Schedule:</span>
                    <strong>${cohortName}</strong>
                </div>
                <div class="summary-item">
                    <span>Start Date:</span>
                    <strong>${selectedCohort.value.includes('fulltime') ? 'March 3, 2025' : 'March 10, 2025'}</strong>
                </div>
            </div>
            
            <div class="payment-options">
                <div class="payment-card">
                    <h4>Pay Deposit</h4>
                    <p class="price">$500 NZD</p>
                    <p>Secure your spot with a deposit</p>
                    <ul>
                        <li>Remainder due before course starts</li>
                        <li>Flexible payment plans available</li>
                        <li>Fully refundable up to 14 days before start</li>
                    </ul>
                    <button class="btn btn-primary" onclick="processPayment('deposit')">
                        <i class="fas fa-lock"></i>
                        Pay Deposit Now
                    </button>
                </div>
                
                <div class="payment-card featured">
                    <div class="badge">Save $2,500</div>
                    <h4>Pay in Full</h4>
                    <p class="price"><s>$12,500 NZD</s> $10,000 NZD</p>
                    <p>Best value - pay upfront and save</p>
                    <ul>
                        <li>20% discount applied automatically</li>
                        <li>Immediate enrollment confirmation</li>
                        <li>Priority access to course materials</li>
                        <li>Fully refundable up to 14 days before start</li>
                    </ul>
                    <button class="btn btn-primary" onclick="processPayment('upfront')">
                        <i class="fas fa-lock"></i>
                        Pay in Full & Save
                    </button>
                </div>
            </div>
            
            <div class="payment-security">
                <i class="fas fa-shield-alt"></i>
                <p>Your payment is secure and processed by Stripe. All transactions are encrypted and PCI-compliant.</p>
            </div>
            
            <div class="step-actions">
                <button class="btn btn-secondary" onclick="backToStep2()">
                    <i class="fas fa-arrow-left"></i>
                    Back
                </button>
            </div>
        `;
        
        setTimeout(() => {
            step3.style.opacity = '1';
        }, 50);
    }, 300);
};

window.backToStep2 = function() {
    updateProgressIndicator(2);
    
    const step2 = document.getElementById('apply-step-2');
    const step3 = document.getElementById('apply-step-3');
    
    step3.style.opacity = '0';
    setTimeout(() => {
        step3.style.display = 'none';
        step2.style.display = 'block';
        step2.style.opacity = '0';
        setTimeout(() => {
            step2.style.opacity = '1';
        }, 50);
    }, 300);
};

window.processPayment = async function(type) {
    const course = document.querySelector('input[name="course"]:checked').value;
    const cohort = document.querySelector('input[name="cohort"]:checked').value;
    
    // Show loading state
    const button = event.target;
    const originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    try {
        // Get member data
        const { data: member } = await window.$memberstackDom.getCurrentMember();
        
        // Create Stripe payment link with metadata
        const paymentUrls = {
            deposit: 'https://buy.stripe.com/test_deposit_link', // Replace with actual Stripe link
            upfront: 'https://buy.stripe.com/test_upfront_link'  // Replace with actual Stripe link
        };
        
        // Build payment URL with metadata
        const metadata = {
            email: member.auth.email,
            memberId: member.id,
            course: course,
            cohort: cohort,
            paymentType: type
        };
        
        // Create URL with query parameters
        const params = new URLSearchParams({
            prefilled_email: member.auth.email,
            client_reference_id: member.id,
            metadata: JSON.stringify(metadata)
        });
        
        const paymentUrl = `${paymentUrls[type]}?${params.toString()}`;
        
        // Store payment intent in Memberstack for tracking
        await window.$memberstackDom.updateMember({
            customFields: {
                'pending-payment': JSON.stringify({
                    course: course,
                    cohort: cohort,
                    type: type,
                    timestamp: new Date().toISOString()
                })
            }
        });
        
        // Show success notification before redirect
        showNotification('info', 'Redirecting to secure payment...');
        
        // Redirect to Stripe after a short delay
        setTimeout(() => {
            window.location.href = paymentUrl;
        }, 1000);
        
    } catch (error) {
        console.error('Payment error:', error);
        showNotification('error', 'Payment initialization failed. Please try again.');
        button.disabled = false;
        button.innerHTML = originalText;
    }
};

// Load Career Consultation content
function loadCareerConsultation() {
    const consultationContent = document.getElementById('consultation-content');
    if (!consultationContent) return;
    
    consultationContent.innerHTML = `
        <div class="consultation-container">
            <div class="consultation-intro card">
                <div class="card-icon">
                    <i class="fas fa-comments"></i>
                </div>
                <h3>Free 30-Minute Career Consultation</h3>
                <p>Our experienced career advisors are here to help you navigate your tech career journey. Whether you're just starting out or looking to pivot, we'll provide personalized guidance tailored to your goals.</p>
            </div>
            
            <div class="consultation-benefits">
                <h3>What to Expect</h3>
                <div class="benefits-grid">
                    <div class="benefit-card">
                        <i class="fas fa-user-tie"></i>
                        <h4>Career Path Assessment</h4>
                        <p>Evaluate your current skills and identify the best tech career path for your background</p>
                    </div>
                    <div class="benefit-card">
                        <i class="fas fa-graduation-cap"></i>
                        <h4>Program Recommendations</h4>
                        <p>Get personalized course recommendations based on your career goals and experience</p>
                    </div>
                    <div class="benefit-card">
                        <i class="fas fa-briefcase"></i>
                        <h4>Industry Insights</h4>
                        <p>Learn about current job market trends and in-demand skills in the tech industry</p>
                    </div>
                    <div class="benefit-card">
                        <i class="fas fa-road"></i>
                        <h4>Learning Roadmap</h4>
                        <p>Create a clear roadmap for achieving your tech career goals</p>
                    </div>
                </div>
            </div>
            
            <div class="consultation-booking card">
                <h3>Book Your Free Consultation</h3>
                <form id="consultation-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="consult-name">
                                <i class="fas fa-user"></i> Full Name
                            </label>
                            <input type="text" class="form-control" id="consult-name" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="consult-email">
                                <i class="fas fa-envelope"></i> Email Address
                            </label>
                            <input type="email" class="form-control" id="consult-email" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="consult-phone">
                                <i class="fas fa-phone"></i> Phone Number
                            </label>
                            <input type="tel" class="form-control" id="consult-phone" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="consult-timezone">
                                <i class="fas fa-globe"></i> Time Zone
                            </label>
                            <select class="form-control" id="consult-timezone" required>
                                <option value="">Select your time zone</option>
                                <option value="NZST">New Zealand (NZST)</option>
                                <option value="AEST">Australia Eastern (AEST)</option>
                                <option value="AWST">Australia Western (AWST)</option>
                                <option value="PST">Pacific (PST)</option>
                                <option value="EST">Eastern (EST)</option>
                                <option value="GMT">GMT/UTC</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="consult-interest">
                            <i class="fas fa-laptop-code"></i> Area of Interest
                        </label>
                        <select class="form-control" id="consult-interest" required>
                            <option value="">Select your primary interest</option>
                            <option value="data-science">Data Science & AI</option>
                            <option value="software-engineering">Software Engineering</option>
                            <option value="cyber-security">Cyber Security</option>
                            <option value="unsure">Not sure - need guidance</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="consult-availability">
                            <i class="fas fa-calendar-alt"></i> Preferred Days
                        </label>
                        <div class="checkbox-group">
                            <label class="checkbox-option">
                                <input type="checkbox" name="availability" value="weekdays">
                                <span>Weekdays</span>
                            </label>
                            <label class="checkbox-option">
                                <input type="checkbox" name="availability" value="weekends">
                                <span>Weekends</span>
                            </label>
                            <label class="checkbox-option">
                                <input type="checkbox" name="availability" value="evenings">
                                <span>Evenings</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="consult-message">
                            <i class="fas fa-comment-alt"></i> Tell us about your goals (optional)
                        </label>
                        <textarea class="form-control" id="consult-message" rows="4" 
                            placeholder="Share your career goals, current experience, or any specific questions you'd like to discuss..."></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary btn-lg">
                            <i class="fas fa-calendar-check"></i>
                            Request Consultation
                        </button>
                    </div>
                </form>
            </div>
            
            <div class="consultation-faq">
                <h3>Frequently Asked Questions</h3>
                <div class="faq-item">
                    <h4>Is the consultation really free?</h4>
                    <p>Yes! Our 30-minute career consultations are completely free with no obligations.</p>
                </div>
                <div class="faq-item">
                    <h4>What should I prepare for the consultation?</h4>
                    <p>Think about your career goals, current skills, and any questions you have about transitioning into tech.</p>
                </div>
                <div class="faq-item">
                    <h4>Can I reschedule my consultation?</h4>
                    <p>Yes, you can reschedule up to 24 hours before your scheduled time.</p>
                </div>
            </div>
        </div>
    `;
    
    // Add form submission handler
    const consultForm = document.getElementById('consultation-form');
    if (consultForm) {
        consultForm.addEventListener('submit', handleConsultationSubmit);
    }
}

// Handle consultation form submission
async function handleConsultationSubmit(e) {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    
    // Collect form data
    const formData = {
        name: document.getElementById('consult-name').value,
        email: document.getElementById('consult-email').value,
        phone: document.getElementById('consult-phone').value,
        timezone: document.getElementById('consult-timezone').value,
        interest: document.getElementById('consult-interest').value,
        availability: Array.from(document.querySelectorAll('input[name="availability"]:checked')).map(cb => cb.value),
        message: document.getElementById('consult-message').value,
        timestamp: new Date().toISOString()
    };
    
    try {
        // In a real implementation, you would send this to your backend
        // For now, we'll simulate a successful submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update member custom fields to track consultation request
        await window.$memberstackDom.updateMember({
            customFields: {
                'consultation-requested': 'true',
                'consultation-date': new Date().toISOString()
            }
        });
        
        // Show success message
        showNotification('success', 'Consultation request submitted successfully!');
        
        // Replace form with success message
        document.querySelector('.consultation-booking').innerHTML = `
            <div class="submission-success">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Thank You!</h3>
                <p>Your consultation request has been submitted successfully.</p>
                <p>Our team will contact you within 24 hours to schedule your free consultation.</p>
                <p><strong>What happens next:</strong></p>
                <ul>
                    <li>You'll receive a confirmation email shortly</li>
                    <li>A career advisor will reach out to schedule your consultation</li>
                    <li>You'll receive a calendar invite with a video call link</li>
                </ul>
            </div>
        `;
        
    } catch (error) {
        console.error('Consultation submission error:', error);
        showNotification('error', 'Failed to submit request. Please try again.');
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}

// Handle logout
document.getElementById('logout-btn')?.addEventListener('click', async function(e) {
    e.preventDefault();
    
    try {
        // Show loading state
        const logoutBtn = this;
        const originalContent = logoutBtn.innerHTML;
        logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Logging out...</span>';
        logoutBtn.disabled = true;
        
        // Perform logout
        await window.$memberstackDom.logout()
            .then(() => {
                // Redirect to login page after successful logout
                window.location.href = '/login';
            })
            .catch((error) => {
                console.error('Logout error:', error);
                // Restore button state on error
                logoutBtn.innerHTML = originalContent;
                logoutBtn.disabled = false;
                showNotification('error', 'Logout failed. Please try again.');
            });
    } catch (error) {
        console.error('Logout error:', error);
        this.innerHTML = originalContent;
        this.disabled = false;
    }
});
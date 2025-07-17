// Portal JavaScript Functionality
class PortalManager {
    constructor() {
        this.memberstack = null;
        this.currentMember = null;
        this.currentPage = 'overview';
        this.selectedCourse = null;
        this.selectedCohort = null;
        this.selectedPayment = null;
        this.paymentHandler = window.PaymentHandler ? new PaymentHandler() : null;
        
        this.courseData = {
            'data-science': {
                name: 'Data Science & AI',
                duration: '12-week full-time / 24-week part-time',
                startDate: 'Jan 15, 2024',
                cost: '$12,500 AUD',
                cohorts: {
                    fulltime: { date: 'Jan 15, 2024', duration: '12 weeks' },
                    parttime: { date: 'Jan 15, 2024', duration: '24 weeks' }
                }
            },
            'cyber-security': {
                name: 'Cyber Security',
                duration: '12-week full-time / 24-week part-time',
                startDate: 'Feb 1, 2024',
                cost: '$12,500 AUD',
                cohorts: {
                    fulltime: { date: 'Feb 1, 2024', duration: '12 weeks' },
                    parttime: { date: 'Feb 1, 2024', duration: '24 weeks' }
                }
            },
            'software-engineering': {
                name: 'Software Engineering',
                duration: '12-week full-time / 24-week part-time',
                startDate: 'Jan 22, 2024',
                cost: '$12,500 AUD',
                cohorts: {
                    fulltime: { date: 'Jan 22, 2024', duration: '12 weeks' },
                    parttime: { date: 'Jan 22, 2024', duration: '24 weeks' }
                }
            }
        };
        
        this.init();
    }
    
    async init() {
        try {
            // Wait for Memberstack to load
            if (window.$memberstackDom) {
                this.memberstack = window.$memberstackDom;
                await this.checkAuthentication();
                this.handleURLParameters();
                this.setupEventListeners();
                this.setupNavigation();
                this.setupEligibilityForm();
                this.setupApplicationFlow();
                this.setupResourceTabs();
                
                // Initialize default page view
                this.navigateToPage('overview');
                console.log('Portal initialized successfully');
            } else {
                // Retry after a short delay
                setTimeout(() => this.init(), 100);
            }
        } catch (error) {
            console.error('Portal initialization failed:', error);
            // Continue with basic functionality
            this.setupNavigation();
            this.navigateToPage('overview');
        }
    }
    
    async checkAuthentication() {
        try {
            const { data: member } = await this.memberstack.getCurrentMember();
            
            if (member) {
                this.currentMember = member;
                console.log('Current member:', this.currentMember);
            } else {
                console.log('No authenticated member found');
                this.currentMember = null;
            }
            
            this.updateStageBasedContent();
            
        } catch (error) {
            console.error('Authentication check failed:', error);
            this.currentMember = null;
            this.updateStageBasedContent();
        }
    }
    
    handleURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get('payment');
        const sessionId = urlParams.get('session_id');
        
        if (paymentStatus === 'success' && sessionId) {
            this.handlePaymentReturn(sessionId, true);
        } else if (paymentStatus === 'cancelled') {
            this.handlePaymentReturn(null, false);
        }
        
        // Clean up URL
        if (paymentStatus) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
    
    async handlePaymentReturn(sessionId, success) {
        if (success && sessionId) {
            try {
                // Verify payment with backend
                const result = await this.paymentHandler.handlePaymentSuccess(
                    sessionId, 
                    this.memberstack, 
                    this.currentMember
                );
                
                if (result.success) {
                    // Update local member data
                    this.currentMember.customFields = {
                        ...this.currentMember.customFields,
                        stage: '3',
                        enrolledCourse: result.enrollmentData.course,
                        enrolledCohort: result.enrollmentData.cohort,
                        enrollmentDate: new Date().toISOString()
                    };
                    
                    this.updateEnrollmentDetails();
                    this.updateStageBasedContent();
                    this.navigateToPage('application');
                    this.showNotification('Payment successful! Welcome to UC Online!', 'success');
                } else {
                    throw new Error('Payment verification failed');
                }
                
            } catch (error) {
                console.error('Payment return handling failed:', error);
                this.showNotification('Payment verification failed. Please contact support if payment was completed.', 'error');
            }
        } else {
            // Payment was cancelled
            this.navigateToPage('application');
            this.showNotification('Payment was cancelled. You can try again when ready.', 'warning');
        }
    }
    
    updateStageBasedContent() {
        // Memberstack handles content visibility automatically through data-ms-content attributes
        // configured in the Memberstack dashboard settings
        if (this.currentMember) {
            console.log('Current member stage:', this.currentMember.customFields?.stage || '1');
        }
    }
    
    setupEventListeners() {
        // Handle form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'eligibility-form') {
                e.preventDefault();
                this.handleEligibilitySubmission(e.target);
            }
        });
        
        // Handle course selection
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('course-select-btn')) {
                e.preventDefault();
                this.handleCourseSelection(e.target);
            }
            
            if (e.target.classList.contains('payment-select-btn')) {
                e.preventDefault();
                this.handlePaymentSelection(e.target);
            }
        });
        
        // Handle step navigation
        document.getElementById('back-to-course')?.addEventListener('click', () => {
            this.showApplicationStep('course');
        });
        
        document.getElementById('continue-to-payment')?.addEventListener('click', () => {
            this.showApplicationStep('payment');
        });
        
        document.getElementById('back-to-cohort')?.addEventListener('click', () => {
            this.showApplicationStep('cohort');
        });
    }
    
    setupNavigation() {
        // Sidebar navigation
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (link.classList.contains('disabled')) return;
                
                const page = link.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });
    }
    
    navigateToPage(page) {
        // Update active sidebar link
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('active');
        });
        
        document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
        
        // Show selected page
        document.querySelectorAll('.portal-page').forEach(pageEl => {
            pageEl.classList.remove('active');
        });
        
        document.getElementById(`page-${page}`)?.classList.add('active');
        
        this.currentPage = page;
    }
    
    setupEligibilityForm() {
        // No additional setup needed - handled by event listener
    }
    
    async handleEligibilitySubmission(form) {
        const formData = new FormData(form);
        const education = formData.get('education');
        const timeCommitment = formData.get('timeCommitment');
        const schedule = formData.get('schedule');
        
        // Eligibility assessment logic
        const eligibilityResult = this.assessEligibility(education, timeCommitment, schedule);
        
        if (eligibilityResult === 'eligible') {
            try {
                // Update member stage to 2
                await this.memberstack.updateMemberJSON({
                    customFields: {
                        ...this.currentMember.customFields,
                        stage: '2',
                        education: education,
                        timeCommitment: timeCommitment,
                        schedule: schedule
                    }
                });
                
                // Update current member data
                this.currentMember.customFields = {
                    ...this.currentMember.customFields,
                    stage: '2',
                    education: education,
                    timeCommitment: timeCommitment,
                    schedule: schedule
                };
                
                // Update UI
                this.updateStageBasedContent();
                
                // Show success message
                this.showNotification('Congratulations! You are eligible for our programs.', 'success');
                
            } catch (error) {
                console.error('Failed to update member stage:', error);
                this.showNotification('There was an error processing your eligibility. Please try again.', 'error');
            }
        } else {
            this.showNotification('Based on your responses, you may need additional review. Please contact our admissions team.', 'warning');
        }
    }
    
    assessEligibility(education, timeCommitment, schedule) {
        const educationScore = {
            'high-school': 1,
            'some-college': 2,
            'associate': 3,
            'bachelor': 4,
            'master-plus': 5
        };
        
        const hasTimeCommitment = timeCommitment === 'part-time' || timeCommitment === 'full-time';
        const isEligible = educationScore[education] >= 3 && hasTimeCommitment;
        
        return isEligible ? 'eligible' : 'review-required';
    }
    
    setupApplicationFlow() {
        // Show first step by default
        this.showApplicationStep('course');
    }
    
    showApplicationStep(step) {
        document.querySelectorAll('.application-step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });
        
        document.getElementById(`step-${step}`)?.classList.add('active');
        
        if (step === 'cohort' && this.selectedCourse) {
            this.populateCohortOptions();
        }
    }
    
    handleCourseSelection(button) {
        const courseCard = button.closest('.course-card');
        const courseId = courseCard.getAttribute('data-course');
        
        // Update selection
        document.querySelectorAll('.course-card').forEach(card => {
            card.classList.remove('selected');
        });
        courseCard.classList.add('selected');
        
        this.selectedCourse = courseId;
        
        // Move to next step
        setTimeout(() => {
            this.showApplicationStep('cohort');
        }, 500);
    }
    
    populateCohortOptions() {
        if (!this.selectedCourse || !this.courseData[this.selectedCourse]) return;
        
        const courseInfo = this.courseData[this.selectedCourse];
        const fulltimeContainer = document.getElementById('fulltime-cohorts');
        const parttimeContainer = document.getElementById('parttime-cohorts');
        
        if (fulltimeContainer) {
            fulltimeContainer.innerHTML = `
                <div class="cohort-item" data-schedule="fulltime">
                    <h4>${courseInfo.name} - Full-time</h4>
                    <p><strong>Start:</strong> ${courseInfo.cohorts.fulltime.date}</p>
                    <p><strong>Duration:</strong> ${courseInfo.cohorts.fulltime.duration}</p>
                </div>
            `;
        }
        
        if (parttimeContainer) {
            parttimeContainer.innerHTML = `
                <div class="cohort-item" data-schedule="parttime">
                    <h4>${courseInfo.name} - Part-time</h4>
                    <p><strong>Start:</strong> ${courseInfo.cohorts.parttime.date}</p>
                    <p><strong>Duration:</strong> ${courseInfo.cohorts.parttime.duration}</p>
                </div>
            `;
        }
        
        // Add click handlers for cohort selection
        document.querySelectorAll('.cohort-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.cohort-item').forEach(cohort => {
                    cohort.classList.remove('selected');
                });
                item.classList.add('selected');
                
                this.selectedCohort = item.getAttribute('data-schedule');
                document.getElementById('continue-to-payment').disabled = false;
            });
        });
    }
    
    handlePaymentSelection(button) {
        const paymentCard = button.closest('.payment-card');
        const paymentType = paymentCard.getAttribute('data-payment');
        
        this.selectedPayment = paymentType;
        
        // Create Stripe payment link
        this.createPaymentLink(paymentType);
    }
    
    async createPaymentLink(paymentType) {
        const amount = paymentType === 'deposit' ? 500 : 10000;
        
        try {
            this.showNotification('Creating payment link...', 'info');
            
            const paymentData = {
                amount: amount,
                currency: 'aud',
                courseId: this.selectedCourse,
                cohortId: this.selectedCohort,
                userId: this.currentMember.id,
                success_url: `${window.location.origin}/portal.html?payment=success`,
                cancel_url: `${window.location.origin}/portal.html?payment=cancelled`
            };
            
            // Create Stripe payment link
            const paymentLink = this.paymentHandler ? await this.paymentHandler.createPaymentLink(paymentData) : null;
            
            if (paymentLink && paymentLink.url) {
                // Redirect to Stripe checkout
                window.location.href = paymentLink.url;
            } else {
                throw new Error('Invalid payment link response');
            }
            
        } catch (error) {
            console.error('Payment creation failed:', error);
            
            // For demo purposes, simulate payment success after showing error
            this.showNotification('Demo mode: Simulating payment success...', 'warning');
            
            setTimeout(async () => {
                await this.handlePaymentSuccess();
            }, 2000);
        }
    }
    
    async handlePaymentSuccess() {
        try {
            // Update member stage to 3 (enrolled)
            await this.memberstack.updateMemberJSON({
                customFields: {
                    ...this.currentMember.customFields,
                    stage: '3',
                    enrolledCourse: this.selectedCourse,
                    enrolledCohort: this.selectedCohort,
                    paymentType: this.selectedPayment,
                    enrollmentDate: new Date().toISOString()
                }
            });
            
            // Update current member data
            this.currentMember.customFields = {
                ...this.currentMember.customFields,
                stage: '3',
                enrolledCourse: this.selectedCourse,
                enrolledCohort: this.selectedCohort,
                paymentType: this.selectedPayment,
                enrollmentDate: new Date().toISOString()
            };
            
            // Update enrollment details in success page
            this.updateEnrollmentDetails();
            
            // Update UI
            this.updateStageBasedContent();
            
            // Show success message
            this.showNotification('Enrollment successful! Welcome to UC Online!', 'success');
            
        } catch (error) {
            console.error('Failed to update enrollment status:', error);
            this.showNotification('There was an error confirming your enrollment. Please contact support.', 'error');
        }
    }
    
    updateEnrollmentDetails() {
        if (!this.selectedCourse || !this.courseData[this.selectedCourse]) return;
        
        const courseInfo = this.courseData[this.selectedCourse];
        
        document.getElementById('enrolled-course').textContent = courseInfo.name;
        document.getElementById('enrolled-schedule').textContent = this.selectedCohort === 'fulltime' ? 'Full-time' : 'Part-time';
        document.getElementById('enrolled-date').textContent = courseInfo.cohorts[this.selectedCohort].date;
        document.getElementById('payment-date').textContent = new Date().toLocaleDateString();
    }
    
    setupResourceTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const course = btn.getAttribute('data-course');
                
                // Update active tab
                document.querySelectorAll('.tab-btn').forEach(tab => {
                    tab.classList.remove('active');
                });
                btn.classList.add('active');
                
                // Update PDF viewer
                this.updatePDFViewer(course);
            });
        });
        
        // PDF controls
        document.getElementById('fullscreen-btn')?.addEventListener('click', () => {
            this.openPDFFullscreen();
        });
        
        document.getElementById('download-btn')?.addEventListener('click', () => {
            this.downloadPDF();
        });
        
        document.getElementById('print-btn')?.addEventListener('click', () => {
            this.printPDF();
        });
    }
    
    updatePDFViewer(course) {
        // In a real implementation, these would be actual Google Drive file IDs
        const pdfFiles = {
            'data-science': '1234567890',
            'cyber-security': '0987654321',
            'software-engineering': '1357924680'
        };
        
        const iframe = document.getElementById('pdf-iframe');
        if (iframe && pdfFiles[course]) {
            iframe.src = `https://drive.google.com/file/d/${pdfFiles[course]}/preview`;
        }
    }
    
    openPDFFullscreen() {
        const iframe = document.getElementById('pdf-iframe');
        if (iframe) {
            const src = iframe.src.replace('/preview', '/view');
            window.open(src, '_blank');
        }
    }
    
    downloadPDF() {
        const iframe = document.getElementById('pdf-iframe');
        if (iframe) {
            const src = iframe.src.replace('/preview', '/export?format=pdf');
            window.open(src, '_blank');
        }
    }
    
    printPDF() {
        const iframe = document.getElementById('pdf-iframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.print();
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 16px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 1000;
                    max-width: 400px;
                    animation: slideIn 0.3s ease-out;
                }
                .notification-info { background: #3b82f6; color: white; }
                .notification-success { background: #10b981; color: white; }
                .notification-warning { background: #f59e0b; color: white; }
                .notification-error { background: #ef4444; color: white; }
                .notification-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: inherit;
                    font-size: 20px;
                    cursor: pointer;
                    margin-left: 12px;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Close button handler
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize portal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortalManager();
});

// Handle browser back/forward navigation
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.page) {
        const portal = window.portalManager;
        if (portal) {
            portal.navigateToPage(e.state.page);
        }
    }
});
// Portal v2 JavaScript - Simple navigation without auth/protection
class PortalV2 {
    constructor() {
        this.currentPage = 'overview';
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupFormHandlers();
        this.setupTabNavigation();
        
        // Show overview page by default
        this.navigateToPage('overview');
        console.log('Portal v2 initialized');
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
        
        // Button navigation
        document.querySelectorAll('[data-page]').forEach(element => {
            if (element.tagName === 'A' || element.tagName === 'BUTTON') {
                element.addEventListener('click', (e) => {
                    if (!element.classList.contains('sidebar-link')) {
                        e.preventDefault();
                        const page = element.getAttribute('data-page');
                        this.navigateToPage(page);
                    }
                });
            }
        });
    }
    
    navigateToPage(page) {
        // Update active sidebar link
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-page="${page}"].sidebar-link`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Show selected page
        document.querySelectorAll('.portal-page').forEach(pageEl => {
            pageEl.classList.remove('active');
        });
        
        const targetPage = document.getElementById(`page-${page}`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        
        this.currentPage = page;
        
        // Update URL hash
        window.location.hash = page;
    }
    
    setupFormHandlers() {
        // Eligibility form
        const eligibilityForm = document.getElementById('eligibility-form');
        if (eligibilityForm) {
            eligibilityForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = new FormData(e.target);
                const education = formData.get('education');
                const timeCommitment = formData.get('timeCommitment');
                
                // Simple eligibility check
                const educationScore = {
                    'high-school': 1,
                    'some-college': 2,
                    'associate': 3,
                    'bachelor': 4,
                    'master-plus': 5
                };
                
                const isEligible = educationScore[education] >= 3 && timeCommitment;
                
                if (isEligible) {
                    alert('Congratulations! You are eligible for our programs.');
                    this.navigateToPage('application');
                } else {
                    alert('Based on your responses, you may need additional review. Please contact our admissions team.');
                }
            });
        }
        
        // Profile form
        const profileForm = document.querySelector('.profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Profile updated successfully!');
            });
        }
        
        // Password form
        const passwordForm = document.querySelector('.password-form');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Password updated successfully!');
            });
        }
    }
    
    setupTabNavigation() {
        // Course tabs in resources
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active tab
                document.querySelectorAll('.tab-btn').forEach(tab => {
                    tab.classList.remove('active');
                });
                btn.classList.add('active');
                
                const course = btn.getAttribute('data-course');
                console.log('Selected course:', course);
            });
        });
        
        // Course selection cards
        document.querySelectorAll('.course-card button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.course-card');
                
                // Update selection
                document.querySelectorAll('.course-card').forEach(c => {
                    c.classList.remove('selected');
                });
                card.classList.add('selected');
                
                // Get course name
                const courseName = card.querySelector('h3').textContent;
                console.log('Selected course:', courseName);
            });
        });
        
        // Payment options
        document.querySelectorAll('.payment-card button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.payment-card');
                const paymentType = card.querySelector('h3').textContent;
                
                alert(`Selected payment option: ${paymentType}\nThis is a demo - no actual payment will be processed.`);
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortalV2();
});

// Handle initial hash navigation
window.addEventListener('load', () => {
    const hash = window.location.hash.slice(1);
    if (hash && document.getElementById(`page-${hash}`)) {
        const portal = new PortalV2();
        portal.navigateToPage(hash);
    }
});

// Handle browser back/forward
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    if (hash && document.getElementById(`page-${hash}`)) {
        const portal = window.portalV2Instance || new PortalV2();
        portal.navigateToPage(hash);
    }
});

// Store instance globally for hash navigation
window.portalV2Instance = null;
document.addEventListener('DOMContentLoaded', () => {
    window.portalV2Instance = new PortalV2();
});
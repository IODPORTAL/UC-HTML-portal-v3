// Component Loader
class ComponentLoader {
    static async loadComponent(elementId, componentPath) {
        try {
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${response.status}`);
            }
            const html = await response.text();
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = html;
                
                // Initialize component-specific functionality
                if (elementId === 'header-placeholder') {
                    this.initializeHeader();
                }
                if (elementId === 'footer-placeholder') {
                    this.initializeFooter();
                }
            }
        } catch (error) {
            console.error('Error loading component:', error);
        }
    }
    
    static initializeHeader() {
        // Initialize dropdown functionality
        const dropdown = document.querySelector('.nav-dropdown');
        const toggle = dropdown?.querySelector('.nav-dropdown-toggle');
        
        if (toggle && dropdown) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('active');
                }
            });
            
            // Close dropdown on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    dropdown.classList.remove('active');
                }
            });
        }
        
        // Re-initialize mobile menu if it exists (from main.js)
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        if (mobileMenuToggle && window.initializeMobileMenu) {
            window.initializeMobileMenu();
        }
        
        // Re-initialize sticky navigation if it exists
        if (window.initializeStickyNav) {
            window.initializeStickyNav();
        }
    }
    
    static initializeFooter() {
        // Re-initialize sticky CTA and forms if they exist
        if (window.initializeStickyCTA) {
            window.initializeStickyCTA();
        }
        
        if (window.initializeForms) {
            window.initializeForms();
        }
    }
    
    // Load all components
    static async loadAllComponents() {
        await Promise.all([
            this.loadComponent('header-placeholder', 'components/header.html'),
            this.loadComponent('footer-placeholder', 'components/footer.html')
        ]);
    }
}

// Auto-load components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ComponentLoader.loadAllComponents();
});

// Make ComponentLoader globally available
window.ComponentLoader = ComponentLoader;
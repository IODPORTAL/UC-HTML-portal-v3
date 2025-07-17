// Main JavaScript functionality for UC Bootcamp Landing Page

// DOM Elements - will be initialized in DOMContentLoaded
let header, mobileMenuToggle, mainNav, heroForm, stickyCTA, stickyForm, ctaUrgentForm;
let testimonialsSlider, testimonialPrev, testimonialNext, countdown, stickySectionNav;
let reviewsCarousel, reviewItems, currentReviewIndex = 0;

// Animated Text Variables
let animatedTextElements = [];
let allLetters = [];
let animationConfig = {
    speed: 0.5,
    staggerDelay: 0.02,
    offset: 0.3
};

// Lenis Smooth Scroll
let lenis;

// Debug function to check elements
function checkStickyElements() {
    console.log('Sticky elements found:', {
        stickyCTA: stickyCTA,
        stickySectionNav: stickySectionNav
    });
    
    if (!stickyCTA) {
        console.error('stickyCTA element not found! Looking for #stickyCTA');
    }
    if (!stickySectionNav) {
        console.error('stickySectionNav element not found! Looking for #stickySectionNav');
    }
}

// Mobile Menu Toggle - will be initialized in DOMContentLoaded
function initMobileMenu() {
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = mobileMenuToggle.querySelectorAll('span');
            if (mainNav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(7px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

// Animated Text Functions
function splitTextIntoWords(element, letters) {
    if (!element) return;
    
    const text = element.getAttribute('data-text');
    if (!text) return;
    
    // Clear existing content
    element.innerHTML = '';
    
    // Split text into words and filter out empty strings
    const words = text.split(' ').filter(word => word.trim() !== '');
    
    words.forEach((word, wordIndex) => {
        // Create a span for each word
        const wordSpan = document.createElement('span');
        wordSpan.classList.add('word');
        
        // Split each word into characters
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            const span = document.createElement('span');
            span.classList.add('letter');
            span.textContent = char;
            wordSpan.appendChild(span);
            letters.push(span);
        }
        
        element.appendChild(wordSpan);
        
        // Add space after word (except for the last word)
        if (wordIndex < words.length - 1) {
            const spaceSpan = document.createElement('span');
            spaceSpan.classList.add('letter', 'space');
            spaceSpan.innerHTML = '&nbsp;';
            element.appendChild(spaceSpan);
            letters.push(spaceSpan);
        }
    });
}

function animateLettersOnScroll() {
    if (animatedTextElements.length === 0 || allLetters.length === 0) return;
    
    // Get the container bounds
    const container = document.querySelector('.animated-text-section');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Account for sticky navigation elements
    const stickyNavHeight = 60; // sticky-section-nav height
    const stickyCTAHeight = 80; // approximate sticky-cta height
    const effectiveWindowHeight = windowHeight - stickyNavHeight - stickyCTAHeight;
    
    const elementTop = rect.top;
    const elementHeight = rect.height;
    
    // Calculate scroll progress through the element (0 to 1) using effective window height
    // Adjust timing: start later and end quicker
    const startOffset = effectiveWindowHeight * 0.3; // Start when element is 30% into viewport
    const endOffset = effectiveWindowHeight * 0.7; // End when element is 70% through viewport
    
    const scrollProgress = Math.max(0, Math.min(1, 
        (effectiveWindowHeight - elementTop - startOffset) / 
        (endOffset - startOffset)
    ));
    
    // Calculate how many letters should be revealed
    const lettersToReveal = Math.floor(scrollProgress * allLetters.length);
    
    // Animate letters instantly without stagger delay
    allLetters.forEach((letter, index) => {
        if (index < lettersToReveal) {
            letter.classList.add('revealed');
        } else {
            letter.classList.remove('revealed');
        }
    });
}

function initAnimatedText() {
    animatedTextElements = document.querySelectorAll('.animated-text');
    allLetters = [];
    
    if (animatedTextElements.length > 0) {
        animatedTextElements.forEach(element => {
            splitTextIntoWords(element, allLetters);
        });
        
        // Initial animation check
        animateLettersOnScroll();
        
        // Add scroll listener for animation (fallback for non-lenis scroll)
        window.addEventListener('scroll', animateLettersOnScroll);
    }
}

// Week alternation function
function alternateWeeks() {
    const weeksNumber = document.querySelector('.weeks-number');
    
    if (weeksNumber) {
        let is12Weeks = true;
        
        setInterval(() => {
            if (is12Weeks) {
                weeksNumber.textContent = '24';
            } else {
                weeksNumber.textContent = '12';
            }
            is12Weeks = !is12Weeks;
        }, 4000); // Change every 4 seconds
    }
}

// Initialize Lenis Smooth Scroll
function initLenis() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    lenis = new Lenis({
        duration: prefersReducedMotion ? 0 : 0.8, // Faster, more responsive
        easing: (t) => 1 - Math.pow(1 - t, 3), // Smooth cubic ease-out
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: !prefersReducedMotion,
        mouseMultiplier: 0.8, // Slightly reduced for better control
        smoothTouch: true, // Enable smooth touch for premium feel
        touchMultiplier: 1.5, // Balanced touch sensitivity
        infinite: false,
        normalizeWheel: true, // Better cross-browser wheel handling
        wheelMultiplier: 1.2, // Slightly amplified for better response
    });

    // Optimized RAF loop with performance monitoring
    let rafId;
    function raf(time) {
        if (lenis) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
    }
    rafId = requestAnimationFrame(raf);

    // Throttled scroll events for better performance
    let scrollTimeout;
    lenis.on('scroll', () => {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(() => {
            animateLettersOnScroll();
            scrollTimeout = null;
        }, 16); // ~60fps throttling
    });

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(rafId);
        } else {
            rafId = requestAnimationFrame(raf);
        }
    });

    // Pause on reduced motion preference change
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        if (e.matches) {
            lenis.destroy();
            initLenis();
        }
    });
}

// Sticky Header and Section Navigation on Scroll
let lastScrollTop = 0;
let heroSection, ctaUrgent, companyLogos;
let heroBottom, ctaUrgentTop, companyLogosTop;

function cacheScrollElements() {
    heroSection = document.querySelector('.hero');
    ctaUrgent = document.querySelector('.cta-urgent');
    companyLogos = document.querySelector('.company-logos');
    
    if (heroSection && ctaUrgent && companyLogos) {
        heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        ctaUrgentTop = ctaUrgent.offsetTop;
        companyLogosTop = companyLogos.offsetTop;
    }
}

function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Show sticky CTA after scrolling past hero, hide when cta-urgent section is visible
    if (heroSection && ctaUrgent && stickyCTA) {
        if (scrollTop > heroBottom && scrollTop < ctaUrgentTop - 100) {
            stickyCTA.classList.add('show');
        } else {
            stickyCTA.classList.remove('show');
        }
    }
    
    // Show/hide sticky section navigation
    if (companyLogos && ctaUrgent && stickySectionNav) {
        if (scrollTop > companyLogosTop && scrollTop < ctaUrgentTop - 100) {
            stickySectionNav.classList.add('show');
        } else {
            stickySectionNav.classList.remove('show');
        }
    }
    
    // Update active section in navigation
    updateActiveSection();
    
    lastScrollTop = scrollTop;
}

function initScrollHandlers() {
    cacheScrollElements();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', cacheScrollElements);
}

// Update active section based on scroll position
function updateActiveSection() {
    const sections = [
        { id: 'programme-overview', element: document.querySelector('.programme-overview') },
        { id: 'key-info', element: document.querySelector('.key-info') },
        { id: 'how-it-works', element: document.querySelector('.how-it-works') },
        { id: 'syllabus', element: document.querySelector('.syllabus') },
        { id: 'testimonials', element: document.querySelector('.testimonials') },
        { id: 'countdown-section', element: document.querySelector('.countdown-section') },
        { id: 'faqs', element: document.querySelector('.faqs') }
    ];
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const offset = 150; // Offset for better UX
    
    let activeSection = 'programme-overview';
    
    sections.forEach(section => {
        if (section.element) {
            const sectionTop = section.element.offsetTop - offset;
            const sectionBottom = sectionTop + section.element.offsetHeight;
            
            if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                activeSection = section.id;
            }
        }
    });
    
    // Update active nav item
    const navItems = document.querySelectorAll('.section-nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${activeSection}`) {
            item.classList.add('active');
        }
    });
}

// Form Handling - will be initialized in DOMContentLoaded
function initForms() {
    // Hero form handler
    if (heroForm) {
        heroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            // Here you would normally send the data to your server
            console.log('Form submitted:', data);
            
            // Show success message
            alert('Thank you! Your course outline will be sent to your email.');
            
            // Reset form
            e.target.reset();
        });
    }
    
    // CTA Urgent form handler
    if (ctaUrgentForm) {
        ctaUrgentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            // Here you would normally send the data to your server
            console.log('CTA Urgent form submitted:', data);
            
            // Show success message
            alert('Thank you! Your course outline will be sent to your email.');
            
            // Reset form
            e.target.reset();
        });
    }
}


// Sticky CTA Form - will be initialized in DOMContentLoaded
function initStickyForm() {
    const expandFormBtn = document.querySelector('.expand-form');
    const closeFormBtn = document.querySelector('.close-form');
    
    if (expandFormBtn && stickyForm) {
        expandFormBtn.addEventListener('click', () => {
            // Simply expand the form - no validation needed
            stickyForm.classList.add('expanded');
        });
    }

    if (closeFormBtn && stickyForm) {
        closeFormBtn.addEventListener('click', () => {
            // Close the form without submitting
            stickyForm.classList.remove('expanded');
        });
    }

    if (stickyForm) {
        stickyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect all form data
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            console.log('Sticky form submitted:', data);
            alert('Thank you! Your course outline will be sent to your email.');
            
            // Reset and collapse form
            e.target.reset();
            stickyForm.classList.remove('expanded');
        });
    }
}

// Accordion Functionality
function initAccordion(accordion) {
    if (!accordion) return;
    
    const items = accordion.querySelectorAll('.syllabus-item, .faq-item');
    console.log('Found accordion items:', items.length);
    
    items.forEach((item, index) => {
        const header = item.querySelector('.syllabus-header, .faq-question');
        console.log(`Item ${index}:`, item, 'Header:', header);
        
        if (header) {
            header.addEventListener('click', () => {
                console.log('Accordion header clicked:', item);
                
                // Close other items
                items.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                const wasActive = item.classList.contains('active');
                item.classList.toggle('active');
                console.log('Item toggled. Was active:', wasActive, 'Now active:', item.classList.contains('active'));
            });
        }
    });
}

// Theme Switching Functionality for Syllabus
function initThemeSwitching() {
    const themeItems = document.querySelectorAll('.theme-item');
    const themeContentSections = document.querySelectorAll('.theme-content-section');
    
    themeItems.forEach(themeItem => {
        themeItem.addEventListener('click', () => {
            const targetTheme = themeItem.getAttribute('data-theme');
            
            // Remove active class from all theme items
            themeItems.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked theme item
            themeItem.classList.add('active');
            
            // Hide all theme content sections
            themeContentSections.forEach(section => section.classList.remove('active'));
            
            // Show target theme content section
            const targetSection = document.querySelector(`[data-theme="${targetTheme}"].theme-content-section`);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // Close all accordion items in the new section
            const accordionItems = targetSection.querySelectorAll('.syllabus-item');
            accordionItems.forEach(item => item.classList.remove('active'));
        });
    });
}

// Tab Switching Functionality for How It Works
function initTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const faqTabButtons = document.querySelectorAll('.faq-tab-btn');
    const faqGroups = document.querySelectorAll('.faq-group');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all tab buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Show target tab content
            const targetContent = document.querySelector(`.tab-content[data-tab="${targetTab}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Sync FAQ tabs with How It Works tabs
            syncFaqTabs(targetTab);
        });
    });
}

// FAQ Tab Switching Functionality (Independent)
function initFaqTabSwitching() {
    const faqTabButtons = document.querySelectorAll('.faq-tab-btn');
    const faqGroups = document.querySelectorAll('.faq-group');
    
    faqTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetFaqTab = button.getAttribute('data-faq-tab');
            
            // Remove active class from all FAQ tab buttons
            faqTabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked FAQ button
            button.classList.add('active');
            
            // Hide all FAQ groups
            faqGroups.forEach(group => group.classList.remove('active'));
            
            // Show target FAQ group
            const targetFaqGroup = document.querySelector(`.faq-group[data-context="${targetFaqTab}"]`);
            if (targetFaqGroup) {
                targetFaqGroup.classList.add('active');
            }
            
            // Close all FAQ items in the new group
            if (targetFaqGroup) {
                const faqItems = targetFaqGroup.querySelectorAll('.faq-item');
                faqItems.forEach(item => item.classList.remove('active'));
            }
        });
    });
}

// Sync FAQ tabs with How It Works tabs
function syncFaqTabs(targetTab) {
    const faqTabButtons = document.querySelectorAll('.faq-tab-btn');
    const faqGroups = document.querySelectorAll('.faq-group');
    
    // Remove active class from all FAQ tab buttons
    faqTabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to corresponding FAQ tab
    const correspondingFaqTab = document.querySelector(`.faq-tab-btn[data-faq-tab="${targetTab}"]`);
    if (correspondingFaqTab) {
        correspondingFaqTab.classList.add('active');
    }
    
    // Hide all FAQ groups
    faqGroups.forEach(group => group.classList.remove('active'));
    
    // Show target FAQ group
    const targetFaqGroup = document.querySelector(`.faq-group[data-context="${targetTab}"]`);
    if (targetFaqGroup) {
        targetFaqGroup.classList.add('active');
    }
    
    // Close all FAQ items in the new group
    if (targetFaqGroup) {
        const faqItems = targetFaqGroup.querySelectorAll('.faq-item');
        faqItems.forEach(item => item.classList.remove('active'));
    }
}

// Eligibility Form Functionality
function initEligibilityForm() {
    const eligibilityForm = document.getElementById('eligibilityForm');
    const eligibilityResult = document.getElementById('eligibility-result');
    const resultIcon = document.querySelector('.result-icon');
    const resultTitle = document.querySelector('.result-title');
    const resultMessage = document.querySelector('.result-message');
    const resultCTA = document.querySelector('.result-cta');
    
    if (eligibilityForm) {
        eligibilityForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(eligibilityForm);
            const education = formData.get('education');
            const english = formData.get('english');
            const techBackground = formData.get('tech-background');
            
            // Simple eligibility logic
            let isEligible = true;
            let message = '';
            
            if (education === 'highschool') {
                isEligible = false;
                message = 'A diploma or higher qualification is required for this programme. Consider completing additional education or contact our admissions team for alternative pathways.';
            } else if (english === 'none' || english === '') {
                isEligible = false;
                message = 'English proficiency is essential for success in this programme. Please consider taking an English proficiency test or language course.';
            } else if (english === 'ielts5.5' || english === 'other') {
                isEligible = true;
                message = 'You meet the basic requirements! We may recommend additional English support resources to help you succeed in the programme.';
            } else {
                isEligible = true;
                message = 'Congratulations! You meet all the requirements for our Data Science & AI programme. You\'re ready to start your journey!';
            }
            
            // Show result
            eligibilityResult.classList.remove('hidden', 'success', 'warning');
            eligibilityResult.classList.add(isEligible ? 'success' : 'warning');
            
            resultIcon.textContent = isEligible ? '✅' : '⚠️';
            resultTitle.textContent = isEligible ? 'You\'re Eligible!' : 'Additional Requirements';
            resultMessage.textContent = message;
            
            if (isEligible) {
                resultCTA.classList.remove('hidden');
                resultCTA.textContent = 'Apply Now';
            } else {
                resultCTA.classList.add('hidden');
            }
        });
    }
}

// Scroll to animated text section
function scrollToAnimatedSection() {
    const animatedSection = document.querySelector('.animated-text-section');
    if (animatedSection && lenis) {
        const headerOffset = 100;
        const elementPosition = animatedSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        // Use Lenis scrollTo for consistent smooth scrolling
        lenis.scrollTo(offsetPosition, {
            duration: 1.2,
            easing: (t) => 1 - Math.pow(1 - t, 3),
            immediate: false
        });
    }
}

// CTA Button Functionality
function initCTAButtons() {
    const checkEligibilityBtn = document.querySelector('.check-eligibility-instantly-btn');
    const registerToViewBtn = document.querySelector('.register-to-view-btn');
    const reserveBtns = document.querySelectorAll('.reserve-btn');
    
    // Placeholder portal URL - replace with actual URL when available
    const portalURL = '#'; // Replace with actual portal URL
    
    if (checkEligibilityBtn) {
        checkEligibilityBtn.addEventListener('click', () => {
            // Redirect to eligibility check in portal
            window.open(portalURL, '_blank');
        });
    }
    
    if (registerToViewBtn) {
        registerToViewBtn.addEventListener('click', () => {
            // Redirect to registration/payment info in portal
            window.open(portalURL, '_blank');
        });
    }
    
    // Reserve spot buttons
    reserveBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Redirect to cohort reservation in portal
            window.open(portalURL, '_blank');
        });
    });
}

// Accordion initialization moved to DOMContentLoaded

// Testimonials Slider - will be initialized in DOMContentLoaded
let currentTestimonial = 0;
let testimonialsTrack, testimonialCards, testimonialDots;
let autoPlayInterval;

function getTestimonialWidth() {
    if (testimonialCards.length > 0) {
        return testimonialCards[0].offsetWidth + 32; // card width + gap
    }
    return 0;
}

function updateTestimonialSlider() {
    if (testimonialsTrack && testimonialCards.length > 0) {
        const testimonialWidth = getTestimonialWidth();
        testimonialsTrack.style.transform = `translateX(-${currentTestimonial * testimonialWidth}px)`;
    }
    
    // Update dots
    testimonialDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentTestimonial);
    });
}

function nextTestimonial() {
    const maxIndex = testimonialCards.length - 3; // Show 3 testimonials at once
    if (currentTestimonial < maxIndex) {
        currentTestimonial = currentTestimonial + 1;
    } else {
        currentTestimonial = 0;
    }
    updateTestimonialSlider();
}

function prevTestimonial() {
    const maxIndex = testimonialCards.length - 3; // Show 3 testimonials at once
    if (currentTestimonial > 0) {
        currentTestimonial = currentTestimonial - 1;
    } else {
        currentTestimonial = maxIndex;
    }
    updateTestimonialSlider();
}

function startAutoPlay() {
    autoPlayInterval = setInterval(nextTestimonial, 6000);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Testimonial event listeners moved to initTestimonials function

// Initialize testimonials - will be called in DOMContentLoaded
function initTestimonials() {
    testimonialsTrack = document.getElementById('testimonialsTrack');
    testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialDots = document.querySelectorAll('.dot');
    
    if (testimonialCards.length > 0) {
        updateTestimonialSlider();
        startAutoPlay();
        
        // Initialize controls
        if (testimonialPrev && testimonialNext) {
            testimonialPrev.addEventListener('click', () => {
                stopAutoPlay();
                prevTestimonial();
                startAutoPlay();
            });
            
            testimonialNext.addEventListener('click', () => {
                stopAutoPlay();
                nextTestimonial();
                startAutoPlay();
            });
        }
        
        // Dot navigation
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoPlay();
                const maxIndex = testimonialCards.length - 3;
                currentTestimonial = Math.min(index, maxIndex);
                updateTestimonialSlider();
                startAutoPlay();
            });
        });
        
        // Touch/Drag functionality
        if (testimonialsTrack) {
            let startX = 0;
            let currentX = 0;
            let isDragging = false;
            
            testimonialsTrack.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.clientX;
                stopAutoPlay();
                testimonialsTrack.style.cursor = 'grabbing';
            });
            
            testimonialsTrack.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                currentX = e.clientX;
                const diff = currentX - startX;
                const testimonialWidth = getTestimonialWidth();
                testimonialsTrack.style.transform = `translateX(${-currentTestimonial * testimonialWidth + diff}px)`;
            });
            
            testimonialsTrack.addEventListener('mouseup', (e) => {
                if (!isDragging) return;
                isDragging = false;
                testimonialsTrack.style.cursor = 'grab';
                
                const diff = currentX - startX;
                const threshold = 100; // 100px threshold
                
                if (diff > threshold) {
                    prevTestimonial();
                } else if (diff < -threshold) {
                    nextTestimonial();
                } else {
                    updateTestimonialSlider();
                }
                
                startAutoPlay();
            });
            
            testimonialsTrack.addEventListener('mouseleave', () => {
                if (isDragging) {
                    isDragging = false;
                    testimonialsTrack.style.cursor = 'grab';
                    updateTestimonialSlider();
                    startAutoPlay();
                }
            });
            
            // Touch events for mobile
            testimonialsTrack.addEventListener('touchstart', (e) => {
                isDragging = true;
                startX = e.touches[0].clientX;
                stopAutoPlay();
            });
            
            testimonialsTrack.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                currentX = e.touches[0].clientX;
                const diff = currentX - startX;
                const testimonialWidth = getTestimonialWidth();
                testimonialsTrack.style.transform = `translateX(${-currentTestimonial * testimonialWidth + diff}px)`;
            });
            
            testimonialsTrack.addEventListener('touchend', (e) => {
                if (!isDragging) return;
                isDragging = false;
                
                const diff = currentX - startX;
                const threshold = 100; // 100px threshold
                
                if (diff > threshold) {
                    prevTestimonial();
                } else if (diff < -threshold) {
                    nextTestimonial();
                } else {
                    updateTestimonialSlider();
                }
                
                startAutoPlay();
            });
        }
    }
}

// Update slider on window resize
function initResizeHandlers() {
    window.addEventListener('resize', () => {
        updateTestimonialSlider();
        updateCaseStudySlider();
    });
}

// Case Study Slider - similar to testimonials
let currentCaseStudy = 0;
let caseStudyTrack, caseStudyCards, caseStudyDots;
let caseStudyAutoPlayInterval;

function getCaseStudyWidth() {
    if (caseStudyCards.length > 0) {
        return caseStudyCards[0].offsetWidth + 32; // card width + gap
    }
    return 0;
}

function updateCaseStudySlider() {
    if (caseStudyTrack && caseStudyCards.length > 0) {
        const caseStudyWidth = getCaseStudyWidth();
        caseStudyTrack.style.transform = `translateX(-${currentCaseStudy * caseStudyWidth}px)`;
    }
    
    // Update dots
    caseStudyDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentCaseStudy);
    });
}

function nextCaseStudy() {
    const maxIndex = caseStudyCards.length - 1;
    if (currentCaseStudy < maxIndex) {
        currentCaseStudy = currentCaseStudy + 1;
    } else {
        currentCaseStudy = 0;
    }
    updateCaseStudySlider();
}

function prevCaseStudy() {
    const maxIndex = caseStudyCards.length - 1;
    if (currentCaseStudy > 0) {
        currentCaseStudy = currentCaseStudy - 1;
    } else {
        currentCaseStudy = maxIndex;
    }
    updateCaseStudySlider();
}

function startCaseStudyAutoPlay() {
    caseStudyAutoPlayInterval = setInterval(nextCaseStudy, 6000);
}

function stopCaseStudyAutoPlay() {
    clearInterval(caseStudyAutoPlayInterval);
}

function initCaseStudySlider() {
    caseStudyTrack = document.getElementById('caseStudiesTrack');
    caseStudyCards = document.querySelectorAll('.case-study-card');
    caseStudyDots = document.querySelectorAll('.case-study-dots .dot');
    const caseStudyPrev = document.getElementById('caseStudyPrev');
    const caseStudyNext = document.getElementById('caseStudyNext');
    
    if (caseStudyCards.length > 0) {
        updateCaseStudySlider();
        startCaseStudyAutoPlay();
        
        // Initialize controls
        if (caseStudyPrev && caseStudyNext) {
            caseStudyPrev.addEventListener('click', () => {
                stopCaseStudyAutoPlay();
                prevCaseStudy();
                startCaseStudyAutoPlay();
            });
            
            caseStudyNext.addEventListener('click', () => {
                stopCaseStudyAutoPlay();
                nextCaseStudy();
                startCaseStudyAutoPlay();
            });
        }
        
        // Dot navigation
        caseStudyDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopCaseStudyAutoPlay();
                currentCaseStudy = index;
                updateCaseStudySlider();
                startCaseStudyAutoPlay();
            });
        });
        
        // Touch/Drag functionality
        if (caseStudyTrack) {
            let startX = 0;
            let currentX = 0;
            let isDragging = false;
            
            caseStudyTrack.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.clientX;
                stopCaseStudyAutoPlay();
                caseStudyTrack.style.cursor = 'grabbing';
            });
            
            caseStudyTrack.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                currentX = e.clientX;
                const diff = currentX - startX;
                const caseStudyWidth = getCaseStudyWidth();
                caseStudyTrack.style.transform = `translateX(${-currentCaseStudy * caseStudyWidth + diff}px)`;
            });
            
            caseStudyTrack.addEventListener('mouseup', (e) => {
                if (!isDragging) return;
                isDragging = false;
                caseStudyTrack.style.cursor = 'grab';
                
                const diff = currentX - startX;
                const threshold = 100; // 100px threshold
                
                if (diff > threshold) {
                    prevCaseStudy();
                } else if (diff < -threshold) {
                    nextCaseStudy();
                } else {
                    updateCaseStudySlider();
                }
                
                startCaseStudyAutoPlay();
            });
            
            caseStudyTrack.addEventListener('mouseleave', () => {
                if (isDragging) {
                    isDragging = false;
                    caseStudyTrack.style.cursor = 'grab';
                    updateCaseStudySlider();
                    startCaseStudyAutoPlay();
                }
            });
            
            // Touch events for mobile
            caseStudyTrack.addEventListener('touchstart', (e) => {
                isDragging = true;
                startX = e.touches[0].clientX;
                stopCaseStudyAutoPlay();
            });
            
            caseStudyTrack.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                currentX = e.touches[0].clientX;
                const diff = currentX - startX;
                const caseStudyWidth = getCaseStudyWidth();
                caseStudyTrack.style.transform = `translateX(${-currentCaseStudy * caseStudyWidth + diff}px)`;
            });
            
            caseStudyTrack.addEventListener('touchend', (e) => {
                if (!isDragging) return;
                isDragging = false;
                
                const diff = currentX - startX;
                const threshold = 100; // 100px threshold
                
                if (diff > threshold) {
                    prevCaseStudy();
                } else if (diff < -threshold) {
                    nextCaseStudy();
                } else {
                    updateCaseStudySlider();
                }
                
                startCaseStudyAutoPlay();
            });
        }
    }
}

// Logo Slider - will be initialized in DOMContentLoaded
function initLogoSlider() {
    const logoTrack = document.querySelector('.logo-track');
    if (logoTrack) {
        // Clone logos for infinite scroll effect
        const logos = logoTrack.innerHTML;
        logoTrack.innerHTML = logos + logos;
    }
}

// Countdown Timer
function updateCountdown() {
    const now = new Date();
    
    // Define multiple programme start dates
    const programmeDates = [
        new Date('2025-08-11T09:00:00'),
        new Date('2025-09-15T09:00:00'),
        new Date('2025-10-13T09:00:00'),
        new Date('2025-11-17T09:00:00'),
        new Date('2025-12-15T09:00:00'),
        new Date('2026-01-19T09:00:00'),
        new Date('2026-02-16T09:00:00'),
        new Date('2026-03-16T09:00:00')
    ];
    
    // Find the closest future date
    let closestDate = null;
    let minDifference = Infinity;
    
    programmeDates.forEach(date => {
        const difference = date - now;
        if (difference > 0 && difference < minDifference) {
            minDifference = difference;
            closestDate = date;
        }
    });
    
    // If no future date found, use the next year's first date
    if (!closestDate) {
        closestDate = new Date('2026-01-19T09:00:00');
        minDifference = closestDate - now;
    }
    
    if (minDifference > 0) {
        const days = Math.floor(minDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((minDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((minDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((minDifference % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        
        // Update the displayed date text
        const dateOptions = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const formattedDate = closestDate.toLocaleDateString('en-NZ', dateOptions);
        
        // Update both full-time and part-time dates
        const fullTimeDate = document.querySelector('.date-item:first-child p');
        const partTimeDate = document.querySelector('.date-item:last-child p');
        
        if (fullTimeDate) fullTimeDate.textContent = formattedDate;
        if (partTimeDate) partTimeDate.textContent = formattedDate;
    }
}

// Initialize countdown - will be called in DOMContentLoaded
function initCountdown() {
    if (countdown) {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
}

// Smooth Scrolling for Anchor Links - will be initialized in DOMContentLoaded
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Lazy Loading for Images - will be initialized in DOMContentLoaded
function initImageObserver() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    // Observe all images
    document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
    });
}

// Animate elements on scroll - will be initialized in DOMContentLoaded
function initScrollAnimation() {
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1
    });

    // Add animation to sections
    document.querySelectorAll('section').forEach(section => {
        animateOnScroll.observe(section);
    });
}

// Form Validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
        
        // Email validation
        if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                input.classList.add('error');
                isValid = false;
            }
        }
        
        // Phone validation
        if (input.type === 'tel') {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(input.value)) {
                input.classList.add('error');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Initialize form validation - will be called in DOMContentLoaded
function initFormValidation() {
    // Add validation to all forms
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!validateForm(form)) {
                e.preventDefault();
                alert('Please fill in all required fields correctly.');
            }
        });
    });

    // Remove error class on input
    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
        });
    });
}


// Reviews Carousel Functionality
function initReviewsCarousel() {
    reviewsCarousel = document.getElementById('reviewsCarousel');
    if (!reviewsCarousel) return;
    
    reviewItems = reviewsCarousel.querySelectorAll('.review-item');
    const prevBtn = document.getElementById('prevReview');
    const nextBtn = document.getElementById('nextReview');
    const dotsContainer = document.getElementById('reviewDots');
    
    if (reviewItems.length === 0) return;
    
    // Create dots
    for (let i = 0; i < reviewItems.length; i++) {
        const dot = document.createElement('div');
        dot.className = `review-dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToReview(i));
        dotsContainer.appendChild(dot);
    }
    
    // Navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', previousReview);
    if (nextBtn) nextBtn.addEventListener('click', nextReview);
    
    // Auto-play
    setInterval(nextReview, 4000);
}

function nextReview() {
    currentReviewIndex = (currentReviewIndex + 1) % reviewItems.length;
    updateReviewDisplay();
}

function previousReview() {
    currentReviewIndex = currentReviewIndex === 0 ? reviewItems.length - 1 : currentReviewIndex - 1;
    updateReviewDisplay();
}

function goToReview(index) {
    currentReviewIndex = index;
    updateReviewDisplay();
}

function updateReviewDisplay() {
    if (!reviewItems) return;
    
    reviewItems.forEach((item, index) => {
        item.classList.remove('active', 'prev');
        if (index === currentReviewIndex) {
            item.classList.add('active');
        }
    });
    
    // Update dots
    const dots = document.querySelectorAll('.review-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentReviewIndex);
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('UC Bootcamp Landing Page loaded successfully');
    
    // Initialize DOM elements
    header = document.getElementById('header');
    mobileMenuToggle = document.getElementById('mobileMenuToggle');
    mainNav = document.getElementById('mainNav');
    heroForm = document.getElementById('heroForm');
    stickyCTA = document.getElementById('stickyCTA');
    stickyForm = document.getElementById('stickyForm');
    ctaUrgentForm = document.getElementById('ctaUrgentForm');
    testimonialsSlider = document.getElementById('testimonialsSlider');
    testimonialPrev = document.getElementById('testimonialPrev');
    testimonialNext = document.getElementById('testimonialNext');
    countdown = document.getElementById('countdown');
    stickySectionNav = document.getElementById('stickySectionNav');
    
    // Debug check
    checkStickyElements();
    
    // Add loading class removal
    document.body.classList.add('loaded');
    
    // Initialize all functionality
    initMobileMenu();
    initForms();
    initStickyForm();
    initScrollHandlers();
    initTestimonials();
    initCaseStudySlider();
    initResizeHandlers();
    initLogoSlider();
    initCountdown();
    initSmoothScrolling();
    initImageObserver();
    initScrollAnimation();
    initFormValidation();
    initAnimatedText();
    alternateWeeks();
    initLenis();
    initReviewsCarousel();
    
    // Initialize theme switching for syllabus
    initThemeSwitching();
    
    // Initialize accordions for each theme section
    const themeContentSections = document.querySelectorAll('.theme-content-section');
    themeContentSections.forEach(section => {
        initAccordion(section);
    });
    
    // Initialize tab switching for How It Works
    initTabSwitching();
    
    // Initialize FAQ tab switching
    initFaqTabSwitching();
    
    // Initialize eligibility form
    initEligibilityForm();
    
    // Initialize CTA buttons
    initCTAButtons();
    
    // Initialize FAQ accordion
    const faqAccordion = document.getElementById('faqAccordion');
    if (faqAccordion) {
        initAccordion(faqAccordion);
        console.log('FAQ accordion initialized');
    } else {
        console.log('faqAccordion not found');
    }
    
    // Initialize navigation dropdown
    initNavigationDropdown();
});

// Navigation Dropdown Functionality
function initNavigationDropdown() {
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
        
        console.log('Navigation dropdown initialized');
    } else {
        console.log('Navigation dropdown elements not found');
    }
}


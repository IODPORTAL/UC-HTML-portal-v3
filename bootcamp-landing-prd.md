# Bootcamp Landing Page - Product Requirements Document

## Executive Summary
This document outlines the requirements for creating a modern, conversion-focused landing page for the Data Science & AI Bootcamp programme, following the University of Canterbury's design system while incorporating new sections optimized for user engagement and enrollment.

## Project Goals
1. Create a professional landing page that maintains UC's brand identity
2. Optimize for conversions with strategic form placement and CTAs
3. Provide comprehensive programme information in an engaging format
4. Ensure responsive design across all devices
5. Implement interactive elements to enhance user experience

## Design System Specifications

### Color Palette
```css
--primary-red: #CE3E2E;
--secondary-black: #000000;
--white: #FFFFFF;
--light-gray: #F5F5F5;
--medium-gray: #E0E0E0;
--dark-gray: #333333;
--text-gray: #666666;
--success-green: #4CAF50;
--shadow: rgba(0, 0, 0, 0.1);
```

### Typography
```css
--font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--h1-size: 44px;
--h2-size: 36px;
--h3-size: 24px;
--h4-size: 20px;
--body-size: 16px;
--small-size: 14px;
--line-height: 1.5;
```

### Spacing System
```css
--spacing-xs: 8px;
--spacing-sm: 16px;
--spacing-md: 24px;
--spacing-lg: 32px;
--spacing-xl: 48px;
--spacing-xxl: 80px;
--section-padding: 80px 0;
```

### Design Elements
```css
--border-radius: 4px;
--border-radius-lg: 8px;
--box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
--box-shadow-hover: 0 6px 12px rgba(0, 0, 0, 0.15);
--transition: all 0.3s ease;
```

## Page Sections Detailed Specifications

### 1. Header (Sticky)
**Purpose**: Primary navigation and branding
**Components**:
- UC logo (left aligned)
- Navigation menu (right aligned)
- Mobile hamburger menu
- Sticky behavior on scroll

**Specifications**:
- Height: 80px desktop, 60px mobile
- Background: White with subtle shadow on scroll
- Z-index: 1000

### 2. Hero Section
**Purpose**: Primary value proposition and lead capture
**Layout**: Two-column (60/40 split)

**Left Column**:
- H1: "DATA SCIENCE & ARTIFICIAL INTELLIGENCE PROGRAMME"
- H2: "with the University of Canterbury"
- Programme description (2-3 sentences)
- Background image with overlay

**Right Column**:
- White form box with shadow
- Form title: "Download Course Outline"
- Fields: First name, Last name, Email, Phone, Programme dropdown
- Privacy policy consent
- CTA button: "Download Now"

### 3. Company Logos Slider
**Purpose**: Social proof through employer partnerships
**Components**:
- Section heading: "Where Our Graduates Work"
- Auto-scrolling logo carousel
- 10-12 company logo placeholders
- Pause on hover functionality

### 4. Programme Overview
**Purpose**: Detailed programme information
**Layout**: Two-column on desktop, stacked on mobile
**Background**: UC Red (#CE3E2E)

**Content**:
- Overview heading and description
- Key programme benefits
- Side box: "Discuss with a Career Consultant" CTA

### 5. Key Information Grid
**Purpose**: Quick programme facts
**Layout**: 4-column grid (2x2 on tablet, 1x4 on mobile)

**Cards**:
1. Duration: "12 or 24 Weeks"
2. Format: "Full-time or Part-time"
3. Learning: "Remote or In-Person"
4. Support: "Career Coaching Included"

**Design**: Icon + heading + description for each card

### 6. How It Works
**Purpose**: Enrollment process visualization
**Layout**: Horizontal timeline (vertical on mobile)

**Steps**:
1. Download course outline
2. Check eligibility
3. Attend info sessions
4. Choose your schedule
5. Select payment option
6. Begin your journey

### 7. Course Syllabus
**Purpose**: Detailed curriculum overview
**Layout**: Accordion or card-based design

**Modules** (10 total):
1. Mathematics, Statistics and Programming
2. Exploratory Data Analysis
3. Databases and APIs
4. Machine Learning - Regression
5. Machine Learning - Classification
6. Unsupervised Learning
7. Decision Trees and Ensemble Methods
8. Natural Language Processing
9. AI and Deep Learning
10. Generative AI and Deployment

### 8. Programme Structure
**Purpose**: Learning journey visualization
**Components**:
- Pre-work phase
- Training methodology
- Job outcomes programme
- Visual timeline or flowchart

### 9. Testimonials
**Purpose**: Student success stories
**Layout**: Slider with navigation

**Each testimonial**:
- Student photo (placeholder)
- Name and programme
- Quote (2-3 sentences)
- Previous role → Current role

### 10. Next Cohort Countdown
**Purpose**: Create urgency
**Components**:
- Dynamic countdown timer
- Next start dates (FT & PT)
- "Limited Seats Available" messaging

### 11. FAQ Section
**Purpose**: Address common questions
**Layout**: Expandable accordion

**Questions**:
- Programme fees and payment options
- Entry requirements
- Time commitment details
- Technical requirements
- Job placement support

### 12. Footer
**Purpose**: Additional navigation and information
**Layout**: 4-column grid

**Columns**:
1. UC branding and description
2. Programmes links
3. Information links
4. Partner logos and legal

### 13. Sticky CTA Footer
**Purpose**: Persistent conversion opportunity
**Behavior**:
- Appears after scrolling past hero
- Initially shows email field
- Expands to full form on interaction
- Smooth slide-up animation

## Technical Requirements

### Performance
- Page load time < 3 seconds
- Optimized images (WebP with fallbacks)
- Lazy loading for below-fold content
- Minified CSS/JS

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader friendly
- Focus indicators
- Alt text for all images

### Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: ≥ 1024px
- Large Desktop: ≥ 1440px

## JavaScript Functionality

### Core Features
1. **Form Handling**
   - Client-side validation
   - Error messaging
   - Success state
   - Integration ready for HubSpot

2. **Sliders/Carousels**
   - Logo carousel (auto-play)
   - Testimonial slider (manual navigation)
   - Touch/swipe support

3. **Countdown Timer**
   - Dynamic calculation to next cohort
   - Real-time updates
   - Timezone consideration

4. **Sticky Elements**
   - Header on scroll
   - CTA footer appearance

5. **Smooth Interactions**
   - Scroll animations
   - FAQ accordion
   - Mobile menu toggle
   - Progress indicators

## Content Guidelines

### Tone of Voice
- Professional yet approachable
- Action-oriented
- Benefits-focused
- Clear and concise

### SEO Considerations
- Meta title: "Data Science & AI Bootcamp | University of Canterbury"
- Meta description: 160 characters
- Structured data for courses
- Optimized heading hierarchy

## Success Metrics
- Form submission rate > 15%
- Average time on page > 3 minutes
- Bounce rate < 40%
- Mobile conversion rate parity

## Implementation Timeline
1. HTML structure: 2 hours
2. CSS styling: 3 hours
3. JavaScript functionality: 2 hours
4. Responsive optimization: 1 hour
5. Testing and refinement: 1 hour

## Deliverables
1. index.html - Complete HTML structure
2. css/styles.css - Comprehensive stylesheet
3. js/main.js - All JavaScript functionality
4. README.md - Implementation notes
5. Assets folder - Placeholder images/icons
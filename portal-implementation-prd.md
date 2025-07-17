# UC Portal Implementation PRD

## Overview
This document outlines the requirements for implementing the UC Portal with a modern shadcn-style layout, Memberstack integration for user progression tracking, and three core pages: Check Eligibility, Apply, and Course Outlines.

## Key Features
- Sticky left sidebar navigation with shadcn styling
- Memberstack custom field "stage" integration for content visibility control
- Three main portal pages with specific functionality
- UC brand consistency throughout
- Responsive design with modern UI patterns

## Implementation Breakdown

### Phase 1: Core Layout & Navigation
1. **Sidebar Navigation Setup**
   - Sticky left sidebar (non-scrolling)
   - Shadcn-style design with icons
   - Red left border for active/hover states
   - Responsive behavior for mobile

2. **Header Integration**
   - Use existing UC header component
   - Ensure consistency with main site
   - No footer required

3. **Base Portal Structure**
   - Create portal wrapper with sidebar + content area
   - Implement routing or section switching
   - Set up base CSS following UC design system

### Phase 2: Check Eligibility Page
1. **Form Implementation**
   - Education level selection (dropdown/radio)
   - Time commitment checkbox (minimum hours per week)
   - Part-time/Full-time preference

2. **Eligibility Logic**
   - Pass if: Degree or higher + Can commit to minimum hours
   - On success: Update Memberstack custom field "stage" to 2
   - Show success message with cohort dates and apply button

3. **Content Visibility**
   - If stage = 1: Show eligibility checker form
   - If stage >= 2: Show success message with upcoming cohorts

### Phase 3: Apply Page
1. **Course Selection**
   - Display available courses (Data Science, Software Engineering, Cyber Security)
   - Course selection interface

2. **Cohort Selection**
   - Show upcoming cohorts (2 each for full-time/part-time)
   - Display start dates
   - Selection mechanism

3. **Payment Options**
   - Deposit option: $500
   - Upfront payment: $10,000 (20% discount)
   - Integration with Stripe hosted payment links

4. **Payment Success Flow**
   - Update Memberstack custom field "stage" to 3
   - Show enrollment confirmation
   - Display "Admissions will contact in 24 hours" message

### Phase 4: Course Outlines Page
1. **Menu Structure**
   - Parent menu item: "Resources" (no direct link)
   - Sub-items: "Course Outlines", "Career Consultation" (placeholder)

2. **Course Outlines Interface**
   - Three tabs for course switching
   - Embedded PDF viewer for Google Drive PDFs
   - "Open" and "Save" buttons for each PDF

### Phase 5: Memberstack Integration
1. **Stage Management**
   - Stage 1: New user (eligibility check required)
   - Stage 2: Eligible (can view cohorts and apply)
   - Stage 3: Enrolled (payment completed)

2. **Content Control**
   - Implement show/hide logic based on stage value
   - Ensure smooth transitions between stages
   - Handle edge cases and loading states

## Technical Requirements

### Frontend
- HTML5, CSS3, JavaScript
- Shadcn-inspired component styling
- Responsive design (mobile-first approach)
- Smooth animations and transitions

### Memberstack Integration
- Read/write custom field "stage"
- Handle authentication state
- Implement content visibility controls

### Stripe Integration
- Programmatic payment link generation
- Success/failure callback handling
- Payment confirmation flow

### Design Requirements
- Follow UC brand guidelines
- Consistent typography and spacing
- Accessible color contrast
- Modern, clean interface
- Red accent color for active states

## Development Tasks

1. **Task 1: Sidebar Navigation & Layout**
   - Create sticky sidebar component
   - Implement navigation items with icons
   - Add red border hover/active states
   - Set up base portal layout

2. **Task 2: Check Eligibility Page**
   - Build eligibility form
   - Implement validation logic
   - Create success state UI
   - Integrate Memberstack stage update

3. **Task 3: Apply Page - Course Selection**
   - Create course selection interface
   - Build cohort selection component
   - Design payment options UI

4. **Task 4: Apply Page - Payment Integration**
   - Implement Stripe payment link generation
   - Handle payment callbacks
   - Update Memberstack on success

5. **Task 5: Course Outlines Page**
   - Create tabbed interface
   - Implement PDF viewer
   - Add download functionality

6. **Task 6: Memberstack Content Control**
   - Implement stage-based visibility
   - Test all user flows
   - Handle edge cases

## Success Criteria
- Seamless user experience from eligibility check to enrollment
- Proper stage progression tracking
- Reliable payment processing
- Consistent UC branding
- Mobile-responsive design
- Accessible to all users

## Notes
- Authentication is handled by Memberstack (no additional auth needed)
- All pages under /portal are already access-restricted
- Focus on content visibility control via custom field "stage"
- Maintain UC design consistency throughout
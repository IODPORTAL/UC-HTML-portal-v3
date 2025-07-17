# Memberstack Vanilla JS Guide & Webflow Data Attributes - Complete Documentation

This comprehensive documentation covers the Vanilla JS implementation and all Webflow Package Data Attributes for Memberstack.

---

# Vanilla JS Guide

## Introduction

Memberstack can be integrated into a Vanilla JS environment in two distinct ways:

1. **Utilizing the @memberstack/dom NPM package**
2. **Employing the memberstack.js static library**

## Comparing the Two Approaches

### @memberstack/dom NPM Package

**Use when:**
- You're building a Single Page App (SPA)
- Your project incorporates node package managers & build tools
- You're using frameworks that need compilation & build steps, like Vue SFCs, SvelteKit, or Typescript

**Benefits:**
- Full access to the core API
- Better for complex applications
- TypeScript support
- Modular imports

### memberstack.js Static Library

**Use when:**
- Projects without package managers or build steps
- Simplicity in integration, especially with non-SPA websites
- Ease of use with ms-member data-attribute directives

**Benefits:**
- No build tools required
- Simple script inclusion
- Identical to the script used in Webflow
- Access to data-attribute directives

**Limitations:**
- This script doesn't reinitialize in SPAs with virtual DOMs

## Implementation Methods

### Method 1: Static Library (memberstack.js)

The static library allows you to utilize ms-member data-attribute directives and provides access to all DOM API methods through the `$memberstackDom` global variable.

```html
<html lang="en">
<head>
  <script 
    data-memberstack-app="your_app_id_here" 
    src="https://static.memberstack.com/scripts/v1/memberstack.js" 
    type="text/javascript">
  </script>
</head>
<body>
  <script>
    const memberstack = window.$memberstackDom;
    
    // Session Duration (optional)
    ms_session_duration_days = 14; // days
    
    // Example API usage
    memberstack.getApp().then(({ data: app }) => console.log({ app }))
  </script>
</body>
</html>
```

**Key Features:**
- Auth-related data attributes on forms will redirect users based on your dashboard settings in Memberstack
- A test mode banner appears if production/live domains aren't configured in the dashboard
- Access to all core methods via `window.$memberstackDom`
- Can override session duration with `ms_session_duration_days` variable

### Method 2: NPM Package (@memberstack/dom)

If you prefer working with frameworks, build tools and package managers:

```bash
npm install @memberstack/dom
```

```javascript
import memberstackDOM from "@memberstack/dom";

const memberstack = memberstackDOM.init({
  publicKey: "pk_...", // Found in the dev tools section of the dashboard
  useCookies: true // Optional
});

// Example usage
memberstack.getCurrentMember().then(member => {
  if (member) {
    console.log('User is logged in:', member);
  } else {
    console.log('User is not logged in');
  }
});
```

## Modular Usage Pattern

For better organization, you can create a reusable Memberstack module:

```javascript
// lib/memberstack.js
import memberstackDOM from "@memberstack/dom";

const memberstack = memberstackDOM.init({
  publicKey: "pk_...",
});

export default memberstack;
```

Then import in other files:

```javascript
// other-file.js
import memberstack from "./lib/memberstack.js";

// Use memberstack methods
memberstack.getCurrentMember().then(member => {
  // Handle member data
});
```

## Common Integration Patterns

### Authentication Check

```javascript
// Using static library
const memberstack = window.$memberstackDom;

// Using NPM package
// import memberstack from "./lib/memberstack.js";

async function checkAuth() {
  try {
    const member = await memberstack.getCurrentMember();
    if (member) {
      // User is authenticated
      showMemberContent(member);
    } else {
      // User is not authenticated
      showPublicContent();
    }
  } catch (error) {
    console.error('Auth check failed:', error);
  }
}
```

### Modal Integration

```javascript
// Open login modal
memberstack.openModal("LOGIN");

// Open signup modal
memberstack.openModal("SIGNUP");

// Open forgot password modal
memberstack.openModal("FORGOT_PASSWORD");

// Handle modal promises
memberstack.openModal("LOGIN").then((loginData) => {
  console.log("User logged in!", loginData);
  // Close modal after login
  memberstack.hideModal();
});
```

### Form Handling Without Data Attributes

```javascript
// Custom login form handler
async function handleLogin(email, password) {
  try {
    const member = await memberstack.loginMemberEmailPassword({
      email: email,
      password: password
    });
    console.log('Login successful:', member);
    // Redirect or update UI
  } catch (error) {
    console.error('Login failed:', error);
    // Show error message
  }
}

// Custom signup form handler
async function handleSignup(email, password, customFields = {}) {
  try {
    const member = await memberstack.signupMemberEmailPassword({
      email: email,
      password: password,
      customFields: customFields
    });
    console.log('Signup successful:', member);
    // Redirect or update UI
  } catch (error) {
    console.error('Signup failed:', error);
    // Show error message
  }
}
```

## Important Notes

### Version Considerations
- The static library URL includes "v1" but this refers to the script version, not Memberstack version
- This script is fully compatible with Memberstack 2.0
- The angle brackets in documentation (`<https://...>`) are placeholders - replace with actual URL

### Session Management
- Default session duration can be overridden with `ms_session_duration_days` variable
- Sessions persist across browser tabs when using cookies
- LocalStorage is used by default, cookies are optional

### SPA Considerations
- Static library doesn't reinitialize in SPAs with virtual DOMs
- For SPAs, consider using the NPM package instead
- If using static library with SPA, manually reinitialize when needed

---

# All Webflow Package Data Attributes

The Webflow Package is a wrapper around the DOM Package, adding data attributes to access different Memberstack methods directly in your Webflow project. This guide provides a complete list of available data attributes, their functions, and usage examples.

## Pre-built Modals

Pre-built modals are a quick way to test out and get your membership site working.

### Basic Modal Attributes

```html
<!-- Opens Memberstack's pre-built login modal -->
<a data-ms-modal="login" href="#">Login</a>

<!-- Opens signup modal -->
<a data-ms-modal="signup" href="#">Sign Up</a>

<!-- Opens forgot password modal -->
<a data-ms-modal="forgot-password" href="#">Forgot Password</a>

<!-- Opens reset password modal -->
<a data-ms-modal="reset-password" href="#">Reset Password</a>

<!-- Opens profile modal -->
<a data-ms-modal="profile" href="#">Profile</a>
```

### Profile Modal Tabs

To open a profile modal and display a specific tab:

```html
<!-- Team tab -->
<a data-ms-modal="profile" data-ms-modal-tab="team" href="#">Team Settings</a>

<!-- Member settings -->
<a data-ms-modal="profile" data-ms-modal-tab="profile" href="#">Profile Settings</a>

<!-- Security settings -->
<a data-ms-modal="profile" data-ms-modal-tab="security" href="#">Security Settings</a>

<!-- Change password -->
<a data-ms-modal="profile" data-ms-modal-tab="changePassword" href="#">Change Password</a>

<!-- Plans -->
<a data-ms-modal="profile" data-ms-modal-tab="plans" href="#">My Plans</a>
```

### Custom Loader

```html
<!-- Replace the default Memberstack loader with custom content -->
<!-- Ensure the element is initially hidden with display: none -->
<div data-ms-loader style="display: none">
  <img src="loader.gif" alt="Loading...">
</div>
```

## Authentication Forms

### Signup Forms

```html
<!-- Basic signup form -->
<form data-ms-form="signup">
  <label>Email:</label>
  <input type="email" data-ms-member="email" required>
  
  <label>Password:</label>
  <input type="password" data-ms-member="password" required>
  
  <!-- Custom fields -->
  <label>First Name:</label>
  <input type="text" data-ms-member="firstName">
  
  <label>Last Name:</label>
  <input type="text" data-ms-member="lastName">
  
  <button type="submit">Sign Up</button>
</form>

<!-- Signup with specific plan -->
<form data-ms-form="signup" data-ms-plan="PLAN_ID">
  <!-- form fields -->
</form>
```

### Login Forms

```html
<!-- Basic login form -->
<form data-ms-form="login">
  <label>Email:</label>
  <input type="email" data-ms-member="email" required>
  
  <label>Password:</label>
  <input type="password" data-ms-member="password" required>
  
  <button type="submit">Log In</button>
</form>
```

### Password Reset Forms

```html
<!-- Forgot password form -->
<form data-ms-form="forgot-password">
  <label>Email:</label>
  <input type="email" data-ms-member="email" required>
  <button type="submit">Send Reset Link</button>
</form>

<!-- Reset password form (with token) -->
<form data-ms-form="reset-password">
  <input type="text" data-ms-member="token" placeholder="Reset token">
  <input type="password" data-ms-member="newPassword" placeholder="New password">
  <button type="submit">Reset Password</button>
</form>
```

### Update Password Form

```html
<!-- Change password form -->
<form data-ms-form="update-password">
  <label>Current Password:</label>
  <input type="password" data-ms-member="currentPassword" required>
  
  <label>New Password:</label>
  <input type="password" data-ms-member="newPassword" required>
  
  <button type="submit">Update Password</button>
</form>
```

## Social Authentication

### Social Login Buttons

```html
<!-- Must be used inside signup or login forms -->
<form data-ms-form="signup">
  <!-- Regular email/password fields -->
  <input type="email" data-ms-member="email">
  <input type="password" data-ms-member="password">
  
  <!-- Social login buttons -->
  <a data-ms-auth-provider="google" href="#">Continue with Google</a>
  <a data-ms-auth-provider="facebook" href="#">Continue with Facebook</a>
  <a data-ms-auth-provider="microsoft" href="#">Continue with Microsoft</a>
  <a data-ms-auth-provider="github" href="#">Continue with GitHub</a>
  <a data-ms-auth-provider="linkedin" href="#">Continue with LinkedIn</a>
  <a data-ms-auth-provider="spotify" href="#">Continue with Spotify</a>
  <a data-ms-auth-provider="dribbble" href="#">Continue with Dribbble</a>
  
  <button type="submit">Sign Up</button>
</form>
```

### Social Provider Management

```html
<!-- Container for managing social providers -->
<div data-ms-auth="manage-providers">
  <h3>Connected Accounts</h3>
  
  <!-- Connect/disconnect buttons for each provider -->
  <a data-ms-auth-provider="google" href="#">Google</a>
  <a data-ms-auth-provider="facebook" href="#">Facebook</a>
  <a data-ms-auth-provider="github" href="#">GitHub</a>
  
  <!-- Status will be automatically managed -->
</div>
```

**Important Note:** If members only have a single social auth provider connected and do not have a password assigned, they will get an error when trying to disconnect their last provider. This is a failsafe so members can still log back in.

## Member Data Display

### Basic Member Information

```html
<!-- Display member email -->
<div data-ms-member="email"></div>

<!-- Use in input to populate/submit email -->
<input type="email" data-ms-member="email">

<!-- Display signup date -->
<div data-ms-member="signupDate"></div>

<!-- Display custom field values -->
<div data-ms-member="firstName"></div>
<div data-ms-member="lastName"></div>
<div data-ms-member="CUSTOM_FIELD_ID"></div>
```

### Special Member Attributes

```html
<!-- For password inputs -->
<input type="password" data-ms-member="password">

<!-- For submitting reset password tokens -->
<input type="text" data-ms-member="token">

<!-- For new password during reset -->
<input type="password" data-ms-member="newPassword">

<!-- For current password during password change -->
<input type="password" data-ms-member="currentPassword">
```

## Action Triggers

### User Actions

```html
<!-- Resend verification email -->
<a data-ms-action="resend-verification-email" href="#">
  Resend verification email
</a>

<!-- Open Stripe customer portal -->
<a data-ms-action="customer-portal" href="#">
  Manage Subscription
</a>

<!-- Logout button (automatically hides if user not logged in) -->
<a data-ms-action="logout" href="#">Logout</a>

<!-- Redirect to login redirect URL -->
<a data-ms-action="login-redirect" href="#">Go to Dashboard</a>

<!-- Delete account (permanent action) -->
<button data-ms-action="delete-account">Delete My Account</button>
```

**Important:** Account deletion is permanent and cannot be undone. It will log the member out, delete their account from Memberstack, and cancel any recurring subscriptions in Stripe. Implement a confirmation step before triggering this action.

## Content Visibility

### Basic Visibility Controls

```html
<!-- Show to logged in members only -->
<div data-ms-content="members">
  Members Only Content
</div>

<!-- Show to logged out users only -->
<div data-ms-content="!members">
  Logged Out Users Only Content
</div>

<!-- Show to verified members only -->
<div data-ms-content="verified">
  Verified Members Only Content
</div>
```

### Plan-Based Visibility

```html
<!-- Show to members with free plans -->
<div data-ms-content="free-plans">
  Free Plan Content
</div>

<!-- Show to members without free plans -->
<div data-ms-content="!free-plans">
  Paid Members Content
</div>

<!-- Show to members in trial period -->
<div data-ms-content="is-trialing">
  Trial Content
</div>

<!-- Show to members not in trial -->
<div data-ms-content="!is-trialing">
  Non-Trial Content
</div>
```

### Specific Plan Access

```html
<!-- Show to members with a specific plan -->
<div data-ms-content="[PLAN_ID]">
  Specific Plan Content
</div>

<!-- Show to members without a specific plan -->
<div data-ms-content="![PLAN_ID]">
  Content for users without this plan
</div>
```

## Plan Management

### Plan Signup

```html
<!-- Free plan signup -->
<a data-ms-action="add-plan" data-ms-plan="PLAN_ID" href="#">
  Get Free Plan
</a>

<!-- Paid plan signup (redirects to checkout) -->
<a data-ms-action="add-plan" data-ms-plan="PRICE_ID" href="#">
  Subscribe to Pro Plan
</a>
```

### Plan Information Display

```html
<!-- Display current plan name -->
<div data-ms-member="planName"></div>

<!-- Display plan status -->
<div data-ms-member="planStatus"></div>

<!-- Display plan features -->
<div data-ms-plan="features"></div>
```

## Commenting System

### Channel Management

```html
<!-- Define commenting section -->
<div data-ms-channel="channelId">
  <!-- Comments will appear here -->
</div>

<!-- Channel with custom configuration -->
<div data-ms-channel="posts" data-ms-channel-sort="newest">
  <!-- Sorted comments -->
</div>
```

### Post Management

```html
<!-- Individual post container -->
<div data-ms-post="container">
  <!-- Post content -->
  <div data-ms-post="content"></div>
  
  <!-- Show if user is moderator -->
  <div data-ms-post="isModerator">
    <button data-ms-post="edit">Edit</button>
    <button data-ms-post="delete">Delete</button>
  </div>
  
  <!-- Owner profile image -->
  <img data-ms-post="ownerProfileImage" alt="Profile">
  
  <!-- Thread management -->
  <div data-ms-post="showThreads">
    <div data-ms-thread="container">
      <!-- Thread content -->
    </div>
  </div>
</div>
```

### Thread Management

```html
<!-- Thread container -->
<div data-ms-thread="container">
  <!-- Individual thread item -->
  <div data-ms-thread="item">
    <div data-ms-thread="content"></div>
  </div>
  
  <!-- Load more threads -->
  <button data-ms-thread="loadMore">Load More</button>
  
  <!-- Thread sorting -->
  <div data-ms-thread="sort"></div>
</div>
```

## Custom Integrations

### Accessing DOM Package Methods

When using the Webflow Package, you can also access all DOM Package methods:

```html
<script>
// Access the DOM package through the global variable
const memberstack = window.$memberstackDom;

// Use any DOM package method
memberstack.getCurrentMember().then(({ data: member }) => {
  if (member) {
    console.log('Member data:', member);
    
    // Example: Set Stripe Customer ID in a hidden field
    document.getElementById('stripeCustomerId').value = member.stripeCustomerId;
  }
});

// Purchase plans programmatically
memberstack.purchasePlansWithCheckout({
  priceId: "price_abc"
}).then(result => {
  console.log('Checkout initiated:', result);
});

// Launch customer portal
memberstack.launchStripeCustomerPortal().then(result => {
  window.location.href = result.url;
});
</script>
```

### Custom Field Access

```javascript
// Get custom field values
memberstack.getCurrentMember().then(({ data: member }) => {
  if (member && member.customFields) {
    const firstName = member.customFields.firstName;
    const company = member.customFields.company;
    // Use the data as needed
  }
});
```

## Best Practices

### Form Validation

```html
<!-- Always include proper validation -->
<form data-ms-form="signup">
  <input type="email" data-ms-member="email" required>
  <input type="password" data-ms-member="password" required minlength="8">
  <button type="submit">Sign Up</button>
</form>
```

### Error Handling

```html
<!-- Include error display elements -->
<form data-ms-form="login">
  <input type="email" data-ms-member="email" required>
  <input type="password" data-ms-member="password" required>
  
  <!-- Error messages will appear here -->
  <div data-ms-form="error" style="color: red; display: none;"></div>
  
  <button type="submit">Log In</button>
</form>
```

### Loading States

```html
<!-- Show loading states during form submission -->
<form data-ms-form="signup">
  <input type="email" data-ms-member="email" required>
  <input type="password" data-ms-member="password" required>
  
  <button type="submit">
    <span data-ms-form="default">Sign Up</span>
    <span data-ms-form="loading" style="display: none;">Signing up...</span>
  </button>
</form>
```

### Conditional Content

```html
<!-- Combine multiple conditions -->
<div data-ms-content="members" data-ms-content="verified">
  Content for verified members only
</div>

<!-- Progressive disclosure -->
<div data-ms-content="!members">
  <p>Please log in to access premium content.</p>
  <a data-ms-modal="login" href="#">Login</a>
</div>

<div data-ms-content="members" data-ms-content="![PREMIUM_PLAN_ID]">
  <p>Upgrade to premium for exclusive content.</p>
  <a data-ms-action="add-plan" data-ms-plan="PREMIUM_PRICE_ID" href="#">Upgrade</a>
</div>
```

## Integration Tips

### SEO Considerations

- Use `data-ms-content="!members"` for content that should be visible to search engines
- Place critical content outside of member-gated sections for better indexing
- Consider server-side rendering for important public content

### Performance Optimization

- Minimize the number of data attributes per page
- Use efficient selectors for content visibility
- Consider lazy loading for member-specific content

### Security Notes

- Data attributes handle client-side display only
- Always validate permissions server-side for sensitive operations
- Use HTTPS for all authentication-related forms
- Implement proper CSRF protection for critical actions

### Testing

- Test with both test mode and live mode
- Verify all authentication flows work correctly
- Test social provider connections in appropriate environments
- Validate that content visibility works as expected for different member states

---

This completes the comprehensive documentation for both Memberstack's Vanilla JS implementation and all available Webflow Package Data Attributes. Use this guide as your complete reference for implementing Memberstack in vanilla JavaScript environments or Webflow projects.
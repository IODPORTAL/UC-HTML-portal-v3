// Stripe Payment Handler
class PaymentHandler {
    constructor() {
        this.stripePublicKey = 'pk_test_...'; // Replace with actual Stripe public key
        this.backendUrl = '/api'; // Replace with actual backend URL
        this.webhookEndpoint = '/webhook/stripe';
    }
    
    // Create Stripe payment link
    async createPaymentLink(paymentData) {
        try {
            const response = await fetch(`${this.backendUrl}/create-payment-link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: paymentData.amount * 100, // Convert to cents
                    currency: paymentData.currency || 'aud',
                    course_id: paymentData.courseId,
                    cohort_id: paymentData.cohortId,
                    user_id: paymentData.userId,
                    success_url: paymentData.success_url,
                    cancel_url: paymentData.cancel_url,
                    metadata: {
                        course: paymentData.courseId,
                        cohort: paymentData.cohortId,
                        user_id: paymentData.userId,
                        stage: 'enrollment'
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to create payment link');
            }
            
            const result = await response.json();
            return result;
            
        } catch (error) {
            console.error('Payment link creation failed:', error);
            throw error;
        }
    }
    
    // Handle successful payment callback
    async handlePaymentSuccess(sessionId, memberstackInstance, memberData) {
        try {
            // Verify payment with backend
            const verification = await this.verifyPayment(sessionId);
            
            if (verification.success) {
                // Update Memberstack with enrollment data
                await memberstackInstance.updateMemberJSON({
                    customFields: {
                        ...memberData.customFields,
                        stage: '3',
                        enrolledCourse: verification.metadata.course,
                        enrolledCohort: verification.metadata.cohort,
                        paymentType: verification.amount >= 1000000 ? 'full' : 'deposit', // $10,000+ is full payment
                        enrollmentDate: new Date().toISOString(),
                        stripeSessionId: sessionId
                    }
                });
                
                return {
                    success: true,
                    enrollmentData: {
                        course: verification.metadata.course,
                        cohort: verification.metadata.cohort,
                        amount: verification.amount / 100
                    }
                };
            }
            
            throw new Error('Payment verification failed');
            
        } catch (error) {
            console.error('Payment success handling failed:', error);
            throw error;
        }
    }
    
    // Verify payment with backend
    async verifyPayment(sessionId) {
        try {
            const response = await fetch(`${this.backendUrl}/verify-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ session_id: sessionId })
            });
            
            if (!response.ok) {
                throw new Error('Payment verification failed');
            }
            
            return await response.json();
            
        } catch (error) {
            console.error('Payment verification failed:', error);
            throw error;
        }
    }
    
    // Handle payment cancellation
    handlePaymentCancelled() {
        return {
            success: false,
            message: 'Payment was cancelled. You can try again when ready.'
        };
    }
    
    // Create Stripe Customer Portal session
    async createCustomerPortalSession(stripeCustomerId) {
        try {
            const response = await fetch(`${this.backendUrl}/create-portal-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customer_id: stripeCustomerId,
                    return_url: `${window.location.origin}/portal.html#settings`
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to create customer portal session');
            }
            
            const result = await response.json();
            return result;
            
        } catch (error) {
            console.error('Customer portal creation failed:', error);
            throw error;
        }
    }
}

// Backend API endpoints (for reference - these would be implemented on your server)
/*
POST /api/create-payment-link
Body: {
    amount: number (in cents),
    currency: string,
    course_id: string,
    cohort_id: string,
    user_id: string,
    success_url: string,
    cancel_url: string,
    metadata: object
}
Response: {
    url: string,
    session_id: string
}

POST /api/verify-payment
Body: {
    session_id: string
}
Response: {
    success: boolean,
    amount: number,
    metadata: object
}

POST /api/create-portal-session
Body: {
    customer_id: string,
    return_url: string
}
Response: {
    url: string
}

POST /webhook/stripe
Body: Stripe webhook event
Headers: stripe-signature
*/

// Example backend implementation using Node.js and Express
const backendExample = `
const express = require('express');
const stripe = require('stripe')('sk_test_...');
const app = express();

app.use(express.json());

// Create payment link
app.post('/api/create-payment-link', async (req, res) => {
    try {
        const { amount, currency, course_id, cohort_id, user_id, success_url, cancel_url, metadata } = req.body;
        
        const paymentLink = await stripe.paymentLinks.create({
            line_items: [{
                price_data: {
                    currency: currency,
                    product_data: {
                        name: \`UC Online Bootcamp - \${course_id}\`,
                        description: \`\${cohort_id} cohort enrollment\`
                    },
                    unit_amount: amount
                },
                quantity: 1
            }],
            success_url: success_url + '?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: cancel_url,
            metadata: {
                ...metadata,
                user_id: user_id
            }
        });
        
        res.json({
            url: paymentLink.url,
            session_id: paymentLink.id
        });
        
    } catch (error) {
        console.error('Payment link creation failed:', error);
        res.status(500).json({ error: 'Payment link creation failed' });
    }
});

// Verify payment
app.post('/api/verify-payment', async (req, res) => {
    try {
        const { session_id } = req.body;
        
        const session = await stripe.checkout.sessions.retrieve(session_id);
        
        if (session.payment_status === 'paid') {
            res.json({
                success: true,
                amount: session.amount_total,
                metadata: session.metadata
            });
        } else {
            res.json({
                success: false,
                message: 'Payment not completed'
            });
        }
        
    } catch (error) {
        console.error('Payment verification failed:', error);
        res.status(500).json({ error: 'Payment verification failed' });
    }
});

// Create customer portal session
app.post('/api/create-portal-session', async (req, res) => {
    try {
        const { customer_id, return_url } = req.body;
        
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customer_id,
            return_url: return_url
        });
        
        res.json({
            url: portalSession.url
        });
        
    } catch (error) {
        console.error('Customer portal creation failed:', error);
        res.status(500).json({ error: 'Customer portal creation failed' });
    }
});

// Stripe webhook handler
app.post('/webhook/stripe', express.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = 'whsec_...';
    
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.log(\`Webhook signature verification failed.\`, err.message);
        return res.status(400).send(\`Webhook Error: \${err.message}\`);
    }
    
    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            // Update member data in Memberstack
            // This would typically involve calling Memberstack Admin API
            console.log('Payment successful:', session.metadata);
            break;
        case 'payment_intent.payment_failed':
            console.log('Payment failed:', event.data.object);
            break;
        default:
            console.log(\`Unhandled event type \${event.type}\`);
    }
    
    res.json({received: true});
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
`;

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaymentHandler;
} else {
    window.PaymentHandler = PaymentHandler;
}
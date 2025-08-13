// Stripe Configuration
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Stripe configuration constants
const STRIPE_CONFIG = {
  // Currency settings
  DEFAULT_CURRENCY: 'usd',
  
  // Payment method types
  PAYMENT_METHOD_TYPES: ['card'],
  
  // Checkout mode
  CHECKOUT_MODE: 'payment',
  
  // Webhook events to handle
  WEBHOOK_EVENTS: [
    'checkout.session.completed',
    'payment_intent.succeeded',
    'payment_intent.payment_failed'
  ]
};

module.exports = {
  stripe,
  STRIPE_CONFIG
}; 
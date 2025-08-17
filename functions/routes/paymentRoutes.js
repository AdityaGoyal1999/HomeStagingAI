const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');

// Initialize the payment controller
const paymentController = new PaymentController();

// Route to create Stripe checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    // The body is already parsed by express.json(), so we need to reconstruct it
    const rawBody = JSON.stringify(req.body);
    
    // Create a new request object with the raw body
    const webhookReq = {
      ...req,
      body: rawBody
    };

    await paymentController.createCheckoutSession(req, res);
  } catch (error) {
    console.error('Error in checkout session route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to handle Stripe webhooks (for payment completion)
router.post('/webhook', async (req, res) => {
  console.log("🔍 Webhook Route: Handler started");
  
  try {
    console.log("🔍 === WEBHOOK REQUEST DEBUG ===");
    console.log("🔍 Request path:", req.path);
    console.log("🔍 Request headers:", req.headers);
    console.log("🔍 Request body type:", typeof req.body);
    console.log("🔍 Is Buffer?", req.body instanceof Buffer);
    console.log("🔍 Constructor name:", req.body.constructor.name);
    console.log("🔍 Request body length:", req.body ? req.body.length : 'undefined');
    console.log("🔍 Stripe signature header:", req.headers['stripe-signature']);
    console.log("🔍 All headers keys:", Object.keys(req.headers));
    
    // Get the raw body captured by our custom middleware
    const rawBody = req.rawBody;
    console.log("🔍 Raw body type:", typeof rawBody);
    console.log("🔍 Raw body is Buffer?", rawBody instanceof Buffer);
    console.log("🔍 Raw body length:", rawBody ? rawBody.length : 'undefined');
    
    // Show the actual body content (first 100 chars if it's a string)
    if (rawBody instanceof Buffer) {
      console.log("🔍 Raw body as Buffer (first 100 chars):", rawBody.toString().substring(0, 100));
    } else {
      console.log("🔍 Raw body content:", rawBody);
    }
    
    console.log("🔍 === END DEBUG ===");
    console.log("🔍 Webhook Route: About to call handleWebhook");
    
    // Use the raw body for Stripe verification
    const webhookContent = {
      headers: req.headers,
      body: rawBody
    };

    await paymentController.handleWebhook(webhookContent, res);
    console.log("🔍 Webhook Route: handleWebhook completed");
  } catch (error) {
    console.error('🔍 Webhook Route: Error occurred:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get payment status from Stripe
router.get('/status/:sessionId', async (req, res) => {
  try {
    await paymentController.getPaymentStatus(req, res);
  } catch (error) {
    console.error('Error in payment status route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get all payments (admin purposes)
router.get('/all', async (req, res) => {
  try {
    await paymentController.getAllPayments(req, res);
  } catch (error) {
    console.error('Error in get all payments route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 
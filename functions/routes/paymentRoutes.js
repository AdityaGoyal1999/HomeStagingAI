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
    const successUrl = req.body.successUrl;
    const cancelUrl = req.body.cancelUrl;
    console.log("🔍 Success URL:", successUrl);
    console.log("🔍 Cancel URL:", cancelUrl);
    // const webhookReq = {
    //   ...req,
    //   body: rawBody,
    // };

    await paymentController.createCheckoutSession(req, res);
  } catch (error) {
    console.error('Error in checkout session route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to handle Stripe webhooks (for payment completion)
router.post('/webhook', async (req, res) => {
  try {
    // console.log("🔍 === WEBHOOK REQUEST DEBUG ===");
    // console.log("🔍 Request body type:", typeof req.body);
    // console.log("🔍 Is Buffer?", req.body instanceof Buffer);
    // console.log("🔍 Body length:", req.body ? req.body.length : 'undefined');
    // console.log("🔍 Stripe signature header:", req.headers['stripe-signature']);
    
    // body-parser.raw() should give us a Buffer
    const webhookContent = {
      headers: req.headers,
      body: req.body
    };

    await paymentController.handleWebhook(webhookContent, res);
  } catch (error) {
    console.error('Error in webhook route:', error);
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
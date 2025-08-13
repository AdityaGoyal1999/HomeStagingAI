const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');

// Initialize the payment controller
const paymentController = new PaymentController();

// Route to handle payment processing (dummy response for now)
router.post('/process', async (req, res) => {
  try {
    await paymentController.processPayment(req, res);
  } catch (error) {
    console.error('Error in payment route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get payment status (dummy response for now)
router.get('/status/:paymentId', async (req, res) => {
  try {
    await paymentController.getPaymentStatus(req, res);
  } catch (error) {
    console.error('Error in payment status route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 
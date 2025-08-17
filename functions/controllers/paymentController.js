const { stripe, STRIPE_CONFIG } = require('../config/stripe');

class PaymentController {
  /**
   * Create a Stripe checkout session
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createCheckoutSession(req, res) {
    try {
      const { amount, currency = 'usd', description, successUrl, cancelUrl } = req.body;
      
      if (!amount || !successUrl || !cancelUrl) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: amount, successUrl, cancelUrl'
        });
      }

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: currency,
              product_data: {
                name: description || 'Home Staging Service',
                description: 'Professional home staging service',
              },
              unit_amount: amount, // Amount in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          description: description || 'Home Staging Service',
          timestamp: new Date().toISOString()
        }
      });

      res.status(200).json({
        success: true,
        sessionId: session.id,
        checkoutUrl: session.url,
        message: 'Checkout session created successfully'
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create checkout session',
        message: error.message 
      });
    }
  }

  /**
   * Handle Stripe webhook for payment completion
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async handleWebhook(content, res) {
    console.log("🔍 Webhook received");
    console.log("🔍 Content Headers:", content.headers);
    console.log("🔍 Content Body:", content.body);
    const sig = content.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      console.log("🔍 About to verify Stripe signature...");
      event = stripe.webhooks.constructEvent(content.body, sig, endpointSecret);
      console.log("🔍 Stripe signature verification successful!");
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("🔍 Event type:", event.type);
    console.log("🔍 About to handle event...");

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        console.log("🔍 Processing checkout.session.completed...");
        const session = event.data.object;
        console.log('🔍 Payment completed for session:', session.id);
        console.log('🔍 Session amount:', session.amount_total);
        console.log('🔍 Session status:', session.payment_status);
        break;
        
        // Here you can add logic to:
        // - Update your database
        // - Send confirmation emails
        // - Update order status
        // - etc.
        
        console.log("🔍 checkout.session.completed processing complete");
        break;
      
      case 'payment_intent.succeeded':
        console.log("🔍 Processing payment_intent.succeeded...");
        const paymentIntent = event.data.object;
        console.log('🔍 Payment succeeded:', paymentIntent.id);
        console.log("🔍 payment_intent.succeeded processing complete");
        break;
      
      case 'payment_intent.payment_failed':
        console.log("🔍 Processing payment_intent.payment_failed...");
        const failedPayment = event.data.object;
        console.log('🔍 Payment failed:', failedPayment.id);
        console.log("🔍 payment_intent.payment_failed processing complete");
        break;
      
      default:
        console.log(`🔍 Unhandled event type: ${event.type}`);
    }

    console.log("🔍 About to send response...");
    res.json({ received: true });
    console.log("🔍 Response sent successfully!");
  }

  /**
   * Get payment status from Stripe
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getPaymentStatus(req, res) {
    try {
      const { sessionId } = req.params;
      
      if (!sessionId) {
        return res.status(400).json({
          success: false,
          error: 'Session ID is required'
        });
      }

      // Retrieve the checkout session from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'Session not found'
        });
      }

      res.status(200).json({
        success: true,
        sessionId: session.id,
        status: session.payment_status,
        amount: session.amount_total,
        currency: session.currency,
        customerEmail: session.customer_details?.email,
        paymentStatus: session.payment_status,
        createdAt: new Date(session.created * 1000).toISOString()
      });
    } catch (error) {
      console.error('Error getting payment status:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get payment status',
        message: error.message 
      });
    }
  }

  /**
   * Get all payment sessions (for admin purposes)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllPayments(req, res) {
    try {
      const { limit = 10 } = req.query;
      
      const sessions = await stripe.checkout.sessions.list({
        limit: parseInt(limit),
        expand: ['data.customer']
      });

      res.status(200).json({
        success: true,
        payments: sessions.data.map(session => ({
          id: session.id,
          amount: session.amount_total,
          currency: session.currency,
          status: session.payment_status,
          customerEmail: session.customer_details?.email,
          createdAt: new Date(session.created * 1000).toISOString()
        }))
      });
    } catch (error) {
      console.error('Error getting all payments:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get payments',
        message: error.message 
      });
    }
  }
}

module.exports = PaymentController; 
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

      // Get user ID from authenticated request
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
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
          timestamp: new Date().toISOString(),
          userId: userId  // Store user ID for webhook processing
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
  async handleWebhook(req, res) {
    console.log("🔍 Webhook received");
    console.log("🔍 Content Headers:", req.headers);
    console.log("🔍 Content Body:", req.body);
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      console.log("🔍 About to verify Stripe signature...");
      console.log("🔍 Endpoint secret exists:", !!endpointSecret);
      console.log("🔍 Signature header exists:", !!sig);
      console.log("🔍 Body type in controller:", typeof req.body);
      console.log("🔍 Body is Buffer in controller:", req.body instanceof Buffer);
      
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log("🔍 Stripe signature verification successful!");
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      console.error('❌ Error details:', err);
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
        
        // Add credits to user - checkout.session.completed means payment was successful
        await this.addCreditsToUser(session);

        // console.log("🔍 Event FOUND HERE:", event.data.object.id);
        console.log("🔍 Event FOUND HERE:", event.data.object);
        const stripeId = event.data.object.customer;
        await this.addStripeIdToUser(session, stripeId);
        
        console.log("🔍 checkout.session.completed processing complete");
        break;
        
        // Here you can add logic to:
        // - Update your database
        // - Send confirmation emails
        // - Update order status
        // - etc.
        
      
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

    console.log("🔍 Webhook processed successfully!");
    res.status(200).json({ received: true });
  }

  /**
   * Add credits to user after successful payment
   * @param {Object} session - Stripe checkout session object
   */
  async addCreditsToUser(session) {
    try {
      const userId = session.metadata?.userId;
      
      if (!userId) {
        console.error('❌ No userId found in session metadata:', session.id);
        return;
      }

      console.log(`🔍 Adding credits to user: ${userId}`);
      console.log(`🔍 Session metadata:`, session.metadata);
      
      // Import UserService to manage user credits
      const UserService = require('../services/userService');
      const userService = new UserService();
      
      console.log(`🔍 UserService created successfully`);
      
      // First, check if user exists
      try {
        const userProfile = await userService.getUserProfile(userId);
        console.log(`🔍 User profile found:`, userProfile);
        console.log(`🔍 Current credits:`, userProfile.credits);
      } catch (profileError) {
        console.log(`🔍 User profile not found, creating user:`, profileError.message);
        // Create user if they don't exist
        await userService.createUserIfNotExists(userId, {
          email: session.customer_details?.email || 'unknown@email.com',
          name: session.customer_details?.name || 'Unknown User'
        });
        console.log(`🔍 User created successfully`);
      }
      
      // Get current user credits
      console.log(`🔍 Getting current credits...`);
      const currentCredits = await userService.getUserCredits(userId);
      console.log(`🔍 Current credits retrieved:`, currentCredits);
      
      const newCredits = currentCredits + 100; // Add 100 credits
      console.log(`🔍 New credits total:`, newCredits);
      
      // Update user credits
      console.log(`🔍 Updating user credits...`);
      const result = await userService.updateUserCredits(userId, newCredits);
      console.log(`🔍 Credits update result:`, result);
      
      console.log(`✅ Successfully added 100 credits to user ${userId}. New total: ${newCredits}`);
      
    } catch (error) {
      console.error('❌ Error adding credits to user:', error);
      console.error('❌ Error stack:', error.stack);
      // Don't throw error to avoid webhook failure
    }
  }

  /**
   * Add Stripe event ID to user document for tracking
   * @param {Object} session - Stripe checkout session object
   */
  async addStripeIdToUser(session, stripeId) {
    try {
      const userId = session.metadata?.userId;
      
      if (!userId) {
        console.error('❌ No userId found in session metadata for addStripeIdToUser:', session.id);
        return;
      }

      console.log(`🔍 Adding Stripe ID to user: ${userId}`);
      console.log(`🔍 Stripe session ID:`, stripeId);
      
      // Import UserService to manage user data
      const UserService = require('../services/userService');
      const userService = new UserService();
      
      // Add Stripe session ID to user document
      const result = await userService.addStripeIdToUser(userId, stripeId);
      
      if (result) {
        console.log(`✅ Successfully added Stripe ID ${session.id} to user ${userId}`);
      } else {
        console.log(`⚠️ Stripe ID ${session.id} already exists for user ${userId}`);
      }
      
    } catch (error) {
      console.error('❌ Error adding Stripe ID to user:', error);
      console.error('❌ Error stack:', error.stack);
      // Don't throw error to avoid webhook failure
    }
  }

  /**
   * Get transactions for the authenticated user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getTransactions(req, res) {
    try {
      const userId = req.user.uid; // From JWT token
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }

      console.log(`🔍 Fetching transactions for user: ${userId}`);
      
      // Get user's Stripe ID from the database
      const UserService = require('../services/userService');
      const userService = new UserService();
      
      const user = await userService.getUserProfile(userId);
      const stripeId = user?.stripeId;
      
      if (!stripeId) {
        // User has no transactions yet
        return res.json({
          success: true,
          transactions: [],
          message: 'No Stripe ID found for user'
        });
      }

      // // Get the Stripe checkout session to find the customer ID
      // const session = await stripe.checkout.sessions.retrieve(stripeId);
      // const customerId = session.customer;
      
      // if (!customerId) {
      //   return res.json({
      //     success: true,
      //     transactions: [],
      //     message: 'No customer ID found'
      //   });
      // }

      console.log(`🔍 Trying to get charges for user: ${stripeId}`);
      const stripeCharges = await stripe.charges.list({
        customer: stripeId
      });

      console.log(`🔍 Stripe charges:`, stripeCharges);

      const transactions = stripeCharges.data.map(charge => ({
        id: charge.id,
        amount: charge.amount,
        currency: charge.currency,
        status: charge.status,
        created: new Date(charge.created * 1000).toISOString(), // unix → JS date
        customerEmail: charge.customer_details?.email,
        description: charge.description || 'Home staging service'
      }));
      res.json({
        success: true,
        transactions: transactions,
        userId: userId,
        totalTransactions: transactions.length
      });
      
    } catch (error) {
      console.error('❌ Error getting user transactions:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get transactions',
        message: error.message 
      });
    }
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
import React, { useState } from 'react';
import { auth } from '../firebase';

const StripeCheckout = ({ amount = 1000, description = "Home Staging Service" }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get the current authenticated user
      const userCredential = auth.currentUser;
      if (!userCredential) {
        setError('User not authenticated');
        return;
      }

      // Get the ID token for authentication
      const token = await userCredential.getIdToken();

      // Call your backend to create a checkout session
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: amount, // Amount in cents (e.g., 1000 = $10.00)
          currency: 'usd',
          description: description,
          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/payment-cancelled`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.error || 'Failed to create checkout session');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Complete Your Purchase</h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center py-3 border-b">
          <span className="text-gray-600">Service:</span>
          <span className="font-medium">{description}</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b">
          <span className="text-gray-600">Amount:</span>
          <span className="font-bold text-xl text-green-600">
            ${(amount / 100).toFixed(2)}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
        }`}
      >
        {loading ? 'Processing...' : 'Proceed to Checkout'}
      </button>

      <p className="text-xs text-gray-500 mt-3 text-center">
        You will be redirected to Stripe's secure checkout page
      </p>
    </div>
  );
};

export default StripeCheckout; 
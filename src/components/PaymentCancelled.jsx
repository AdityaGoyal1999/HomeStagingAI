import React from 'react';

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
        {/* Cancelled Icon */}
        <div className="text-yellow-500 text-6xl mb-6">❌</div>
        
        {/* Main Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Payment Cancelled
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges were made to your account.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="w-full py-2 px-6 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Try Again
          </button>
        </div>

        {/* Additional Info */}
        <p className="text-xs text-gray-500 mt-6">
          If you have any questions about our services or pricing, 
          please don't hesitate to contact our support team.
        </p>
      </div>
    </div>
  );
};

export default PaymentCancelled; 
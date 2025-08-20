import React from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
        {/* Success Icon */}
        <div className="text-green-500 text-6xl mb-6">✅</div>
        
        {/* Main Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Payment Complete!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your payment has been processed successfully.
        </p>

        {/* Session ID for reference */}
        {sessionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-3">Transaction Reference:</h3>
            <div className="text-sm">
              <span className="text-gray-600">Session ID:</span>
              <span className="font-mono text-gray-800 ml-2 break-all">{sessionId}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
          
          <button
            onClick={() => window.print()}
            className="w-full py-2 px-6 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Print Receipt
          </button>
        </div>

        {/* Additional Info */}
        <p className="text-xs text-gray-500 mt-6">
          A confirmation email has been sent to your email address.
          If you have any questions, please contact our support team.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess; 
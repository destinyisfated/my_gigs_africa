'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Button } from './ui/button';

// A simple utility to format the price string to match the image.
const formatPrice = (price: string) => {
  const number = parseFloat(price);
  if (isNaN(number)) {
    return "0";
  }
  return number.toString();
};

export default function JoinModal() {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [amount, setAmount] = useState<string>('200');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [pollingId, setPollingId] = useState<string | null>(null);

  const checkTransactionStatus = async (id: string) => {
    console.log(`Polling status for ID: ${id}`);
    try {
      const response = await fetch(`http://localhost:8000/payments/check-status/${id}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data.status === 'success' || data.status === 'failed') {
        setMessage(data.status === 'success' ? 'Payment was successful!' : 'Payment failed. Please try again.');
        setLoading(false);
        setPollingId(null);
      } else {
        // Still pending, continue polling
        setPollingId(id);
      }
    } catch (error: any) {
      console.error("Network error during status check:", error);
      setMessage("A network error occurred. Please ensure your Django backend is running and reachable.");
      setLoading(false);
      setPollingId(null);
    }
  };

  // Effect to handle the polling
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (pollingId) {
      interval = setInterval(() => {
        checkTransactionStatus(pollingId);
      }, 3000); // Poll every 3 seconds
    }
    // Cleanup on component unmount or when polling stops
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [pollingId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8000/payments/stk-push/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone_number: phoneNumber, amount: amount }),
      });

      const data = await response.json();
      console.log('STK Push initiated:', data);

      if (response.ok) {
        setMessage('STK Push initiated successfully. Please enter your M-Pesa PIN.');
        setPollingId(data.CheckoutRequestID);
      } else {
        setMessage(`Error: ${data.CustomerMessage || 'An unknown error occurred.'}`);
        setLoading(false);
      }

    } catch (error: any) {
      console.error("Network error:", error);
      setMessage("A network error occurred. Please ensure your Django backend is running and reachable.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-950/70 p-4">
      {/* The main modal container */}
      <div className="relative bg-white p-8 md:p-12 rounded-2xl shadow-2xl w-full max-w-xl text-center">
        {/* Close Button (Optional based on design, but good practice) */}
        <Button
          onClick={() => setMessage('')}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </Button>

        {/* Header Section */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-2">Join MyGigsAfrica</h1>

        {/* Premium Access Card */}
        <div className="bg-gray-100 rounded-xl p-6 text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-1">Premium Access</h2>
          <p className="text-gray-600">
            Unlimited gig postings for KES {formatPrice(amount)} Annually
          </p>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Phone Number Input */}
          <div className="text-left">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., 254712345678"
            />
          </div>

          {/* Amount Input */}
          <div className="text-left">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount (KSh)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., 200"
            />
          </div>

          {/* Payment Method Section */}
          <div className="text-left space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Payment Method</h3>
            <div className="flex items-center">
              <input
                type="radio"
                id="mpesa"
                name="paymentMethod"
                value="mpesa"
                checked
                readOnly
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <label htmlFor="mpesa" className="ml-3 block text-sm font-medium text-gray-700">
                M-Pesa
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all duration-300"
          >
            {loading ? 'Processing...' : `Complete Payment (KSh ${formatPrice(amount)})`}
          </Button>
        </form>

        {/* Message Display Area */}
        {message && (
          <div className={`mt-6 p-4 text-sm rounded-lg text-center font-semibold ${
            message.includes('success') 
              ? 'bg-green-100 text-green-700' 
              : message.includes('failed') || message.includes('error') 
              ? 'bg-red-100 text-red-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {message}
          </div>
        )}

        {/* Legal Text */}
        <p className="mt-6 text-xs text-gray-500 leading-relaxed">
          By joining, you agree to our{' '}
          <a href="#" className="underline hover:text-gray-700">Terms of Service</a> and{' '}
          <a href="#" className="underline hover:text-gray-700">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";

export default function PaymentPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pollingId, setPollingId] = useState(null);

  const checkTransactionStatus = async (checkoutRequestID) => {
    try {
      const response = await fetch(
        `http://localhost:8000/core/check-status/${checkoutRequestID}/`
      );
      const data = await response.json();
      
      if (data.status === 'success' || data.status === 'failed' || data.status === 'not_found') {
        clearInterval(pollingId);
        setPollingId(null);
        if (data.status === 'success') {
          setMessage("Payment successful! Thank you.");
        } else if (data.status === 'failed') {
          setMessage("Payment failed. Please try again.");
        } else if (data.status === 'not_found') {
          setMessage("Transaction not found. Please try again.");
        }
        setLoading(false);
      } else {
        setMessage("Payment pending. Please check your phone for the M-Pesa prompt.");
      }

    } catch (error) {
      console.error("Error checking transaction status:", error);
      clearInterval(pollingId);
      setPollingId(null);
      setMessage("A network error occurred. Please ensure your Django backend is running and reachable.");
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Processing your request...");

    try {
      const response = await fetch("http://localhost:8000/core/stk-push/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone_number: phoneNumber, amount: amount }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage("STK Push request sent successfully. Waiting for completion...");
        const newPollingId = setInterval(() => {
          checkTransactionStatus(data.CheckoutRequestID);
        }, 3000); // Poll every 3 seconds
        setPollingId(newPollingId);
      } else {
        setMessage(data.error || "An error occurred. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      setMessage("A network error occurred. Please ensure your Django backend is running and reachable.");
      setLoading(false);
    }
  };

  useEffect(() => {
    // Clean up the polling interval when the component unmounts
    return () => {
      if (pollingId) {
        clearInterval(pollingId);
      }
    };
  }, [pollingId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">M-Pesa Payment</h1>
        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

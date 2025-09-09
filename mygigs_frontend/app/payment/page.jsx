"use client";

import { useState } from 'react';

export default function PaymentPage() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pollingId, setPollingId] = useState(null);

    // This function polls the backend for the transaction status
    const checkTransactionStatus = async (checkoutRequestID) => {
        try {
            const response = await fetch(`http://localhost:8000/core/check-status/${checkoutRequestID}/`);
            const data = await response.json();

            if (data.status === 'success') {
                setMessage({ type: 'success', text: 'Payment Successful! Thank you for your transaction.' });
                setLoading(false);
            } else if (data.status === 'failed') {
                setMessage({ type: 'error', text: 'Transaction Failed. Please try again.' });
                setLoading(false);
            } else {
                // Keep polling if status is still pending
                setTimeout(() => checkTransactionStatus(checkoutRequestID), 3000);
            }
        } catch (error) {
            console.error('Network error during status check:', error);
            setMessage({ type: 'error', text: 'A network error occurred. Please ensure your Django backend is running and reachable.' });
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/core/stk-push/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone_number: phoneNumber, amount: amount }),
            });
            const data = await response.json();

            if (response.ok) {
                // If STK push is successfully sent, start polling
                setMessage({ type: 'info', text: 'STK push sent. Please approve the transaction on your phone.' });
                setPollingId(data.CheckoutRequestID);
                checkTransactionStatus(data.CheckoutRequestID);
            } else {
                setMessage({ type: 'error', text: data.error || 'STK Push request failed.' });
                setLoading(false);
            }
        } catch (error) {
            console.error('Network error during STK Push:', error);
            setMessage({ type: 'error', text: 'A network error occurred. Please ensure your Django backend is running and reachable.' });
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center text-gray-800">M-Pesa Payment</h1>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <label htmlFor="phone" className="sr-only">Phone Number</label>
                        <input
                            id="phone"
                            type="tel"
                            placeholder="Phone Number (e.g., 2547...)"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="amount" className="sr-only">Amount</label>
                        <input
                            id="amount"
                            type="number"
                            placeholder="Amount (in KES)"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-3 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : 'Pay with M-Pesa'}
                    </button>
                </form>

                {loading && (
                    <div className="flex justify-center items-center">
                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                    </div>
                )}

                {message && (
                    <div className={`mt-4 p-4 rounded-lg text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        <p className="font-medium">{message.text}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

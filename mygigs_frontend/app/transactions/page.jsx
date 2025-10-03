"use client";

import { useEffect, useState } from 'react';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // This URL must match your Django backend's API endpoint
        const response = await fetch('http://localhost:8000/core/transactions/');
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-gray-700">Loading transactions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8 font-inter">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8">
          M-Pesa Transaction History
        </h1>
        {transactions.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-sm">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-sm rounded-tl-lg">Receipt Number</th>
                  <th className="py-3 px-4 text-left font-semibold text-sm">Amount</th>
                  <th className="py-3 px-4 text-left font-semibold text-sm">Phone Number</th>
                  <th className="py-3 px-4 text-left font-semibold text-sm">Status</th>
                  <th className="py-3 px-4 text-left font-semibold text-sm rounded-tr-lg">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {transaction.mpesa_receipt_number || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {transaction.amount ? `KES ${parseFloat(transaction.amount).toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {transaction.phone_number || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold
                          ${transaction.result_code === '0'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {transaction.result_code === '0' ? 'Success' : 'Failed'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {transaction.transaction_date ? new Date(transaction.transaction_date).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg py-10">No transactions found.</p>
        )}
      </div>
    </div>
  );
}

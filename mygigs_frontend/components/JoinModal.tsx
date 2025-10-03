"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

// A simple utility to format the price string to match the image.
const formatPrice = (price: string) => {
  const number = parseFloat(price);
  if (isNaN(number)) {
    return "0";
  }
  return number.toString();
};

export default function PaymentPage() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [amount, setAmount] = useState<string>("1");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [pollingId, setPollingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const { user } = useUser();
  const clerkId = user?.id;

  const checkTransactionStatus = async (id: string) => {
    console.log(`Polling status for ID: ${id}`);
    try {
      const response = await fetch(
        `http://localhost:8000/core/check-status/${id}/`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.status === "success" || data.status === "failed") {
        const isSuccess = data.status === "success";
        setMessage(
          isSuccess
            ? "Payment was successful! Redirecting you to your profile..."
            : "Payment failed. Please try again."
        );
        setLoading(false);
        setPollingId(null);

        if (isSuccess) {
          // Redirect to the profile page after a brief delay

            router.push("/create-freelancer");
 // Wait 1 second before redirecting
        }
      } else {
        // Still pending, continue polling
        setPollingId(id);
      }
    } catch (error: any) {
      console.error("Network error during status check:", error);
      setMessage(
        "A network error occurred. Please ensure your Django backend is running and reachable."
      );
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
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/core/stk-push/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          amount: amount,
          clerk_id: clerkId,
        }),
      });

      const data = await response.json();
      console.log("STK Push initiated:", data);

      if (response.ok) {
        setMessage(
          "STK Push initiated successfully. Please enter your M-Pesa PIN."
        );
        setPollingId(data.CheckoutRequestID);
      } else {
        setMessage(
          `Error: ${data.CustomerMessage || "An unknown error occurred."}`
        );
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Network error:", error);
      setMessage(
        "A network error occurred. Please ensure your Django backend is running and reachable."
      );
      setLoading(false);
    }
  };

  return (
    <>
      {/* Initial Page View with Button */}
      {!isModalOpen && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Become a Freelancer
        </button>
      )}

      {/* The main modal container - conditionally rendered and animated */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-500 ease-out scale-100 opacity-100">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setMessage("");
                setLoading(false);
                setPollingId(null);
                setPhoneNumber("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>

            <div className="p-8 md:p-10 space-y-6">
              {/* Header */}
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-700">
                  Become A Freelancer
                </h1>
                <p className="mt-2 text-xs text-gray-600 font-semibold">
                  Unlock unlimited gig postings for KES {formatPrice(amount)}{" "}
                  annually.
                </p>
              </div>

              {/* Payment Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Phone Number Input */}
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-semibold text-gray-600 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow text-black text-sm font-medium"
                    placeholder="e.g., 254712345678"
                  />
                </div>

                {/* Amount Input */}
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-semibold text-gray-600 mb-1"
                  >
                    Amount (KSh)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                    className="w-full px-4 py-3 border font-black border-gray-300 rounded-xl text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow text-sm"
                    placeholder="e.g., 200"
                  />
                </div>

                {/* Payment Method Section - simplified */}
                <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800">
                    Payment Method
                  </span>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="mpesa"
                      name="paymentMethod"
                      value="mpesa"
                      checked
                      readOnly
                      className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <label
                      htmlFor="mpesa"
                      className="ml-2 block text-sm font-medium text-gray-700"
                    >
                      M-Pesa
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading
                    ? "Processing..."
                    : `Complete Payment (KSh ${formatPrice(amount)})`}
                </button>
              </form>

              {/* Message Display Area */}
              {message && (
                <div
                  className={`mt-6 p-4 text-sm rounded-xl text-center font-semibold ${
                    message.includes("success")
                      ? "bg-green-100 text-green-700"
                      : message.includes("failed") || message.includes("error")
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

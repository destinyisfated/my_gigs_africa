"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

export function JoinModal() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("200"); // Default to 200
  const [step, setStep] = useState<"form" | "processing" | "success">("form");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("processing");

    // Simulate an API call for payment processing
    setTimeout(() => {
      console.log("Payment Processed.");
      console.log("Phone Number:", phoneNumber);
      console.log("Amount:", amount);
      setStep("success");

      // In a real app, you would save the user's new freelancer status
      // to a database here.
    }, 2000);
  };

  const renderContent = () => {
    switch (step) {
      case "form":
        return (
          <>
            <DialogHeader className="p-6 flex justify-center">
              <DialogTitle className="text-3xl font-extrabold text-gray-800 text-center">
                Join MyGigsAfrica
              </DialogTitle>
            </DialogHeader>
            <div className="p-6 pt-0">
              <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 text-center font-bold">
                    Premium Access
                  </h3>
                  <p className="text-sm text-gray-500 font-semibold">
                    Unlimited gig postings for KES 250 Annually
                  </p>
                </div>
              </div>

              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <Label
                    htmlFor="phone-number"
                    className="text-slate-300 font-bold"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phone-number"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g., 254712345678"
                    required
                    className="mt-2 bg-white font-semibold text-sm"
                  />
                </div>

                <div className="mb-6">
                  <Label htmlFor="amount" className="text-slate-300">
                    Amount (KSh)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g., 200"
                    required
                    min="1"
                    className="mt-2 bg-white font-semibold text-sm"
                  />
                </div>

                <div className="mb-6">
                  <h4 className="text-md font-bold text-gray-200 mb-3">
                    Payment Method
                  </h4>
                  <RadioGroup defaultValue="mpesa">
                    <div className="flex items-center space-x-2 text-white">
                      <RadioGroupItem value="mpesa" id="r1" />
                      <Label htmlFor="r1">M-Pesa</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-l from-green-500 to-[#383842] text-purple-100 font-bold transition-colors duration-500 hover:bg-gradient-to-r hover:from-green-600 hover:to-[#222224] cursor-pointer"
                >
                  Complete Payment (KSh {amount})
                </Button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  By joining, you agree to our{" "}
                  <Link href="/terms" className="underline hover:text-gray-700">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="underline hover:text-gray-700"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>
            </div>
          </>
        );
      case "processing":
        return (
          <div className="flex flex-col items-center justify-center p-10 text-white">
            <Loader2 className="h-16 w-16 animate-spin text-green-500" />
            <p className="mt-4 text-lg">Processing your payment...</p>
          </div>
        );
      case "success":
        return (
          <div className="flex flex-col items-center justify-center p-10 text-white">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <p className="mt-4 text-lg font-semibold">Payment Successful!</p>
            <p className="text-sm text-gray-300 text-center mt-2">
              You are now a premium freelancer.
            </p>
            <Link href="/create-profile">
              <Button className="mt-6 bg-green-500 text-white">
                Create Your Freelancer Profile
              </Button>
            </Link>
          </div>
        );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-gradient-to-l from-green-500 to-[#383842] text-purple-100 font-bold transition-colors duration-500 hover:bg-gradient-to-r hover:from-green-600 hover:to-[#222224]"
        >
          Become a Freelancer KES 250
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] rounded-xl shadow-2xl backdrop-blur-lg"
        style={{
          background: "linear-gradient(135deg, #46a44eff 0%, #22252aff 100%)",
        }}
      >
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}

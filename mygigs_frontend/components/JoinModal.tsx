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
import { XIcon } from "lucide-react";
import Link from "next/link";

export function JoinModal() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("200"); // Default to 200, but allow manual change

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted with data:");
    console.log("Phone Number:", phoneNumber);
    console.log("Amount:", amount);

    // This is where you will re-add your M-Pesa integration later,
    // using both the phoneNumber and amount state values.
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-yellow-500 text-slate-900 font-bold hover:bg-yellow-400"
        >
          Join for KSh 200/year
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] rounded-xl shadow-2xl backdrop-blur-lg"
        style={{
          background: "linear-gradient(135deg, #e0e7ef 0%, #3b82f6 100%)",
        }}
      >
        <DialogHeader className="p-6">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Join MyGigsAfrica
          </DialogTitle>
          <button
            onClick={() => {}}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </DialogHeader>
        <div className="p-6 pt-0">
          <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Premium Access
              </h3>
              <p className="text-sm text-gray-500">
                Unlimited gig applications and postings
              </p>
            </div>
            {/* The amount display is now part of the manual input */}
          </div>

          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <Label htmlFor="phone-number" className="text-gray-700">
                Phone Number
              </Label>
              <Input
                id="phone-number"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g., 254712345678"
                required
                className="mt-2 bg-white"
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="amount" className="text-gray-700">
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
                className="mt-2 bg-white"
              />
            </div>

            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-800 mb-3">
                Payment Method
              </h4>
              <RadioGroup defaultValue="mpesa">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mpesa" id="r1" />
                  <Label htmlFor="r1">M-Pesa</Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Complete Payment (KSh {amount})
            </Button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              By joining, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-gray-700">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-gray-700">
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import React from "react";
import Link from "next/link";
import JoinModal from "./JoinModal";

export function GrowWithUs() {
  return (
    <section className="bg-gray-100 py-5 md:py-10 text-center">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Ready to Grow Your Freelance Career?
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">
          Join thousands of African freelancers finding meaningful work through
          MyGigs Africa.
        </p>
        <Link href="/sign-up">
          <JoinModal />
        </Link>
      </div>
    </section>
  );
}

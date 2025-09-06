import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

import heroImage from "../public/hero-image.jpg";
import { JoinModal } from "./JoinModal";

export function Hero() {
  return (
    <section className="bg-slate-900 py-16 md:py-24 text-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Section: Text Content & Call to Actions */}
        <div className="text-center md:text-left animate-in fade-in-0 duration-700">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4 leading-tight">
            <span className="text-blue-500">Find & Post</span> Gigs{" "}
            <br className="hidden md:inline" />
            Across Africa
          </h1>
          <p className="mt-4 text-lg leading-relaxed sm:text-xl opacity-80 max-w-[600px] mx-auto md:mx-0">
            Connect with incredible freelance opportunities that match your
            skills and grow your career.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <SignedIn>
              {/* If signed in, show the Join Modal */}
              <JoinModal />
            </SignedIn>
            <SignedOut>
              {/* If signed out, show a Sign In button with the same style */}
              <SignInButton mode="modal">
                <Button
                  size="lg"
                  className="bg-yellow-500 text-slate-900 font-bold hover:bg-yellow-400"
                >
                  Join for KSh 200/year
                </Button>
              </SignInButton>
            </SignedOut>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
            >
              <Link href="/gigs">Browse Gigs</Link>
            </Button>
          </div>
        </div>

        {/* Right Section: Image */}
        <div className="relative rounded-xl overflow-hidden shadow-2xl mt-8 md:mt-0 animate-in fade-in-0 duration-1000 slide-in-from-right-20">
          <Image
            src={heroImage}
            alt="Freelancer working on a laptop"
            className="object-cover w-full h-full"
            layout="responsive"
            width={800}
            height={600}
          />
        </div>
      </div>
    </section>
  );
}

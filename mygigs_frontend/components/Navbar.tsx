"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  ClerkLoaded,
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/nextjs";

import { Briefcase, Menu } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white text-slate-800 shadow-md justify-around align-center flex p-1 bg-amber-50">
      <div className="container flex h-14 items-center">
        {/* Desktop Navigation */}

        {/* Navigation Links & Auth Buttons */}
        <nav className="hidden md:flex flex-1 items-center justify-evenly space-x-6 text-sm font-bold">
          <div className="mr-4 hidden md:flex items-center space-x-4">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Briefcase className="h-6 w-6" />
              <span className="font-extrabold text-2xl tracking-wide">
                MyGigsAfrica
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {" "}
            <Link
              href="/gigs"
              className="md:mr-10 transition-colors text-slate font-bold hover:text-slate-800"
            >
              View Gigs
            </Link>
            <Link
              href="/become-freelancer"
              className="transition-colors text-slate font-bold hover:text-slate-800"
            >
              Become a Freelancer
            </Link>
          </div>

          <div>
            <ClerkLoaded>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    className=" text-white bg-purple-950 hover:bg-blue-500 hover:text-white transition-colors p-2 cursor-pointer"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
            </ClerkLoaded>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden flex-1 items-center justify-around text-slate-800 p-0.3">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-extrabold text-xl tracking-wide">
              MyGigsAfrica
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <ClerkLoaded>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    className="text-white bg-purple-950 hover:bg-blue-500 hover:text-white transition-colors p-2 cursor-pointer"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
            </ClerkLoaded>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-9 w-9 bg-gray-400 text-slate-800 hover:bg-gray-300 text-shadow-indigo-300 cursor-pointer"
                >
                  <Menu className="h-8 w-8 font-bold" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-gradient-to-b from-[#0a0a35] to-[#383842] text-slate-500 text-center align-center"
              >
                <SheetHeader>
                  <SheetTitle className="text-slate-400 font-extrabold text-3xl mt-10">
                    MyGigsAfrica
                  </SheetTitle>
                </SheetHeader>
                <nav className="grid gap-6 text-md font-bold p-8">
                  <Link
                    href="/post-gig"
                    className="hover:text-gray-400 text-slate-300 bg-gradient-to-l from-red-400 to-blue-950 p-5 rounded-md"
                  >
                    View Gigs
                  </Link>
                  <Link
                    href="/become-freelancer"
                    className="hover:text-gray-400 bg-slate-400 text-slate-300 bg-gradient-to-r from-red-400 to-blue-950 p-5 rounded-md"
                  >
                    Become a Freelancer
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

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
import { Input } from "@/components/ui/input"; // New
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { MenuIcon, SearchIcon } from "lucide-react"; // New

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full  bg-white-900 text-slate-900 shadow-md p-2">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex items-center space-x-4">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-extrabold text-2xl tracking-wide">
              MyGigsAfrica
            </span>
          </Link>

          <div className="relative flex-1 max-w-lg">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for freelancers or gigs..."
              className="pl-9 pr-4 py-2 bg-gray-800 text-white placeholder:text-gray-400 border-gray-700 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Navigation Links & Auth Buttons */}
        <nav className="hidden md:flex flex-1 items-center justify-end space-x-6 text-sm font-medium">
          <Link
            href="/post-gig"
            className="transition-colors text-gray-300 hover:text-white"
          >
            Post Gig
          </Link>
          <Link
            href="/become-freelancer"
            className="transition-colors text-gray-300 hover:text-white"
          >
            Become a Freelancer
          </Link>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Button
              asChild
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </SignedOut>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden flex-1 items-center justify-between text-white">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-extrabold text-2xl tracking-wide">
              MyGigs
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Button
                asChild
                variant="outline"
                className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
              >
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </SignedOut>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-white hover:bg-gray-800"
                >
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-slate-900 text-white">
                <SheetHeader>
                  <SheetTitle className="text-white">MyGigs</SheetTitle>
                </SheetHeader>
                <nav className="grid gap-6 text-lg font-medium pt-8">
                  <Link href="/post-gig" className="hover:text-gray-300">
                    Post Gig
                  </Link>
                  <Link
                    href="/become-freelancer"
                    className="hover:text-gray-300"
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

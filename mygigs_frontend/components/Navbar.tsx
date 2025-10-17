"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  ClerkLoaded,
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  useUser,
} from "@clerk/nextjs";
import { Briefcase, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import JoinModal from "./JoinModal";

export function Navbar() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  if (!isLoaded) return null;

  const userRole = isSignedIn ? user.publicMetadata.role : null;
  const isAdmin = userRole === "admin";
  const isFreelancer = userRole === "freelancer";

  const handleLinkClick = () => {
    setIsOpen(false); // close mobile sheet when any link is clicked
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/40 shadow-lg"
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Briefcase className="h-6 w-6 text-gray-900" />
          <span className="font-bold text-xl bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
            MyGigsAfrica
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center justify-end space-x-8 font-semibold text-md">
          <Link
            href="/gigs"
            className="relative transition-all duration-300 text-slate-700 hover:text-blue-700 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300"
          >
            View Gigs
          </Link>

          <SignedOut>
            <SignInButton mode="modal">
              <Button className="bg-gradient-to-r from-blue-700 to-purple-800 text-white font-semibold shadow-md hover:opacity-90 transition-all">
                Become a Freelancer
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            {!isAdmin && !isFreelancer && <JoinModal />}

            {isAdmin && (
              <Link
                href="/admin-dashboard"
                className="relative transition-all duration-300 text-slate-700 hover:text-blue-700 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300"
              >
                Dashboard
              </Link>
            )}
            {isFreelancer && (
              <Link
                href="/freelancer-dashboard"
                className="relative transition-all duration-300 text-slate-700 hover:text-blue-700 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300"
              >
                Your Dashboard
              </Link>
            )}
          </SignedIn>

          <ClerkLoaded>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="bg-gradient-to-r from-purple-800 to-blue-700 text-white shadow-md hover:opacity-90 transition-all">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </ClerkLoaded>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-3">
          <ClerkLoaded>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="bg-gradient-to-r from-purple-800 to-blue-700 text-white font-semibold shadow-md hover:opacity-90 transition-all">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </ClerkLoaded>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 bg-gray-300/40 backdrop-blur-sm text-slate-800 hover:bg-gray-200 transition-all shadow-sm"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <AnimatePresence>
              {isOpen && (
                <SheetContent
                  side="right"
                  className="bg-gradient-to-b from-[#0a0a35]/95 to-[#383842]/90 backdrop-blur-lg text-slate-200 text-center overflow-y-auto"
                >
                  <SheetHeader>
                    <SheetTitle className="text-slate-200 font-extrabold text-3xl mt-10">
                      MyGigsAfrica
                    </SheetTitle>
                  </SheetHeader>

                  <motion.nav
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.4 }}
                    className="grid gap-6 text-md font-bold p-8"
                  >
                    <SheetClose asChild>
                      <Link
                        href="/gigs"
                        onClick={handleLinkClick}
                        className="hover:text-gray-200 bg-gradient-to-r from-blue-700 to-purple-700 p-4 rounded-lg shadow-md transition-all"
                      >
                        View Gigs
                      </Link>
                    </SheetClose>

                    <SignedOut>
                      <SheetClose asChild>
                        <SignInButton mode="modal">
                          <Button
                            onClick={handleLinkClick}
                            className="bg-gradient-to-r from-blue-700 to-purple-700 text-white font-semibold shadow-md hover:opacity-90 transition-all"
                          >
                            Become a Freelancer
                          </Button>
                        </SignInButton>
                      </SheetClose>
                    </SignedOut>

                    <SignedIn>
                      {!isAdmin && !isFreelancer && (
                        <div onClick={handleLinkClick}>
                          <JoinModal />
                        </div>
                      )}
                      {isAdmin && (
                        <SheetClose asChild>
                          <Link
                            href="/admin-dashboard"
                            onClick={handleLinkClick}
                            className="hover:text-gray-200 bg-gradient-to-l from-purple-700 to-blue-700 p-4 rounded-lg shadow-md transition-all"
                          >
                            Dashboard
                          </Link>
                        </SheetClose>
                      )}
                      {isFreelancer && (
                        <SheetClose asChild>
                          <Link
                            href="/freelancer-dashboard"
                            onClick={handleLinkClick}
                            className="hover:text-gray-200 bg-gradient-to-l from-purple-700 to-blue-700 p-4 rounded-lg shadow-md transition-all"
                          >
                            Your Dashboard
                          </Link>
                        </SheetClose>
                      )}
                    </SignedIn>
                  </motion.nav>
                </SheetContent>
              )}
            </AnimatePresence>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}

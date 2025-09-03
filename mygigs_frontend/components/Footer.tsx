import React from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Briefcase,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-400 py-5 md:py-10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Section */}
        <div className="flex flex-col items-start">
          <Link
            href="/"
            className="flex items-center space-x-2 text-white mb-4"
          >
            <Briefcase className="h-6 w-6" />
            <span className="font-extrabold text-xl tracking-wide">
              MyGigsAfrica
            </span>
          </Link>
          <p className="text-sm">
            Connecting African talent with opportunities across the continent.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/find-gigs"
                className="hover:text-white transition-colors"
              >
                Find Gigs
              </Link>
            </li>
            <li>
              <Link
                href="/how-it-works"
                className="hover:text-white transition-colors"
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link
                href="/post-a-gig"
                className="hover:text-white transition-colors"
              >
                Post a Gig
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="text-lg font-bold text-white mb-4">Support</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/faq" className="hover:text-white transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-white transition-colors"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Connect With Us */}
        <div>
          <h4 className="text-lg font-bold text-white mb-4">Connect With Us</h4>
          <div className="flex space-x-4 mb-4">
            <a href="#" aria-label="Facebook">
              <Facebook className="h-6 w-6 hover:text-white transition-colors" />
            </a>
            <a href="#" aria-label="Twitter">
              <Twitter className="h-6 w-6 hover:text-white transition-colors" />
            </a>
            <a href="#" aria-label="Instagram">
              <Instagram className="h-6 w-6 hover:text-white transition-colors" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <Linkedin className="h-6 w-6 hover:text-white transition-colors" />
            </a>
          </div>
          <p className="text-sm">
            Email:{" "}
            <a href="mailto:info@mygigsafrica.com" className="hover:underline">
              info@mygigsafrica.com
            </a>
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
        &copy; {new Date().getFullYear()} MyGigsAfrica. All rights reserved.
      </div>
    </footer>
  );
}

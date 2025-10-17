"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

// Background images
import hero1 from "../public/hero-image.jpg";
import hero2 from "../public/hero-image-2.jpg";
import hero3 from "../public/hero-image-3.jpg";

const images = [hero1, hero2, hero3];

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center justify-center bg-slate-900 text-white">
      {/* 🌄 Background Carousel */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <Image
              src={images[currentIndex]}
              alt="Hero background"
              fill
              priority
              className="object-cover brightness-[0.95]"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 🎨 Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/70 to-black/70"></div>

      {/* ✨ Hero Content */}
      <motion.div
        className="relative z-10 text-center px-6 sm:px-8 md:px-12 max-w-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
          Find & Post Freelance Gigs Across Africa
        </h1>

        <p className="text-lg sm:text-xl text-gray-200 opacity-90 mb-10 max-w-2xl mx-auto">
          Connect with verified clients and top freelancers. Build your career,
          grow your income, and shape the future of digital work across the
          continent.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40 transition-transform hover:scale-[1.03]"
          >
            <Link href="/gigs">Browse Gigs</Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/40 text-white hover:bg-white/10 transition-colors"
          >
            <Link href="/about-us">Find Out More About Us</Link>
          </Button>
        </div>
      </motion.div>

      {/* 🌈 Soft bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[200px] bg-gradient-to-t from-blue-600/20 via-cyan-400/10 to-transparent blur-3xl pointer-events-none"></div>
    </section>
  );
}

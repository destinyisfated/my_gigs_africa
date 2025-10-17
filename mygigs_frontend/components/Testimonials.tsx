"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Aisha Kamau",
    role: "Freelance Designer – Nairobi, Kenya",
    text: "MyGigs Africa gave me consistent clients and helped me grow my freelance career without relying on international platforms. The process was easy and payments were reliable!",
  },
  {
    name: "David Otieno",
    role: "Web Developer – Mombasa, Kenya",
    text: "The platform made it simple to connect with serious clients. I love how the gigs are tailored for African freelancers — it truly understands our market.",
  },
  {
    name: "Mary Mwangi",
    role: "Business Owner – Kigali, Rwanda",
    text: "Hiring talent through MyGigs Africa was seamless. Communication, project tracking, and payments are all handled perfectly within the system.",
  },
  {
    name: "Samuel Njoroge",
    role: "Mobile App Developer – Accra, Ghana",
    text: "Finally, a freelancing platform built for us! The dashboard is clean, intuitive, and I feel proud working through something made in Africa for Africa.",
  },
  {
    name: "Amina Yusuf",
    role: "Digital Marketer – Lagos, Nigeria",
    text: "MyGigs Africa helps me find clients who actually value African talent. The verification and review system builds trust and gives me more confidence to take on bigger projects.",
  },
];

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(2);

  // Adjust cards per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(window.innerWidth < 768 ? 1 : 2);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-slide every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + cardsPerView) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [cardsPerView]);

  const handlePrev = () =>
    setIndex(
      (prev) =>
        (prev - cardsPerView + testimonials.length) % testimonials.length
    );
  const handleNext = () =>
    setIndex((prev) => (prev + cardsPerView) % testimonials.length);

  // Get the testimonials to display
  const displayed = testimonials
    .slice(index, index + cardsPerView)
    .concat(
      testimonials.slice(
        0,
        Math.max(0, index + cardsPerView - testimonials.length)
      )
    );

  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-20 px-6 md:px-16 flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 text-center">
        What Our Users Say
      </h2>
      <p className="text-gray-500 text-center max-w-2xl mb-12">
        Real experiences from freelancers and clients who’ve grown with MyGigs
        Africa.
      </p>

      <div className="relative w-full max-w-6xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.7 }}
            className={`grid gap-8 ${
              cardsPerView === 1 ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {displayed.map((t, i) => (
              <div
                key={i}
                className="p-8 bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-lg mr-3">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h4 className="text-gray-800 font-semibold">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
                <Quote className="w-6 h-6 text-blue-400 mb-3 opacity-70" />
                <p className="text-gray-700 leading-relaxed">“{t.text}”</p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="flex justify-between items-center mt-10">
          <button
            onClick={handlePrev}
            className="px-4 py-2 rounded-full bg-gray-200 hover:bg-blue-100 transition"
          >
            ‹
          </button>
          <div className="flex gap-2">
            {Array.from({
              length: Math.ceil(testimonials.length / cardsPerView),
            }).map((_, i) => (
              <span
                key={i}
                onClick={() => setIndex(i * cardsPerView)}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                  i === Math.floor(index / cardsPerView)
                    ? "bg-blue-600 scale-125"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-full bg-gray-200 hover:bg-blue-100 transition"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPinIcon } from "lucide-react";
import Image from "next/image";

const featuredGigs = [
  {
    title: "Logo Design",
    description: "Need a professional logo for my new startup in Nairobi.",
    price: "Ksh 5,000",
    location: "Nairobi, Kenya",
    image: "/hero-image.jpg",
  },
  {
    title: "Website Development",
    description:
      "Looking for a developer to build an e-commerce site for my business.",
    price: "Ksh 15,000",
    location: "Lagos, Nigeria",
    image: "/hero-image.jpg",
  },
  {
    title: "Blog Content Writer",
    description: "Need regular blog posts about technology trends in Africa.",
    price: "Ksh B.O.C/article",
    location: "Remote",
    image: "/hero-image.jpg",
  },
];

export function FeaturedGigs() {
  return (
    <section className="bg-slate-50 py-12 md:py-10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Featured Gigs</h2>
          <Link href="/gigs">
            <Button
              variant="ghost"
              className="text-blue-500 hover:text-blue-600 transition-colors"
            >
              View All
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredGigs.map((gig, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={gig.image}
                  alt={gig.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-xl"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-800">
                    {gig.title}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded-full">
                    {gig.price}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {gig.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 mt-4">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  <span>{gig.location}</span>
                </div>
                <div className="mt-6">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors">
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

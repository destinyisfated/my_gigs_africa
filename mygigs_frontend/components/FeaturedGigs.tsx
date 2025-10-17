"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPinIcon } from "lucide-react";

interface Gig {
  id: number;
  title: string;
  description: string;
  price: string;
  location: string;
  image: string;
}

export function FeaturedGigs() {
  const [featuredGigs, setFeaturedGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "http://localhost:8000/core/gigs/";

  useEffect(() => {
    const fetchGigs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: Gig[] = await response.json();
        setFeaturedGigs(data.slice(0, 3));
      } catch (e: any) {
        setError(`Failed to fetch featured gigs: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGigs();
  }, []);

  // Skeleton loader component

  const SkeletonLoader = () => (
    <section className="bg-slate-50 py-12 md:py-10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Recent Gigs</h2>
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-xl overflow-hidden shadow-lg"
            >
              <div className="h-40 bg-gray-300 w-full" />
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-300 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="flex items-center gap-2 mt-4">
                  <div className="h-4 w-4 bg-gray-300 rounded-full" />
                  <div className="h-4 bg-gray-300 rounded w-1/3" />
                </div>
                <div className="h-10 bg-gray-300 rounded mt-6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  if (error) {
    return (
      <section className="bg-slate-50 py-12 md:py-10 text-center">
        <p className="text-xl text-red-500">Error: {error}</p>
        <p className="text-sm text-gray-500">Error fetching data</p>
      </section>
    );
  }

  if (isLoading) return <SkeletonLoader />;

  if (featuredGigs.length === 0) {
    return (
      <section className="bg-slate-50 py-12 md:py-10 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Gigs</h2>
        <p className="text-xl text-gray-500">
          No featured gigs available at the moment.
        </p>
      </section>
    );
  }

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
              key={gig.id || index}
              className="bg-gray-100 rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="relative h-30 w-full">
                {gig.image ? (
                  <img
                    src={`http://localhost:8000${gig.image}`}
                    alt={gig.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="bg-gray-300 w-full h-full flex items-center justify-center text-gray-500">
                    No Image Available
                  </div>
                )}
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

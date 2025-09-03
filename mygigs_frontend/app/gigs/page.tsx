"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { GigCard } from "@/components/GigCard";
import { Loader2, SearchIcon, TagIcon, ChevronDownIcon } from "lucide-react";

interface Gig {
  id: number;
  title: string;
  description: string;
  gig_type: string;
  price: number;
  image?: string;
  location: string; // Added location field
}

export default function GigsPage() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const fetchGigs = useCallback(async () => {
    setLoading(true);
    let url = "http://localhost:8000/api/gigs/";
    const params = new URLSearchParams();

    if (searchTerm) {
      params.append("search", searchTerm);
    }
    if (selectedType !== "ALL") {
      params.append("gig_type", selectedType);
    }
    params.append("min_price", priceRange[0].toString());
    params.append("max_price", priceRange[1].toString());

    url += `?${params.toString()}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch gigs");
      }
      const data = await response.json();
      setGigs(data);
    } catch (error) {
      console.error("Error fetching gigs:", error);
      setGigs([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedType, priceRange]);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Find Your Next Gig
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore thousands of gigs tailored to your skills and preferences.
          </p>
        </header>

        <div className="relative mb-8 max-w-2xl mx-auto">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for a gig title or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-6 text-lg rounded-full border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/4 p-6 bg-white rounded-xl shadow-lg h-fit sticky top-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Filter Options
            </h2>

            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <TagIcon className="h-4 w-4 text-gray-500" /> Gig Type
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "ALL",
                  "WEB_DEV",
                  "MOBILE_DEV",
                  "GRAPHIC_DESIGN",
                  "WRITING",
                  "VIDEO_EDITING",
                  "OTHER",
                ].map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    onClick={() => setSelectedType(type)}
                    className="rounded-full px-4 text-sm"
                  >
                    {type
                      .split("_")
                      .map(
                        (word) => word.charAt(0) + word.slice(1).toLowerCase()
                      )
                      .join(" ")}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                <ChevronDownIcon className="h-4 w-4 text-gray-500 rotate-90" />{" "}
                Price Range (KSh)
              </h3>
              <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                <span>{priceRange[0]}</span>
                <span>{priceRange[1]}</span>
              </div>
              <Slider
                defaultValue={[0, 1000]}
                max={10000}
                step={10}
                onValueChange={(value) => setPriceRange([value[0], value[1]])}
                className="w-full"
              />
            </div>
          </aside>

          <section className="w-full md:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
              </div>
            ) : gigs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gigs.map((gig) => (
                  <GigCard
                    key={gig.id}
                    id={gig.id}
                    title={gig.title}
                    description={gig.description}
                    location={gig.location}
                    price={gig.price}
                    imageUrl={gig.image || ""} // Pass the image URL, or an empty string if none exists
                  />
                ))}
              </div>
            ) : (
              <div className="text-center p-12 bg-gray-100 rounded-xl shadow-inner">
                <p className="text-xl text-gray-600 font-medium">
                  No gigs found matching your criteria.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

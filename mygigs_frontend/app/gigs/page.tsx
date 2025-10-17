"use client";

import { MapPin, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Skeleton Loader
function GigSkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col animate-pulse">
      <div className="h-32 w-full bg-gray-200"></div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
        <div className="mt-4 h-8 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];
  const maxVisiblePages = 5;
  const startPage = Math.max(
    1,
    Math.min(
      currentPage - Math.floor(maxVisiblePages / 2),
      totalPages - maxVisiblePages + 1
    )
  );
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <div className="flex justify-center items-center mt-12 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-xl flex items-center gap-1 text-sm font-medium transition-all ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
        }`}
      >
        <ChevronLeft size={16} /> Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
            currentPage === page
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-xl flex items-center gap-1 text-sm font-medium transition-all ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
        }`}
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default function GigsPage() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const gigsPerPage = 12;

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const response = await fetch("http://localhost:8000/core/gigs/");
        if (!response.ok) throw new Error("Failed to fetch gigs");
        const data = await response.json();
        setGigs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, []);

  const filteredGigs = gigs.filter((gig) => {
    const query = searchQuery.toLowerCase();
    return (
      gig.title.toLowerCase().includes(query) ||
      String(gig.price).toLowerCase().includes(query) ||
      (gig.location || "").toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredGigs.length / gigsPerPage);
  const startIndex = (currentPage - 1) * gigsPerPage;
  const currentGigs = filteredGigs.slice(startIndex, startIndex + gigsPerPage);

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-lg font-medium">Error: {error}</p>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen font-[Inter]">
      {/* Header Search Bar */}
      <header className="bg-white py-4 px-6 md:px-10 flex items-center justify-center sticky top-0 z-40">
        <div className="flex items-center space-x-3 w-full max-w-2xl">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search gigs, categories, or locations..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 rounded-full shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-gray-50 hover:bg-white"
            />
          </div>
          <button className="hidden sm:block p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 md:px-12 lg:px-16 py-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <GigSkeletonCard key={i} />
            ))}
          </div>
        ) : currentGigs.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
            >
              {currentGigs.map((gig) => (
                <motion.div
                  key={gig.id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col"
                >
                  <div className="relative h-32 bg-gray-100">
                    {gig.image ? (
                      <img
                        src={`http://localhost:8000${gig.image}`}
                        alt={gig.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <h2 className="text-md font-semibold text-gray-800 line-clamp-2 leading-snug mb-1">
                      {gig.title}
                    </h2>
                    <p className="text-gray-500 text-sm line-clamp-2 flex-grow">
                      {gig.description}
                    </p>

                    <div className="mt-3 border-t border-gray-100 pt-3 text-sm">
                      <div className="flex items-center text-gray-500 mb-1">
                        <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                        {gig.location || "Remote"}
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 text-xs">
                          {gig.creator || "Unknown"}
                        </span>
                        <span className="text-blue-600 font-semibold text-sm">
                          KES {gig.price}
                        </span>
                      </div>
                    </div>

                    <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
                      Apply
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center text-gray-500 text-lg mt-10">
            <p>No gigs found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
}

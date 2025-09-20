"use client";

import GigCard from "@/components/GigCard";
import { useState, useEffect, useCallback } from "react";

const Home = () => {
  const [filteredGigs, setFilteredGigs] = useState<Gig[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProfession, setSelectedProfession] = useState<string>("All");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1500 });
  const [allProfessions, setAllProfessions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState<number>(1);
  const perPage = 8; // Number of gigs to display per page

  // --- Notification State ---
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Function to fetch gigs from the backend with filters
  const fetchGigs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        profession: selectedProfession,
        min_price: priceRange.min.toString(),
        max_price: priceRange.max.toString(),
      }).toString();

      const response = await fetch(
        `http://127.0.0.1:8000/core/gigs/?${params}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch gigs from the backend");
      }

      const data: Gig[] = await response.json();
      setFilteredGigs(data);

      // Extract unique professions from the fetched data for the dropdown
      const uniqueProfessions = Array.from(
        new Set(data.map((gig) => gig.profession))
      );
      setAllProfessions(uniqueProfessions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedProfession, priceRange]);

  // Initial data load and re-fetching on filter changes
  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  // Calculate the gigs to be displayed on the current page
  const totalPages = Math.ceil(filteredGigs.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const gigsToDisplay = filteredGigs.slice(startIndex, endIndex);

  // Function to handle page change
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  // --- Application Handler ---
  const handleApplyClick = (gig: Gig) => {
    console.log(`Application submitted for Gig: "${gig.title}"`);
    setSuccessMessage("Gig applied successfully!");
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 font-Quicksand">
      <h1 className="text-5xl font-extrabold text-center mb-8 bg-gradient-to-l from-red-700 to-purple-800 bg-clip-text text-transparent">
        Available Gigs
      </h1>

      {/* Success Notification */}
      {successMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-[#76c482] text-white rounded-full shadow-lg z-50 animate-fade-in-down">
          {successMessage}
        </div>
      )}
      <style jsx global>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out forwards;
        }
      `}</style>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row md:space-x-4 mb-8 space-y-4 md:space-y-0 font-Quicksand">
        <input
          type="text"
          placeholder="Search for gigs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 p-3 shadow-lg rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold bg-slate-100"
        />

        <select
          value={selectedProfession}
          onChange={(e) => setSelectedProfession(e.target.value)}
          className="p-3 shadow-lg bg-slate-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold"
        >
          <option value="All" className="text-sm font-semibold">
            All Professions
          </option>
          {allProfessions.map((prof) => (
            <option
              key={prof}
              value={prof}
              className="text-sm font-semibold p-2 border-none rounded-full"
            >
              {prof}
            </option>
          ))}
        </select>

        <div className="flex items-center space-x-2">
          <label className="text-gray-600 font-bold text-sm">Price:</label>
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange({ ...priceRange, min: Number(e.target.value) })
            }
            className="w-24 p-2 shadow-lg bg-slate-100 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <span className="text-gray-500 font-bold">-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange({ ...priceRange, max: Number(e.target.value) })
            }
            className="w-24 p-2 shadow-lg bg-slate-100 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {loading && (
        <p className="col-span-full text-center text-xl font-bold text-gray-700 p-20">
          Loading gigs...
        </p>
      )}

      {error && (
        <p className="col-span-full text-center text-xl font-bold text-red-500 p-20">
          Error: {error}
        </p>
      )}

      {/* Gigs Display Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 font-Quicksand">
          {gigsToDisplay.length > 0 ? (
            gigsToDisplay.map((gig) => (
              <GigCard key={gig.id} gig={gig} onApply={handleApplyClick} />
            ))
          ) : (
            <p className="col-span-full bg-green-800 text-center text-xl font-extrabold text-red-500 p-20 rounded-md">
              No gigs found matching your search!
            </p>
          )}
        </div>
      )}

      {/* --- Pagination Controls --- */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex justify-center items-center mt-12 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
          >
            Previous
          </button>

          {getPageNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                pageNumber === currentPage
                  ? "bg-[#32D74B] text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;

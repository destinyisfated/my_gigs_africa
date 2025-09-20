"use client";

import { useState, useEffect, useMemo } from "react";

export default function GigListPage() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [professions, setProfessions] = useState(["All Professions"]);
  const [filterProfession, setFilterProfession] = useState("All Professions");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const gigsPerPage = 12;

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const response = await fetch("http://localhost:8000/core/gigs/");
        if (!response.ok) {
          throw new Error("Failed to fetch gigs");
        }
        const data = await response.json();
        // Sort gigs by creation date in descending order (newer first)
        const sortedGigs = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setGigs(sortedGigs);

        // Dynamically create a list of professions for the filter
        const uniqueProfessions = [
          ...new Set(data.map((gig) => gig.profession)),
        ];
        setProfessions(["All Professions", ...uniqueProfessions]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  // Filter and search gigs based on user input
  const filteredGigs = useMemo(() => {
    return gigs.filter((gig) => {
      const matchesSearch =
        gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gig.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProfession =
        filterProfession === "All Professions" ||
        (gig.title &&
          gig.title.toLowerCase() === filterProfession.toLowerCase());

      const gigPrice = parseFloat(gig.price);
      const minPrice =
        priceRange.min !== "" ? parseFloat(priceRange.min) : null;
      const maxPrice =
        priceRange.max !== "" ? parseFloat(priceRange.max) : null;

      const matchesPrice =
        (!minPrice || gigPrice >= minPrice) &&
        (!maxPrice || gigPrice <= maxPrice);

      return matchesSearch && matchesProfession && matchesPrice;
    });
  }, [gigs, searchTerm, filterProfession, priceRange]);

  // Pagination logic
  const indexOfLastGig = currentPage * gigsPerPage;
  const indexOfFirstGig = indexOfLastGig - gigsPerPage;
  const currentGigs = filteredGigs.slice(indexOfFirstGig, indexOfLastGig);
  const totalPages = Math.ceil(filteredGigs.length / gigsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-medium text-gray-500">Loading gigs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-8">
        Available Gigs
      </h1>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-center mb-8 gap-4">
        <input
          type="text"
          placeholder="Search for gigs..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on new search
          }}
          className="w-full sm:w-80 p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
        />
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <select
            value={filterProfession}
            onChange={(e) => {
              setFilterProfession(e.target.value);
              setCurrentPage(1); // Reset to first page on new filter
            }}
            className="p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
          >
            {professions.map((prof) => (
              <option key={prof} value={prof}>
                {prof}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min Price"
              value={priceRange.min}
              onChange={(e) => {
                setPriceRange({ ...priceRange, min: e.target.value });
                setCurrentPage(1);
              }}
              className="w-24 p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={priceRange.max}
              onChange={(e) => {
                setPriceRange({ ...priceRange, max: e.target.value });
                setCurrentPage(1);
              }}
              className="w-24 p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Gig Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentGigs.map((gig) => (
          <div
            key={gig.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            <div className="relative h-48 w-full">
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
              <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                KES{parseFloat(gig.price).toFixed(0)}
              </span>
            </div>
            <div className="p-4 flex flex-col justify-between h-full">
              <h2 className="text-xl font-semibold text-gray-800 truncate mb-1">
                {gig.title}
              </h2>
              <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                {gig.description}
              </p>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{gig.location || "Nairobi, Kenya"}</span>
              </div>
              <button className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-full w-full transition-colors hover:bg-gray-100">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {currentGigs.length === 0 && (
        <p className="text-center text-gray-500 text-lg mt-8">No gigs found.</p>
      )}

      {/* Pagination Controls */}
      {filteredGigs.length > gigsPerPage && (
        <div className="flex justify-center items-center mt-8 gap-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full font-semibold hover:bg-gray-400 disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-700 font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full font-semibold hover:bg-gray-400 disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

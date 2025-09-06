"use client";

import GigCard from "@/components/GigCard";
import { gigsData } from "@/data/gigsData";
import { useState, useEffect } from "react";

const Home = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [filteredGigs, setFilteredGigs] = useState<Gig[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProfession, setSelectedProfession] = useState<string>("All");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1500 });

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState<number>(1);
  const perPage = 8; // Number of gigs to display per page

  // --- Notification State ---
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Initial data load
    setGigs(gigsData);
  }, []);

  useEffect(() => {
    // This effect runs whenever filter states change
    let updatedGigs = gigs.filter((gig) => {
      const matchesSearch =
        gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProfession =
        selectedProfession === "All" || gig.profession === selectedProfession;
      const matchesPrice =
        gig.price >= priceRange.min && gig.price <= priceRange.max;

      return matchesSearch && matchesProfession && matchesPrice;
    });

    setFilteredGigs(updatedGigs);
    setCurrentPage(1); // Reset to the first page when filters change
  }, [searchQuery, selectedProfession, priceRange, gigs]);

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
    // Simulate capturing client data. In a real app, this would come from a user form or auth.
    const clientDetails = {
      username: "client_user_123",
      email: "client@example.com",
      appliedAt: new Date().toISOString(),
    };

    console.log(`Application submitted for Gig: "${gig.title}"`);
    console.log("Client Details:", clientDetails);

    // In a real application, you would save this to your database, e.g., Firestore
    // saveApplicationToFirestore(gig.id, clientDetails);

    setSuccessMessage("Gig applied successfully!");

    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
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
      <div className="flex flex-col md:flex-row md:space-x-4 mb-8 space-y-4 md:space-y-0">
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
          {Array.from(new Set(gigsData.map((gig) => gig.profession))).map(
            (prof) => (
              <option
                key={prof}
                value={prof}
                className="text-sm font-semibold p-2 border-none rounded-full"
              >
                {prof}
              </option>
            )
          )}
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

      {/* Gigs Display Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {gigsToDisplay.length > 0 ? (
          gigsToDisplay.map((gig) => (
            <GigCard key={gig.id} gig={gig} onApply={handleApplyClick} />
          ))
        ) : (
          <p className="col-span-full bg-green-800 text-center text-xl font-extrabold text-red-500 p-20 rounded-md flex justify-center align-center self-center">
            No gigs found matching your search!
          </p>
        )}
      </div>

      {/* --- Pagination Controls --- */}
      {totalPages > 1 && (
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

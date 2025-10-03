"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { X } from "lucide-react";

// --- Assumed Type Definitions (You should ensure these match your GigCard and backend) ---
interface ClerkUser {
  clerk_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Gig {
  id: number;
  title: string;
  description: string;
  price: number;
  profession: string;
  creator: ClerkUser;
  image_url?: string; // Optional image URL
}

// NOTE: Since the GigCard component is not provided, this is a placeholder 
// for display purposes. You must replace this with your actual GigCard.
const GigCard = ({ gig, onApply }: { gig: Gig, onApply: (gig: Gig) => void }) => (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300 flex flex-col h-full">
        {/* Placeholder for the Image that is currently not loading */}
        <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
          
                    <img
                      src={`http://localhost:8000${gig.image}`}
                      alt={gig.title}
                      className="object-cover w-full h-full"
                    />
                  
        </div>
        <div className="p-5 flex flex-col flex-grow">
            <h2 className="text-xl font-bold text-gray-800 mb-2 truncate" title={gig.title}>
                {gig.title}
            </h2>
            <p className="text-lg font-extrabold text-[#32D74B] mb-2">${gig.price}</p>
            <p className="text-sm text-gray-600 flex-grow mb-4 line-clamp-3">
                {gig.description || "No description provided."}
            </p>
            <div className="mt-auto">
                <button
                    onClick={() => onApply(gig)}
                    className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#4ade80] to-[#32D74B] text-white font-bold rounded-lg shadow-md hover:from-[#22c55e] hover:to-[#22c55e] transition-all duration-300 transform hover:-translate-y-0.5"
                >
                    Apply Now
                </button>
            </div>
        </div>
    </div>
);


// --- Application Modal Component ---

const ApplicationModal = ({ gig, onClose, onApplicationSubmit }: {
    gig: Gig;
    onClose: () => void;
    onApplicationSubmit: (success: boolean, message: string) => void;
}) => {
    const [coverLetter, setCoverLetter] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const handleSubmitApplication = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setIsSubmitting(true);

        // Check if the cover letter is too short
        if (coverLetter.trim().length < 20) {
            setFormError("Cover letter must be at least 20 characters long.");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/core/applications/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        // NOTE: In a production setup, you would include the Authorization header (e.g., Bearer Token) here.
                        // Assuming your development environment handles authentication via session or other means.
                    },
                    body: JSON.stringify({
                        gig: gig.id,
                        cover_letter: coverLetter,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                onApplicationSubmit(true, "Application submitted successfully!");
                onClose();
            } else {
                // Handle application-specific errors (e.g., already applied, validation issues)
                const errorMessage = data.detail || Object.values(data).flat()[0] || "Failed to submit application.";
                onApplicationSubmit(false, `Error: ${errorMessage}`);
                setFormError(errorMessage);
            }
        } catch (error) {
            console.error("Application submission failed:", error);
            onApplicationSubmit(false, "An unexpected network error occurred.");
            setFormError("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }, [coverLetter, gig.id, onClose, onApplicationSubmit]);


    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-all duration-300 scale-100">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Apply for: {gig.title}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition">
                        <X size={24} />
                    </button>
                </div>
                
                <p className="text-gray-600 mb-4">
                    <span className="font-semibold">Gig ID:</span> {gig.id} |{" "}
                    <span className="font-semibold">Price:</span> ${gig.price}
                </p>

                <form onSubmit={handleSubmitApplication}>
                    <label
                        htmlFor="coverLetter"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Cover Letter (Max 500 characters)
                    </label>
                    <textarea
                        id="coverLetter"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        rows={6}
                        maxLength={500}
                        placeholder="Tell the gig creator why you are the best fit for this job..."
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#32D74B] focus:border-transparent transition resize-none text-sm"
                    />

                    {formError && (
                        <p className="text-sm text-red-600 mt-2 font-medium">
                            {formError}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full mt-6 py-3 px-4 rounded-lg font-bold transition-all duration-300 shadow-lg ${
                            isSubmitting 
                                ? "bg-gray-400 cursor-not-allowed" 
                                : "bg-gradient-to-r from-[#4ade80] to-[#32D74B] text-white hover:from-[#22c55e] hover:to-[#22c55e] transform hover:-translate-y-0.5"
                        }`}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                    </button>
                </form>
            </div>
        </div>
    );
};


// --- Main Home Component ---

const Home = () => {
    // ... (Existing State Declarations)
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
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // --- Application Modal State ---
    const [showModal, setShowModal] = useState(false);
    const [selectedGig, setSelectedGig] = useState<Gig | null>(null);

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
    const totalPages = useMemo(() => Math.ceil(filteredGigs.length / perPage), [filteredGigs.length, perPage]);
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

    // --- Application Handler (Opens Modal) ---
    const handleApplyClick = (gig: Gig) => {
        setSelectedGig(gig);
        setShowModal(true);
    };
    
    // --- Application Submission Feedback Handler ---
    const handleApplicationSubmit = (success: boolean, message: string) => {
        if (success) {
            setSuccessMessage(message);
            setErrorMessage(null);
        } else {
            setErrorMessage(message);
            setSuccessMessage(null);
        }
        setTimeout(() => {
            setSuccessMessage(null);
            setErrorMessage(null);
        }, 5000);
    };


    return (
        <div className="container mx-auto p-4 sm:p-8 font-Quicksand min-h-screen">
            <h1 className="text-5xl font-extrabold text-center mb-8 bg-gradient-to-l from-red-700 to-purple-800 bg-clip-text text-transparent">
                Available Gigs
            </h1>

            {/* Notification Messages (Success and Error) */}
            {(successMessage || errorMessage) && (
                <div 
                    className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-xl z-50 animate-fade-in-down font-semibold ${
                        successMessage ? 'bg-[#76c482] text-white' : 'bg-red-500 text-white'
                    }`}
                >
                    {successMessage || errorMessage}
                </div>
            )}
            <style jsx global>{`
                @keyframes fade-in-down {
                    0% { opacity: 0; transform: translate(-50%, -20px); }
                    100% { opacity: 1; transform: translate(-50%, 0); }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.5s ease-out forwards;
                }
            `}</style>

            {/* Application Modal */}
            {showModal && selectedGig && (
                <ApplicationModal 
                    gig={selectedGig} 
                    onClose={() => setShowModal(false)}
                    onApplicationSubmit={handleApplicationSubmit}
                />
            )}

            {/* Search and Filter Section (Unchanged) */}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 font-Quicksand">
                    {gigsToDisplay.length > 0 ? (
                        gigsToDisplay.map((gig) => (
                            <GigCard key={gig.id} gig={gig} onApply={handleApplyClick} />
                        ))
                    ) : (
                        <p className="col-span-full bg-red-100 border border-red-400 text-red-700 text-center text-xl font-extrabold p-20 rounded-md">
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

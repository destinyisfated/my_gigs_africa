'use client';

import { useState, useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function GigsPage() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const response = await fetch('http://localhost:8000/core/gigs/');
        if (!response.ok) {
          throw new Error('Failed to fetch gigs');
        }
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

  const filteredGigs = gigs.filter(gig => {
    const query = searchQuery.toLowerCase();
    const titleMatch = gig.title.toLowerCase().includes(query);
    const priceMatch = String(gig.price).toLowerCase().includes(query);
    const locationMatch = (gig.location || '').toLowerCase().includes(query);
    return titleMatch || priceMatch || locationMatch;
  });

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
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-8 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="text-2xl font-bold text-gray-800">MyGigsAfrica</div>
          <nav>
            <ul className="flex space-x-4 text-gray-600">
              <li><a href="#" className="hover:text-blue-600 font-medium">View Gigs</a></li>
              <li><a href="#" className="hover:text-blue-600 font-medium">Become a Freelancer</a></li>
              <li><a href="#" className="hover:text-blue-600 font-medium">Make a Payment</a></li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search gigs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-80 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
            {/* You can replace this with a user icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A8.996 8.996 0 0112 15c2.31 0 4.46.787 6.121 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGigs.length > 0 ? (
            filteredGigs.map((gig) => (
              <div key={gig.id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
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
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-800 line-clamp-2 mr-2">{gig.title}</h2>
                    <span className="bg-green-100 text-green-800 text-sm font-semibold px-2 py-1 rounded-full">
                      KES{parseFloat(gig.price).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2 text-sm line-clamp-2 flex-grow">{gig.description}</p>
                  <div className="flex items-center mt-2 text-gray-500 text-sm">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>{gig.location || 'Location Not Specified'}</span>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 text-lg mt-8">
              <p>No gigs found matching your search.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

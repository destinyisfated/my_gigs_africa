'use client';

import { useState, useEffect } from 'react';

export default function GigListPage() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-medium text-gray-500">Loading gigs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Available Gigs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {gigs.map((gig) => (
          <div key={gig.id} className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
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
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 truncate">{gig.title}</h2>
              <p className="text-gray-600 mt-2 text-sm line-clamp-2">{gig.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">${parseFloat(gig.price).toFixed(2)}</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
                  View Gig
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {gigs.length === 0 && (
        <p className="text-center text-gray-500 text-lg mt-8">No gigs found.</p>
      )}
    </div>
  );
}

'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { RefreshCw, Briefcase, Users, Mail } from 'lucide-react';

// --- Configuration ---
// Simulate the currently logged-in freelancer ID (this would come from Django's session/token)
const MOCK_FREELANCER_ID = 'freelancer-123';
const API_BASE_URL = '/api/freelancer'; // Placeholder for your Django API base URL

// Utility function to format dates
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    } catch (e) {
        return 'Invalid Date';
    }
};

// --- Mock Data Simulation (Replace these with actual API fetch calls) ---
// This data simulates what your Django DRF views would return
const MOCK_GIGS_DATA = [
    { id: 1, title: "Build React Component", description: "Complex state management required for a new dashboard widget.", creator_id: MOCK_FREELANCER_ID, budget: 800, status: 'Open', created_at: new Date('2025-07-20T10:00:00Z').toISOString() },
    { id: 2, title: "Django API Endpoint Refactor", description: "Optimizing database queries and refactoring 5 existing REST endpoints.", creator_id: MOCK_FREELANCER_ID, budget: 1500, status: 'Closed', created_at: new Date('2025-07-25T12:00:00Z').toISOString() },
    { id: 3, title: "Authentication Service Setup", description: "Integrate Clerk authentication into the main application.", creator_id: MOCK_FREELANCER_ID, budget: 1200, status: 'Open', created_at: new Date('2025-07-15T09:00:00Z').toISOString() },
    // Gig from another user, should be ignored
    { id: 4, title: "Design Landing Page", description: "Need a modern, flat logo design.", creator_id: 'another-user-456', budget: 300, status: 'Open', created_at: new Date('2025-07-01T15:00:00Z').toISOString() },
];

const MOCK_APPLICATIONS_DATA = [
    // Applications for the freelancer's gigs (gig_id 1, 2, or 3)
    { id: 101, gig_id: 1, client_id: 'client-A', client_name: 'Alice Johnson', message: "Ready to start immediately.", status: 'Pending', created_at: new Date('2025-07-21T11:00:00Z').toISOString() },
    { id: 102, gig_id: 2, client_id: 'client-B', client_name: 'Bob Smith', message: "Expert in DRF and database optimization.", status: 'Accepted', created_at: new Date('2025-07-26T09:00:00Z').toISOString() },
    { id: 103, gig_id: 1, client_id: 'client-C', client_name: 'Charlie Brown', message: "Have a similar portfolio item and good budget fit.", status: 'Pending', created_at: new Date('2025-07-22T14:00:00Z').toISOString() },
    // client-A applies to gig 2 (re-used client)
    { id: 104, gig_id: 2, client_id: 'client-A', client_name: 'Alice Johnson', message: "Also interested in this refactoring project.", status: 'Pending', created_at: new Date('2025-07-27T14:00:00Z').toISOString() },
    { id: 105, gig_id: 3, client_id: 'client-D', client_name: 'David Lee', message: "I specialize in Clerk authentication integration.", status: 'Pending', created_at: new Date('2025-07-16T14:00:00Z').toISOString() },
];

// Function to simulate an API call
const simulatedFetch = (data, delay = 500) => {
    return new Promise(resolve => {
        setTimeout(() => {
            // Filter gigs/applications to only show data relevant to the current freelancer
            const relevantData = data.filter(item => {
                // For Gigs, check if the creator is the freelancer
                if (item.creator_id) {
                    return item.creator_id === MOCK_FREELANCER_ID;
                }
                // For Applications, we'd need to filter them later based on gig IDs, 
                // but for simulation, we'll return all relevant mock apps.
                return true; 
            });
            resolve({
                json: () => Promise.resolve(relevantData),
                ok: true
            });
        }, delay);
    });
};

// --- Dashboard Components ---
const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`p-6 rounded-xl shadow-xl transition duration-300 transform hover:scale-[1.02] ${color} text-white`}>
        <div className="flex items-center space-x-4">
            <Icon className="w-8 h-8" />
            <div>
                <p className="text-sm font-light uppercase opacity-80">{title}</p>
                <p className="text-4xl font-extrabold">{value}</p>
            </div>
        </div>
    </div>
);

const App = () => {
    const [gigs, setGigs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'gigs', 'applications'
    
    // 1. Fetch Gigs (Simulating call to /api/freelancer/gigs/)
    const fetchGigs = useCallback(async () => {
        // In a real Django app, this would be: 
        // const response = await fetch(`${API_BASE_URL}/gigs/`);
        
        setIsLoading(true);
        try {
            // --- ACTUAL FETCH SIMULATION START ---
            const response = await simulatedFetch(MOCK_GIGS_DATA);
            const allGigs = await response.json();
            
            // Filter gigs created by the current freelancer
            const freelancerGigs = allGigs.filter(g => g.creator_id === MOCK_FREELANCER_ID);

            // Sort by most recent (assuming created_at is a string/date object)
            freelancerGigs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            
            setGigs(freelancerGigs);
            setError(null);
        } catch (e) {
            console.error("Error fetching gigs:", e);
            setError("Failed to load gigs from API.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 2. Fetch Applications (Simulating call to /api/freelancer/applications/)
    const fetchApplications = useCallback(async (gigIds) => {
        if (gigIds.length === 0) {
            setApplications([]);
            return;
        }

        // In a real Django app, this would be: 
        // const response = await fetch(`${API_BASE_URL}/applications/?gig_ids=${gigIds.join(',')}`);

        try {
            // --- ACTUAL FETCH SIMULATION START ---
            const response = await simulatedFetch(MOCK_APPLICATIONS_DATA);
            const allApplications = await response.json();
            
            // Filter applications targeting this freelancer's gigs
            const relevantApplications = allApplications.filter(app => gigIds.includes(app.gig_id));
            
            // Sort by most recent
            relevantApplications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            
            setApplications(relevantApplications);
            setError(null);
        } catch (e) {
            console.error("Error fetching applications:", e);
            setError("Failed to load applications from API.");
        }
    }, []);

    // Initial data load and periodic refresh hook
    useEffect(() => {
        fetchGigs();
        // Set up a periodic refresh (e.g., every 30 seconds) to simulate real-time updates
        // In a real-world app, you might use WebSockets for better real-time
        const interval = setInterval(fetchGigs, 30000); 
        return () => clearInterval(interval);
    }, [fetchGigs]);

    // Fetch applications whenever the gigs list changes
    useEffect(() => {
        const freelancerGigIds = gigs.map(gig => gig.id);
        fetchApplications(freelancerGigIds);
    }, [gigs, fetchApplications]);

    // 3. Computed State: Dashboard Metrics
    const totalClients = useMemo(() => {
        if (applications.length === 0) return 0;
        // Use a Set to count only unique client IDs who have applied
        const uniqueClients = new Set(applications.map(app => app.client_id));
        return uniqueClients.size;
    }, [applications]);
    
    const activeGigsCount = useMemo(() => {
        // Count only gigs marked as 'Open' or similar status
        return gigs.filter(g => g.status && g.status.toLowerCase() === 'open').length;
    }, [gigs]);
    
    // --- Tab Content Rendering ---
    const renderDashboard = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
                title="Total Gigs Created" 
                value={gigs.length} 
                icon={Briefcase} 
                color="bg-gradient-to-r from-indigo-500 to-indigo-700"
            />
            <StatCard 
                title="Total Active Gigs" 
                value={activeGigsCount} 
                icon={Briefcase} 
                color="bg-gradient-to-r from-blue-500 to-blue-700"
            />
            <StatCard 
                title="Total Unique Clients" 
                value={totalClients} 
                icon={Users} 
                color="bg-gradient-to-r from-green-500 to-green-700"
            />
        </div>
    );

    const renderGigs = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">My Gigs (Total: {gigs.length})</h3>
            {gigs.length === 0 ? (
                <p className="text-center py-10 text-gray-500">You have not created any gigs yet.</p>
            ) : (
                gigs.map(gig => (
                    <div key={gig.id} className="bg-white p-5 rounded-xl shadow-md border-l-4 border-indigo-500 transition duration-150 hover:shadow-lg">
                        <div className="flex justify-between items-start">
                             <h4 className="text-lg font-bold text-gray-900">{gig.title}</h4>
                             <span className={`px-3 py-1 text-xs font-semibold rounded-full ${gig.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                                {gig.status}
                             </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{gig.description}</p>
                        <div className="mt-3 flex justify-between text-xs text-gray-500 border-t pt-2">
                            <span>Budget: <span className="font-medium text-gray-800">${gig.budget ? gig.budget.toLocaleString() : 'N/A'}</span></span>
                            <span>Created: {formatDate(gig.created_at)}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    const renderApplications = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Received Applications (Total: {applications.length})
            </h3>
            {applications.length === 0 ? (
                <p className="text-center py-10 text-gray-500">No applications have been made to your gigs yet.</p>
            ) : (
                applications.map(app => {
                    const gigTitle = gigs.find(g => g.id === app.gig_id)?.title || `Gig ID: ${app.gig_id}`;
                    return (
                        <div key={app.id} className="bg-white p-5 rounded-xl shadow-md border-l-4 border-teal-500 transition duration-150 hover:shadow-lg">
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-gray-800">
                                    <span className="font-bold text-teal-600">{app.client_name || app.client_id}</span> applied for:
                                </p>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${app.status === 'Accepted' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {app.status}
                                </span>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 truncate mt-1">{gigTitle}</h4>
                            
                            <p className="text-sm text-gray-700 italic mt-2 border-l-2 pl-2 border-gray-200">
                                "{app.message}"
                            </p>
                            <div className="mt-3 text-xs text-gray-500 border-t pt-2 text-right">
                                <span>Date: {formatDate(app.created_at)}</span>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
    
    // --- Main Layout ---
    return (
        <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-8">
            <style>{`
                /* Ensures Inter font is used */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
                body { font-family: 'Inter', sans-serif; }
            `}</style>
            
            <header className="mb-8 border-b pb-4 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-800">Freelancer Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Viewing data for Freelancer ID: <span className="font-mono text-xs bg-gray-200 p-1 rounded-md text-gray-700">{MOCK_FREELANCER_ID}</span>
                    </p>
                </div>
                <button 
                    onClick={fetchGigs} 
                    disabled={isLoading}
                    className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition duration-150 disabled:bg-gray-400"
                    title="Manually refresh data from Django API"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>{isLoading ? 'Loading...' : 'Refresh Data'}</span>
                </button>
            </header>

            {/* Error Message */}
            {error && (
                <div className="p-3 mb-6 text-center text-red-700 bg-red-100 border border-red-300 rounded-lg max-w-4xl mx-auto shadow-md">
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {/* Navigation Tabs */}
            <nav className="flex space-x-1 bg-white p-2 rounded-xl shadow-2xl mb-8 max-w-4xl mx-auto">
                {[
                    { key: 'dashboard', name: 'Dashboard Overview', icon: Users }, 
                    { key: 'gigs', name: 'My Gigs', icon: Briefcase }, 
                    { key: 'applications', name: 'Applications', icon: Mail }
                ].map(({ key, name, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`
                            flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 flex-1
                            ${activeTab === key
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                            }
                        `}
                    >
                        <Icon className="w-4 h-4" />
                        <span>{name}</span>
                    </button>
                ))}
            </nav>

            {/* Content Area */}
            <main className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-2xl min-h-[500px]">
                {/* Show a centralized loading indicator if data is being fetched */}
                {isLoading && (
                    <div className="flex items-center justify-center h-full p-20">
                        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                        <p className="ml-3 text-indigo-600 font-medium">Fetching dynamic data...</p>
                    </div>
                )}
                
                {!isLoading && activeTab === 'dashboard' && renderDashboard()}
                {!isLoading && activeTab === 'gigs' && renderGigs()}
                {!isLoading && activeTab === 'applications' && renderApplications()}
            </main>
        </div>
    );
};

export default App;

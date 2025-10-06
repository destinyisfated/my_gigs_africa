'use client';
import React, { useState, useMemo, useEffect } from "react";

// --- Simplified Components (Retained from your original code) ---
// (Button, Card, CardHeader, CardTitle, etc., and all SVG icons)
const Button = (props) => (
  <button 
    {...props} 
    className={`p-2 rounded-md transition-colors duration-200 flex items-center justify-center ${props.className}`}
    onClick={props.onClick}
    disabled={props.disabled}
  >{props.children}</button>
);
// ... (Include all other simplified components and SVGs here) ...
const Card = (props) => <div {...props} className={`rounded-xl shadow-lg border border-gray-200 ${props.className}`}>{props.children}</div>;
const CardHeader = (props) => <div className="p-4 border-b border-gray-100">{props.children}</div>;
const CardTitle = (props) => <h2 className="text-xl font-semibold">{props.children}</h2>;
const CardContent = (props) => <div className="p-4">{props.children}</div>;
const Tabs = (props) => <div {...props}>{props.children}</div>;
const TabsList = (props) => <div className="flex bg-gray-100 rounded-xl p-1" {...props}>{props.children}</div>;
const TabsTrigger = (props) => <button className={`flex-1 p-2 rounded-lg transition-all ${props['data-state'] === 'active' ? 'bg-white shadow-md' : 'text-gray-600'}`} onClick={() => props.onValueChange(props.value)}>{props.children}</button>;
const TabsContent = (props) => <div style={{ display: props.value === props.activeTab ? 'block' : 'none' }}>{props.children}</div>; // Simplified Tab Content
const Badge = (props) => <span className={`px-3 py-1 text-xs font-semibold rounded-full ${props.className}`}>{props.children}</span>;
const Avatar = (props) => <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">{props.children}</div>;
const AvatarFallback = (props) => <span className="text-lg font-bold text-gray-700">{props.children}</span>;
const Plus = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const Users = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M18.5 7a4 4 0 0 1 0 8"></path></svg>;
const Eye = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const MessageSquare = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const Clock = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const Briefcase = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
const ArrowLeft = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const Edit = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const ListOrdered = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1"></path><path d="M3 12h2"></path><path d="M4 18h1"></path></svg>;

// Mock authentication state
const useMockUser = () => {
  // Simulate a loaded and signed-in user
  const mockUser = {
    id: "user_mock123",
    firstName: "Aisha",
    lastName: "Musa",
    email: "aisha.musa@example.com",
    profileImageUrl: "",
  };
  return { isLoaded: true, isSignedIn: true, user: mockUser };
};
// Utility function to get status badge styling
const getStatusBadgeVariant = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700 border border-green-200";
    case "in-progress":
      return "bg-blue-100 text-blue-700 border border-blue-200";
    case "pending":
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-200";
  }
};

// --- Application Card Component (Retained) ---
const ApplicationCard = ({ application }) => (
  <div
    key={application.id}
    className="border border-slate-200 rounded-xl p-6 bg-slate-100"
  >
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
      <div className="flex items-center gap-4 mb-4 sm:mb-0">
        <Avatar className="w-14 h-14">
          <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-xl">
            {application.clientName // ASSUMING clientName comes from the application data
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold text-slate-900">
            {application.clientName}
          </h4>
          <p className="text-sm text-slate-600 font-medium">
            Gig: {application.gig_title} {/* Use gig_title from your expected API response */}
          </p>
          <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3 text-slate-400" />
            Applied {new Date(application.created_at || application.applied_at).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="text-left sm:text-right">
        <p className="font-bold text-slate-900 text-xl">
          {application.budget}
        </p>
        <Badge
          className={getStatusBadgeVariant(application.status)}
        >
          {application.status}
        </Badge>
      </div>
    </div>
    {/* ... (Rest of ApplicationCard content) ... */}
  </div>
);

// --- Gig Detail View Component (Modified to accept real data structure) ---
const GigDetailView = ({ gig, allApplications, onBack }) => {
    // ... (rest of component logic retained, assuming gig and allApplications passed down) ...
    const [activeSubTab, setActiveSubTab] = useState("details");
    const [isEditing, setIsEditing] = useState(false);
    const [editableGig, setEditableGig] = useState(gig);

    // Filter and sort applications for the selected gig (most recent first)
    const gigApplications = useMemo(() => {
      return allApplications
        .filter((app) => app.gig.id === gig.id) // IMPORTANT: Filter by app.gig.id since you are passing ALL applications
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }, [gig.id, allApplications]);

    // ... (rest of GigDetailView content, using gig.title, gig.description, etc.)
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-8 py-10">
            {/* Header and Back Button */}
            <div className="flex items-center gap-4 mb-8">
                <Button onClick={() => onBack()} className="bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 border border-slate-300 transition-colors duration-200">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 truncate">{gig.title}</h1>
            </div>

            {/* Gig Detail Tabs */}
            <Tabs activeTab={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 bg-slate-100 rounded-xl p-1 font-semibold">
                    <TabsTrigger value="details" onValueChange={setActiveSubTab} data-state={activeSubTab === "details" ? "active" : "inactive"}>Gig Details & Edit</TabsTrigger>
                    <TabsTrigger value="applications" onValueChange={setActiveSubTab} data-state={activeSubTab === "applications" ? "active" : "inactive"}>
                        Applications ({gigApplications.length})
                    </TabsTrigger>
                </TabsList>

                {/* Gig Details and Edit Tab Content */}
                <TabsContent value="details" activeTab={activeSubTab}>
                    <Card className="bg-white border border-slate-200 rounded-xl shadow-md p-6">
                        {isEditing ? (
                            <form onSubmit={handleSave} className="space-y-6 mt-4">
                                <div><label htmlFor="title">Gig Title</label><input type="text" id="title" name="title" value={editableGig.title} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border" required /></div>
                                <div><label htmlFor="description">Description</label><textarea id="description" name="description" rows="4" value={editableGig.description} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border" required ></textarea></div>
                                <div><label htmlFor="price">Price (KES)</label><input type="text" id="price" name="price" value={editableGig.price} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border" required /></div>
                                <Button type="submit" className="w-full bg-gradient-to-br from-purple-700 to-green-500 hover:from-green-700 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-md shadow-md">Save Changes</Button>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-slate-600 font-medium">{editableGig.description}</p>
                                <div className="flex flex-wrap gap-6 border-t pt-4 border-slate-100">
                                    <span className="text-lg font-semibold text-slate-900">Price: {editableGig.price}</span>
                                    <Badge className={getStatusBadgeVariant(editableGig.status)}>{editableGig.status}</Badge>
                                    <span className="flex items-center gap-2 text-sm text-slate-600"><Eye className="w-4 h-4 text-slate-400" /> {editableGig.views} views</span>
                                    <span className="flex items-center gap-2 text-sm text-slate-600"><MessageSquare className="w-4 h-4 text-slate-400" /> {gigApplications.length} applications</span>
                                </div>
                            </div>
                        )}
                    </Card>
                </TabsContent>

                {/* Gig Applications Tab Content */}
                <TabsContent value="applications" activeTab={activeSubTab}>
                    <div className="space-y-6">
                        <h4 className="text-lg font-bold text-slate-700">Recent Applications for {gig.title}</h4>
                        {gigApplications.length > 0 ? (
                            gigApplications.map((application) => (
                                <ApplicationCard key={application.id} application={application} />
                            ))
                        ) : (
                            <p className="text-slate-500 p-6 bg-white rounded-xl shadow-md text-center">No applications yet for this gig.</p>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};


// --- The Core FreelancerDashboard Component (using props) ---

const FreelancerDashboard = ({ onCreateGig, onSelectGig, dashboardData }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { isLoaded, isSignedIn, user } = useMockUser();
  
  const { gigs, applications } = dashboardData;

  // Calculate stats based on fetched data
  const totalGigsCreated = gigs.length;
  const uniqueClients = new Set(applications.map(app => app.clientName)).size;
  const sortedApplications = useMemo(() => {
    // Sort by created_at field from the API
    return [...applications].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [applications]);

  const stats = {
    totalGigs: totalGigsCreated,
    totalClients: uniqueClients,
  };

  // Map gigs to include application count
  const myGigsWithApplications = gigs.map(gig => ({
    ...gig,
    applications: applications.filter(app => app.gig.id === gig.id).length // Assuming app.gig is the nested gig object
  }));

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }
  
  // ... (The rest of the component body, replacing mockGigs/mockApplications with gigs/applications) ...
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-Quicksand">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-3">
          <div className="flex justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-l from-red-700 to-purple-800 bg-clip-text text-transparent">
                Welcome: {user.firstName || user.lastName}
              </h1>
            </div>
            <Button
              className="bg-gradient-to-br from-purple-700 to-green-500 hover:from-green-700 hover:to-blue-600 text-black font-bold py-2 px-6 rounded-md shadow-md transform transition-transform duration-200 hover:scale-105 cursor-pointer"
              onClick={onCreateGig}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Gig
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-8 py-10">
        <Tabs
          activeTab={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-3 bg-slate-100 rounded-xl p-1 font-semibold">
            <TabsTrigger
              value="overview"
              onValueChange={setActiveTab}
              data-state={activeTab === "overview" ? "active" : "inactive"}
              className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md rounded-xl transition-all duration-300"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="gigs"
              onValueChange={setActiveTab}
              data-state={activeTab === "gigs" ? "active" : "inactive"}
              className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md rounded-xl transition-all duration-300"
            >
              My Gigs
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              onValueChange={setActiveTab}
              data-state={activeTab === "applications" ? "active" : "inactive"}
              className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md rounded-xl transition-all duration-300"
            >
              Applications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" activeTab={activeTab} className="space-y-8">
            {/* Stats Cards with gradients and mobile responsiveness */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              
              {/* Total Gigs Created Card (Replaces Active Gigs, showing total created) */}
              <Card className="bg-gradient-to-br from-purple-600 to-pink-500 text-white border border-purple-400 rounded-xl shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Total Gigs Created</p>
                      <p className="text-3xl font-bold mt-1">
                        {stats.totalGigs}
                      </p>
                    </div>
                    <Briefcase className="h-10 w-10 text-white/80" />
                  </div>
                </CardContent>
              </Card>

              {/* Total Clients Card (Showing unique clients who applied) */}
              <Card className="bg-gradient-to-br from-blue-500 to-teal-400 text-white border border-blue-300 rounded-xl shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Total Clients (Applicants)</p>
                      <p className="text-3xl font-bold mt-1">
                        {stats.totalClients}
                      </p>
                    </div>
                    <Users className="h-10 w-10 text-white/80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white border border-slate-200 rounded-xl shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-900">
                  Recent Client Applications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Using the first 2 sorted applications for recent view */}
                  {sortedApplications.slice(0, 2).map((application) => (
                    <div
                      key={application.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                      onClick={() => onSelectGig(gigs.find(g => g.id === application.gig.id))} // Find the full gig object
                    >
                      <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-lg">
                            {application.clientName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-slate-900">
                            {application.clientName}
                          </h4>
                          <p className="text-sm text-slate-600 font-medium">
                            {application.gig.title}
                          </p>
                          <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {new Date(application.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-bold text-slate-900">
                          {application.budget}
                        </p>
                        <Badge
                          className={getStatusBadgeVariant(application.status)}
                        >
                          {application.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {sortedApplications.length > 2 && (
                    <Button
                      onClick={() => setActiveTab('applications')}
                      className="w-full bg-slate-100 text-purple-600 font-bold hover:bg-slate-200 border border-slate-300"
                    >
                      View All Applications
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gigs" activeTab={activeTab} className="space-y-8">
            <div className="grid gap-6">
              {myGigsWithApplications.map((gig) => (
                <Card
                  key={gig.id}
                  className="bg-white border border-slate-200 rounded-xl shadow-md cursor-pointer transition-shadow duration-200 hover:shadow-lg hover:border-purple-300"
                  onClick={() => onSelectGig(gig)} // Clicking card selects gig
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                      <div className="flex-1 mb-4 sm:mb-0">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{gig.title}</h3>
                        <p className="text-sm text-slate-600">{gig.description.substring(0, 100)}...</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-bold text-slate-900 text-2xl">{gig.price}</p>
                        <Badge className={getStatusBadgeVariant(gig.status)}>{gig.status}</Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
                      <span className="flex items-center gap-2 text-sm text-slate-600">
                        <Eye className="w-4 h-4 text-slate-400" /> {gig.views || 0} views
                      </span>
                      <span className="flex items-center gap-2 text-sm text-slate-600">
                        <MessageSquare className="w-4 h-4 text-slate-400" /> {gig.applications} applications
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" activeTab={activeTab} className="space-y-6">
            <h4 className="text-lg font-bold text-slate-700">All Client Applications</h4>
            {sortedApplications.length > 0 ? (
              sortedApplications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))
            ) : (
              <p className="text-slate-500 p-6 bg-white rounded-xl shadow-md text-center">No client applications yet.</p>
            )}
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};


// --- The NEW Parent Component to handle state and fetching ---

const initialDashboardData = { gigs: [], applications: [] };

export default function DashboardParent() {
    const [page, setPage] = useState('dashboard'); // 'dashboard', 'create_gig', 'gig_detail'
    const [selectedGig, setSelectedGig] = useState(null);
    const [dashboardData, setDashboardData] = useState(initialDashboardData);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- 1. The Core Data Fetching Logic ---
    useEffect(() => {
        async function fetchDashboardData() {
            // NOTE: Replace this with your actual backend URL and ensure
            // your application handles authentication (sending the JWT/cookie).
            const API_URL = 'http://localhost:8000/api/freelancer-data/'; 
            
            try {
                const response = await fetch(API_URL, {
                    headers: {
                        // IMPORTANT: You must include the Authorization header (e.g., Bearer Token)
                        // or cookies for Django to authenticate request.user.
                        // Assuming you have a way to get the token (e.g., from an http-only cookie or local storage)
                        // 'Authorization': 'Bearer YOUR_AUTH_TOKEN' 
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setDashboardData(data);
                setError(null);
            } catch (e) {
                console.error("Failed to fetch dashboard data:", e);
                setError("Failed to load dashboard data. Please check your network or login status.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchDashboardData();
    }, []);

    const handleSelectGig = (gig) => {
        setSelectedGig(gig);
        setPage('gig_detail');
    };

    const handleBack = () => {
        setPage('dashboard');
        setSelectedGig(null);
    };

    const handleCreateGig = () => {
        setPage('create_gig');
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-2xl">Loading Dashboard...</div>;
    }
    
    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">{error}</div>;
    }

    // --- 2. Render the correct page based on state ---
    switch (page) {
        case 'create_gig':
            return <CreateGigPage onBack={handleBack} />;
        case 'gig_detail':
            return <GigDetailView 
                gig={selectedGig} 
                allApplications={dashboardData.applications} 
                onBack={handleBack} 
            />;
        case 'dashboard':
        default:
            return (
                <FreelancerDashboard 
                    onCreateGig={handleCreateGig} 
                    onSelectGig={handleSelectGig} 
                    dashboardData={dashboardData} // Pass fetched data here
                />
            );
    }
}
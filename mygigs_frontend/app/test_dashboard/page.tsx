'use client';
import React, { useState, useMemo } from "react";

// The following imports are internal components and icons, assumed available in this context
// For simplicity, we use basic div/button structure and inline styles to replace them where necessary, 
// but retain the names for conceptual clarity.
const Button = (props) => (
  <button 
    {...props} 
    className={`p-2 rounded-md transition-colors duration-200 flex items-center justify-center ${props.className}`}
    onClick={props.onClick}
    disabled={props.disabled}
  >{props.children}</button>
);

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

// Simplified Lucide Icons as SVG for the single-file environment
const Plus = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const Users = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M18.5 7a4 4 0 0 1 0 8"></path></svg>;
const Eye = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const MessageSquare = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const Clock = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const Briefcase = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
const ArrowLeft = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const Edit = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const ListOrdered = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1"></path><path d="M3 12h2"></path><path d="M4 18h1"></path></svg>;
// --- End Simplified Components ---


// Mock authentication state since external libraries like Clerk cannot be resolved
const useMockUser = () => {
  // Simulate a loaded and signed-in user
  const mockUser = {
    id: "user_mock123",
    firstName: "Aisha",
    lastName: "Musa",
    email: "aisha.musa@example.com",
    profileImageUrl: "",
  };

  return {
    isLoaded: true,
    isSignedIn: true,
    user: mockUser,
  };
};


// --- Mock Data Structures (Updated for better linkage and sorting) ---

// Gigs Data
const mockGigs = [
  { id: 1, title: "E-commerce Website Development", description: "I'll build modern, responsive websites using React and Node.js.", price: "KES 20,000", views: 234, status: "active", createdAt: "2024-09-01T10:00:00Z" },
  { id: 2, title: "Custom CRM System", description: "I will design and develop a custom CRM tailored to your business needs.", price: "KES 50,000", views: 56, status: "in-progress", createdAt: "2024-08-15T10:00:00Z" },
  { id: 3, title: "Blog Platform with CMS", description: "A fully functional blog with a user-friendly Content Management System.", price: "KES 15,000", views: 120, status: "completed", createdAt: "2024-07-20T10:00:00Z" },
];

// Applications Data (All applications across all gigs)
const mockApplications = [
  // Gig 2 Applications
  { id: 201, gigId: 2, clientName: "Fin-Tech Solutions", gigTitle: "Custom CRM System", appliedAt: "2024-09-26T08:00:00Z", budget: "KES 15,000", status: "pending", message: "We need a modern, intuitive design for our new financial application. Your aesthetic would be a perfect fit." },
  // Gig 1 Applications
  { id: 101, gigId: 1, clientName: "Team Allegiance", gigTitle: "E-commerce Website Development", appliedAt: "2024-09-25T14:30:00Z", budget: "KES 25,000", status: "pending", message: "Hi! I'm looking for a developer to build an e-commerce platform for my fashion brand. Your portfolio looks impressive!" },
  { id: 102, gigId: 1, clientName: "Another Client Co.", gigTitle: "E-commerce Website Development", appliedAt: "2024-09-24T10:00:00Z", budget: "KES 22,000", status: "pending", message: "We are a startup and need a quick launch for our online store. Are you available immediately?" },
  // Gig 3 Applications
  { id: 301, gigId: 3, clientName: "Old Project Corp", gigTitle: "Blog Platform with CMS", appliedAt: "2024-09-05T12:00:00Z", budget: "KES 10,000", status: "completed", message: "The blog is live and we are happy with the work. Great job!" },
  { id: 302, gigId: 3, clientName: "Vintage Apps Inc.", gigTitle: "Blog Platform with CMS", appliedAt: "2024-09-03T18:00:00Z", budget: "KES 11,000", status: "pending", message: "We love the features you offer for the CMS. We'd like to discuss custom themes." },
];

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

// --- Gig Detail View Component ---

const GigDetailView = ({ gig, allApplications, onBack }) => {
  const [activeSubTab, setActiveSubTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [editableGig, setEditableGig] = useState(gig);

  // Filter and sort applications for the selected gig (most recent first)
  const gigApplications = useMemo(() => {
    return allApplications
      .filter((app) => app.gigId === gig.id)
      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
  }, [gig.id, allApplications]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableGig((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Updated Gig Data:", editableGig);
    // In a real app, send data to backend here.
    setIsEditing(false);
    // Note: In a real app, you'd update the main gig list state here.
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-8 py-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        .font-Quicksand { font-family: 'Inter', sans-serif; }
      `}</style>
      
      {/* Header and Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          onClick={() => onBack()}
          className="bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 border border-slate-300 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 truncate">
          {gig.title}
        </h1>
      </div>

      {/* Gig Detail Tabs */}
      <Tabs
        activeTab={activeSubTab}
        onValueChange={setActiveSubTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 bg-slate-100 rounded-xl p-1 font-semibold">
          <TabsTrigger
            value="details"
            onValueChange={setActiveSubTab}
            data-state={activeSubTab === "details" ? "active" : "inactive"}
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md rounded-xl transition-all duration-300"
          >
            Gig Details & Edit
          </TabsTrigger>
          <TabsTrigger
            value="applications"
            onValueChange={setActiveSubTab}
            data-state={activeSubTab === "applications" ? "active" : "inactive"}
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md rounded-xl transition-all duration-300"
          >
            Applications ({gigApplications.length})
          </TabsTrigger>
        </TabsList>

        {/* Gig Details and Edit Tab Content */}
        <TabsContent value="details" activeTab={activeSubTab}>
          <Card className="bg-white border border-slate-200 rounded-xl shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-slate-900">{editableGig.title}</h3>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md transition-colors duration-200"
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? "Cancel Edit" : "Edit Gig"}
              </Button>
            </div>

            {isEditing ? (
              // Edit Form
              <form onSubmit={handleSave} className="space-y-6 mt-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700">Gig Title</label>
                  <input type="text" id="title" name="title" value={editableGig.title} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border" required />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
                  <textarea id="description" name="description" rows="4" value={editableGig.description} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border" required ></textarea>
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price (KES)</label>
                  <input type="text" id="price" name="price" value={editableGig.price} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border" required />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-br from-purple-700 to-green-500 hover:from-green-700 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-md shadow-md">
                  Save Changes
                </Button>
              </form>
            ) : (
              // Read-Only Details
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

// --- Create Gig Page Component ---
const CreateGigPage = ({ onBack }) => {
  const [gigData, setGigData] = useState({
    title: "",
    description: "",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGigData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Gig Data:", gigData);
    // In a real application, you would send this data to a backend.
    onBack();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-4 mb-8">
        <Button
          onClick={onBack}
          className="bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 border border-slate-300 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-l from-red-700 to-purple-800 bg-clip-text text-transparent">
          Create a New Gig
        </h1>
      </div>

      <Card className="bg-white border border-slate-200 rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">Gig Title</label>
            <input type="text" id="title" name="title" value={gigData.title} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border" required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
            <textarea id="description" name="description" rows="4" value={gigData.description} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border" required ></textarea>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price (KES)</label>
            <input type="number" id="price" name="price" value={gigData.price} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border" required />
          </div>
          <Button type="submit" className="w-full bg-gradient-to-br from-purple-700 to-green-500 hover:from-green-700 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-md shadow-md transform transition-transform duration-200 hover:scale-105">
            Save Gig
          </Button>
        </form>
      </Card>
    </div>
  );
};

// --- Application Card Component (Reused) ---
const ApplicationCard = ({ application }) => (
  <div
    key={application.id}
    className="border border-slate-200 rounded-xl p-6 bg-slate-100"
  >
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
      <div className="flex items-center gap-4 mb-4 sm:mb-0">
        <Avatar className="w-14 h-14">
          <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-xl">
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
            Gig: {application.gigTitle}
          </p>
          <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3 text-slate-400" />
            Applied {new Date(application.appliedAt).toLocaleString()}
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

    <div className="mb-4">
      <p className="text-sm text-slate-600 mb-2 font-semibold">
        Client Message:
      </p>
      <div className="bg-slate-200 p-4 rounded-lg">
        <p className="text-sm text-slate-800 font-medium">
          {application.message}
        </p>
      </div>
    </div>

    <div className="flex flex-wrap gap-4">
      {application.status === "pending" && (
        <>
          <Button className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-md transition-shadow duration-200">
            Accept Project
          </Button>
          <Button className="bg-slate-300 text-slate-900 font-semibold hover:bg-slate-400 transition-colors duration-200">
            Send Message
          </Button>
          <Button
            variant="ghost"
            className="text-slate-600 font-semibold hover:bg-slate-200 p-2"
          >
            Decline
          </Button>
        </>
      )}
      {application.status === "in-progress" && (
        <>
          <Button className="bg-slate-300 text-slate-900 font-semibold hover:bg-slate-400 transition-colors duration-200">
            View Project
          </Button>
          <Button className="bg-slate-300 text-slate-900 font-semibold hover:bg-slate-400 transition-colors duration-200">
            Send Message
          </Button>
        </>
      )}
      {application.status === "completed" && (
        <Badge className="bg-green-100 text-green-700 border border-green-200">
          Project Completed
        </Badge>
      )}
    </div>
  </div>
);


// --- Original FreelancerDashboard component (Modified) ---

const FreelancerDashboard = ({ onCreateGig, onSelectGig }) => {
  const [activeTab, setActiveTab] = useState("overview");
  // FIX: Using mock hook instead of Clerk's useUser
  const { isLoaded, isSignedIn, user } = useMockUser(); 

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    // With mock user, this should not be hit, but kept for logical completeness
    return <div>Not signed in</div>;
  }

  // Calculate unique clients and total gigs
  const totalGigsCreated = mockGigs.length;
  const uniqueClients = new Set(mockApplications.map(app => app.clientName)).size;
  const sortedApplications = useMemo(() => {
    return [...mockApplications].sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
  }, []);

  const stats = {
    totalGigs: totalGigsCreated,
    totalClients: uniqueClients,
  };

  const myGigsWithApplications = mockGigs.map(gig => ({
    ...gig,
    applications: mockApplications.filter(app => app.gigId === gig.id).length
  }));


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

              {/* Success Rate Card Removed */}
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
                      onClick={() => onSelectGig(mockGigs.find(g => g.id === application.gigId))}
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
                            {application.gigTitle}
                          </p>
                          <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {new Date(application.appliedAt).toLocaleDateString()}
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
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                          {gig.title}
                        </h3>
                        <p className="text-slate-600 mb-4 font-medium line-clamp-2">
                          {gig.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-600 font-medium">
                          <span className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-slate-400" />
                            {gig.views} views
                          </span>
                          <span className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-slate-400" />
                            {gig.applications} applications
                          </span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-2xl font-bold text-slate-900 mb-2">
                          {gig.price}
                        </p>
                        <Badge className={getStatusBadgeVariant(gig.status)}>
                          {gig.status}
                        </Badge>
                      </div>
                    </div>
                    {/* Buttons are removed from here and moved to GigDetailView */}
                    <div className="flex flex-wrap gap-4 border-t pt-4 mt-4">
                      <Button className="bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition-colors duration-200">
                        View/Edit Gig
                      </Button>
                      <Button className="bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition-colors duration-200">
                        View Applications
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" activeTab={activeTab} className="space-y-8">
            <Card className="bg-white border border-slate-200 rounded-xl shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <ListOrdered className="w-5 h-5 text-slate-500" />
                  All Client Applications ({sortedApplications.length})
                </CardTitle>
                <p className="text-sm text-slate-500">Applications are listed from most recent to oldest.</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {sortedApplications.map((application) => (
                    <ApplicationCard key={application.id} application={application} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// The main App component that handles page navigation and state management
const App = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedGig, setSelectedGig] = useState(null);

  const handleCreateGigClick = () => {
    setSelectedGig(null);
    setCurrentPage("createGig");
  };

  const handleBackToDashboard = () => {
    setSelectedGig(null);
    setCurrentPage("dashboard");
  };

  const handleSelectGig = (gig) => {
    setSelectedGig(gig);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        .font-Quicksand { font-family: 'Inter', sans-serif; }
      `}</style>
      {selectedGig ? (
        <GigDetailView 
          gig={selectedGig} 
          allApplications={mockApplications} 
          onBack={handleBackToDashboard} 
        />
      ) : currentPage === "dashboard" ? (
        <FreelancerDashboard 
          onCreateGig={handleCreateGigClick} 
          onSelectGig={handleSelectGig} 
        />
      ) : (
        <CreateGigPage onBack={handleBackToDashboard} />
      )}
    </div>
  );
};

export default App;

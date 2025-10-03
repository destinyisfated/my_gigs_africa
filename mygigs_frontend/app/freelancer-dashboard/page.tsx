"use client";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus,
  Users,
  Eye,
  MessageSquare,
  Clock,
  TrendingUp,
  Briefcase,
} from "lucide-react";

const App = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const handleCreateGigClick = () => setCurrentPage("createGig");
  const handleBackToDashboard = () => setCurrentPage("dashboard");
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {currentPage === "dashboard" ? (
        <FreelancerDashboard onCreateGig={handleCreateGigClick} />
      ) : (
        <CreateGigPage onBack={handleBackToDashboard} />
      )}
    </div>
  );
};

const FreelancerDashboard = ({ onCreateGig }) => {
  const { getToken } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [myGigs, setMyGigs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setError("");
      const token = await getToken();
      if (!token) {
        setError("No Clerk token found. Please sign in.");
        return;
      }
      if (!user?.id) return;
      const clerkId = user.id;
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Stats
      fetch(`http://localhost:8000/core/dashboard-stats/${clerkId}/`, {
        method: "GET",
        headers,
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch stats");
          return res.json();
        })
        .then(setStats)
        .catch(err => {
          setError("Could not load dashboard stats.");
          setStats(null);
        });

      // Recent Applications
      fetch(`http://localhost:8000/core/recent-applications/${clerkId}/`, {
        method: "GET",
        headers,
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch applications");
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setRecentApplications(data);
          } else {
            setRecentApplications([]);
          }
        })
        .catch(() => setRecentApplications([]));

      // My Gigs
      fetch(`http://localhost:8000/core/my-gigs/${clerkId}/`, {
        method: "GET",
        headers,
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch gigs");
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setMyGigs(data);
          } else {
            setMyGigs([]);
          }
        })
        .catch(() => setMyGigs([]));
    }
    if (isLoaded && isSignedIn && user?.id) fetchData();
  }, [isLoaded, isSignedIn, user, getToken]);

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Not signed in</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!stats) return <div>Loading dashboard...</div>;

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
              className="bg-gradient-to-br from-purple-700 to-green-500 hover:from-green-700 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-md shadow-md transform transition-transform duration-200 hover:scale-105 cursor-pointer"
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
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-3 bg-slate-100 rounded-xl p-1 font-semibold">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md rounded-xl transition-all duration-300">
              Overview
            </TabsTrigger>
            <TabsTrigger value="gigs" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md rounded-xl transition-all duration-300">
              My Gigs
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md rounded-xl transition-all duration-300">
              Applications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-purple-600 to-pink-500 text-white border border-purple-400 rounded-xl shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Active Gigs</p>
                      <p className="text-3xl font-bold mt-1">
                        {stats.activeGigs}
                      </p>
                    </div>
                    <Briefcase className="h-10 w-10 text-white/80" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-500 to-teal-400 text-white border border-blue-300 rounded-xl shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Total Clients</p>
                      <p className="text-3xl font-bold mt-1">
                        {stats.totalClients}
                      </p>
                    </div>
                    <Users className="h-10 w-10 text-white/80" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-red-500 to-orange-400 text-white border border-red-300 rounded-xl shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Success Rate</p>
                      <p className="text-3xl font-bold mt-1">
                        {stats.completionRate}%
                      </p>
                    </div>
                    <TrendingUp className="h-10 w-10 text-white/80" />
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
                  {recentApplications.map((application) => (
                    <div
                      key={application.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-100"
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
                            {application.appliedAt}
                          </p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-bold text-slate-900">
                          {application.budget}
                        </p>
                        <Badge className={getStatusBadgeVariant(application.status)}>
                          {application.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gigs" className="space-y-8">
            <div className="grid gap-6">
              {myGigs.map((gig) => (
                <Card
                  key={gig.id}
                  className="bg-white border border-slate-200 rounded-xl shadow-md"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                      <div className="flex-1 mb-4 sm:mb-0">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                          {gig.title}
                        </h3>
                        <p className="text-slate-600 mb-4 font-medium">
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
                        <Badge className="bg-green-100 text-green-700 border border-green-200">
                          {gig.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <Button className="bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 border border-slate-300 transition-colors duration-200">
                        Edit
                      </Button>
                      <Button className="bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 border border-slate-300 transition-colors duration-200">
                        View Applications
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-8">
            <Card className="bg-white border border-slate-200 rounded-xl shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-900">
                  Client Applications ({recentApplications.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {recentApplications.map((application) => (
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
                              {application.gigTitle}
                            </p>
                            <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              Applied {application.appliedAt}
                            </p>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-bold text-slate-900 text-xl">
                            {application.budget}
                          </p>
                          <Badge className={getStatusBadgeVariant(application.status)}>
                            {application.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-slate-600 mb-2 font-semibold">
                          Client Message:
                        </p>
                        <div className="bg-slate-100 p-4 rounded-lg">
                          <p className="text-sm text-slate-800 font-medium">
                            {application.message}
                          </p>
                        </div>
                      </div>
                    </div>
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

// ...existing CreateGigPage...
export default App;
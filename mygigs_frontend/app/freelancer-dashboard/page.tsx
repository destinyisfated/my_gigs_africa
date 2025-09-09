"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import {
  Plus,
  DollarSign,
  Users,
  Eye,
  MessageSquare,
  Clock,
  TrendingUp,
  Briefcase,
  ArrowLeft,
} from "lucide-react";

// The main App component that handles page navigation
const App = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleCreateGigClick = () => {
    setCurrentPage("createGig");
  };

  const handleBackToDashboard = () => {
    setCurrentPage("dashboard");
  };

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased"
      style={{ fontFamily: "'Quicksand', sans-serif" }}
    >
      {currentPage === "dashboard" ? (
        <FreelancerDashboard onCreateGig={handleCreateGigClick} />
      ) : (
        <CreateGigPage onBack={handleBackToDashboard} />
      )}
    </div>
  );
};

// Original FreelancerDashboard component
const FreelancerDashboard = ({ onCreateGig }) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - in real app, this would come from your backend
  const stats = {
    totalEarnings: 125000,
    activeGigs: 3,
    totalClients: 5,
    completionRate: 95,
  };

  const recentApplications = [
    {
      id: 1,
      clientName: "Team Allegiance",
      gigTitle: "E-commerce Website Development",
      appliedAt: "2 hours ago",
      budget: "KES 25,000",
      status: "pending",
      message:
        "Hi! I'm looking for a developer to build an e-commerce platform for my fashion brand. Your portfolio looks impressive!",
    },
    {
      id: 2,
      clientName: "Fin-Tech Solutions",
      gigTitle: "Mobile App UI/UX Design",
      appliedAt: "1 day ago",
      budget: "KES 15,000",
      status: "pending",
      message:
        "We need a modern, intuitive design for our new financial application. Your aesthetic would be a perfect fit.",
    },
  ];

  const myGigs = [
    {
      id: 1,
      title: "E-commerce Website Development",
      description:
        "I'll build modern, responsive websites using React and Node.js",
      price: "KES 20,000",
      views: 234,
      applications: 12,
      status: "active",
    },
    {
      id: 2,
      title: "Custom CRM System",
      description: "I will design and develop a custom CRM tailored to your business needs.",
      price: "KES 50,000",
      views: 56,
      applications: 3,
      status: "in-progress",
    },
    {
      id: 3,
      title: "Blog Platform with CMS",
      description: "A fully functional blog with a user-friendly Content Management System.",
      price: "KES 15,000",
      views: 120,
      applications: 8,
      status: "completed",
    },
  ];

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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-3">
          <div className="flex justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-l from-red-700 to-purple-800 bg-clip-text text-transparent">
                James, Dashboard
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-4 bg-slate-100 rounded-xl p-1 font-semibold">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md rounded-xl transition-all duration-300"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="gigs"
              className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md rounded-xl transition-all duration-300"
            >
              My Gigs
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md rounded-xl transition-all duration-300"
            >
              Applications
            </TabsTrigger>
            <TabsTrigger
              value="earnings"
              className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md rounded-xl transition-all duration-300"
            >
              Earnings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards with gradients and mobile responsiveness */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Earnings Card */}
              <Card className="bg-gradient-to-br from-yellow-400 to-amber-500 text-white border border-yellow-300 rounded-xl shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Total Earnings</p>
                      <p className="text-3xl font-bold mt-1">
                        ${stats.totalEarnings.toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="h-10 w-10 text-white/80" />
                  </div>
                </CardContent>
              </Card>

              {/* Active Gigs Card */}
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

              {/* Total Clients Card */}
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

              {/* Success Rate Card */}
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
                        <Badge
                          className={getStatusBadgeVariant(application.status)}
                        >
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
                          <Badge
                            className={getStatusBadgeVariant(
                              application.status
                            )}
                          >
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

                      <div className="flex flex-wrap gap-4">
                        {application.status === "pending" && (
                          <>
                            <Button className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-md transition-shadow duration-200">
                              Accept Project
                            </Button>
                            <Button className="bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 border border-slate-300 transition-colors duration-200">
                              Send Message
                            </Button>
                            <Button
                              variant="ghost"
                              className="text-slate-600 font-semibold hover:bg-slate-200"
                            >
                              Decline
                            </Button>
                          </>
                        )}
                        {application.status === "in-progress" && (
                          <>
                            <Button className="bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 border border-slate-300 transition-colors duration-200">
                              View Project
                            </Button>
                            <Button className="bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 border border-slate-300 transition-colors duration-200">
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <Card className="bg-white border border-slate-200 rounded-xl shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-900">
                  Earnings Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-slate-600 font-medium">
                  Track your earnings and payment history.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// New page for creating a new gig
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
    // For now, we'll just log it and navigate back.
    onBack();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-4 mb-8">
        <Button onClick={onBack} className="bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 border border-slate-300 transition-colors duration-200">
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
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-700"
            >
              Gig Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={gigData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={gigData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2"
              required
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-slate-700"
            >
              Price (KES)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={gigData.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-br from-purple-700 to-green-500 hover:from-green-700 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-md shadow-md transform transition-transform duration-200 hover:scale-105"
          >
            Save Gig
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default App;

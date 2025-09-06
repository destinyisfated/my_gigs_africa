"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import {
  Plus,
  DollarSign,
  Users,
  Eye,
  MessageSquare,
  Calendar,
  TrendingUp,
  Briefcase,
  Star,
  Clock,
} from "lucide-react";

interface FreelancerDashboardProps {
  onCreateGig: () => void;
}

const FreelancerDashboard = ({ onCreateGig }: FreelancerDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - in real app, this would come from your backend
  const stats = {
    totalEarnings: 12500,
    activeGigs: 8,
    totalClients: 45,
    completionRate: 98,
  };

  const recentApplications = [
    {
      id: 1,
      clientName: "Sarah Johnson",
      gigTitle: "E-commerce Website Development",
      appliedAt: "2 hours ago",
      budget: "KES 25,000",
      status: "pending",
      message:
        "Hi! I'm looking for a developer to build an e-commerce platform for my fashion brand. Your portfolio looks impressive!",
    },
    {
      id: 2,
      clientName: "Michael Chen",
      gigTitle: "Mobile App UI/UX Design",
      appliedAt: "1 day ago",
      budget: "KES 18,000",
      status: "in-progress",
      message:
        "I need a mobile app design for a fintech startup. Timeline is flexible and budget is negotiable.",
    },
    {
      id: 3,
      clientName: "David Ochieng",
      gigTitle: "Brand Identity Package",
      appliedAt: "3 days ago",
      budget: "KES 32,000",
      status: "completed",
      message:
        "Looking for a complete brand identity including logo, business cards, and style guide.",
    },
    {
      id: 4,
      clientName: "Grace Mwangi",
      gigTitle: "Website Redesign",
      appliedAt: "5 hours ago",
      budget: "KES 15,000",
      status: "pending",
      message:
        "Need to redesign my existing website to make it more modern and mobile-friendly.",
    },
    {
      id: 5,
      clientName: "James Kiprotich",
      gigTitle: "React Native App",
      appliedAt: "1 week ago",
      budget: "KES 45,000",
      status: "in-progress",
      message:
        "Building a delivery app for local restaurants. Need both iOS and Android versions.",
    },
  ];

  const myGigs = [
    {
      id: 1,
      title: "Full Stack Web Development",
      description:
        "I'll build modern, responsive websites using React and Node.js",
      price: "$50/hour",
      views: 234,
      applications: 12,
      status: "active",
    },
    {
      id: 2,
      title: "Mobile App Development",
      description: "Native iOS and Android app development with React Native",
      price: "$60/hour",
      views: 189,
      applications: 8,
      status: "active",
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
    <div
      className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased"
      style={{ fontFamily: "'Quicksand', sans-serif" }}
    >
      {/* Header */}
      <div className="bg-white shadow-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                Freelancer Dashboard
              </h1>
              <p className="text-slate-600 mt-1 font-medium text-sm sm:text-base">
                Manage your gigs and client relationships with ease.
              </p>
            </div>
            <Button
              className="bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105"
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

export default FreelancerDashboard;

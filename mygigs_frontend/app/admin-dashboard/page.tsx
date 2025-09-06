"use client";
// components/admin/Dashboard.tsx
import React, { useState } from "react";
import {
  Home,
  Users,
  Briefcase,
  BarChart2,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  Calendar,
} from "lucide-react";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Mock data for sections
  const totalUsers = 16815;
  const freelancers = 2023;
  const totalRevenue = 23902;
  const totalGigs = 1457;
  const revenueData = [8000, 6000, 9000, 7000, 5000, 10000]; // Jan to Jun
  const communityGrowth = 65;

  const freelancerList = [
    {
      id: 1,
      name: "John Doe",
      skills: "Web Development, React",
      rating: 4.8,
      gigsCompleted: 45,
    },
    {
      id: 2,
      name: "Jane Smith",
      skills: "Graphic Design, Photoshop",
      rating: 4.9,
      gigsCompleted: 32,
    },
    {
      id: 3,
      name: "Alex Johnson",
      skills: "Content Writing, SEO",
      rating: 4.7,
      gigsCompleted: 28,
    },
  ];

  const clientList = [
    { id: 1, name: "Company A", projectsPosted: 12, totalSpent: 4500 },
    { id: 2, name: "Company B", projectsPosted: 8, totalSpent: 3200 },
    { id: 3, name: "Company C", projectsPosted: 15, totalSpent: 5600 },
  ];

  const gigList = [
    {
      id: 1,
      title: "Build a React App",
      freelancer: "John Doe",
      price: 500,
      status: "Active",
    },
    {
      id: 2,
      title: "Logo Design",
      freelancer: "Jane Smith",
      price: 200,
      status: "Completed",
    },
    {
      id: 3,
      title: "SEO Optimization",
      freelancer: "Alex Johnson",
      price: 300,
      status: "Active",
    },
  ];

  const analyticsData = {
    userGrowth: [1000, 1200, 1500, 1800, 2000, 2200], // Monthly
    revenueByCategory: [
      { name: "Development", value: 40 },
      { name: "Design", value: 30 },
      { name: "Writing", value: 20 },
      { name: "Other", value: 10 },
    ],
  };

  const sidebarItems = [
    { name: "Dashboard", icon: Home },
    { name: "Freelancers", icon: Users },
    { name: "Clients", icon: Users },
    { name: "Analytics", icon: BarChart2 },
    { name: "Gigs", icon: Briefcase },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
                Dashboard
              </h2>
              <div className="flex items-center space-x-4 w-full md:w-auto">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 w-full bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <button className="p-2 bg-white border border-gray-300 rounded-lg shadow-md relative hover:bg-gray-50 transition">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>

            {/* Date Range */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-50 transition">
                  Day
                </button>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-50 transition">
                  Week
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md">
                  Month
                </button>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-50 transition">
                  Year
                </button>
              </div>
              <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-md">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span>1 Sep 2024 - 30 Sep 2024</span>
              </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-700 to-gray-800 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                <h3 className="text-xl font-bold">Total Revenue</h3>
                <p className="text-4xl">${totalRevenue.toLocaleString()}</p>
                <p className="text-green-200">+4.2% from last month</p>
              </div>
              <div className="bg-gradient-to-br from-gray-700 to-gray-900 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                <h3 className="text-xl font-bold">Total Users</h3>
                <p className="text-4xl">{totalUsers.toLocaleString()}</p>
                <p className="text-green-200">+1.7% from last month</p>
              </div>
              <div className="bg-gradient-to-br from-gray-700 to-gray-900 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                <h3 className="text-xl font-bold">Freelancers</h3>
                <p className="text-4xl">{freelancers.toLocaleString()}</p>
                <p className="text-red-200">-2.9% from last month</p>
              </div>
              <div className="bg-gradient-to-br from-blue-700 to-gray-800 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                <h3 className="text-xl font-bold">Total Gigs</h3>
                <p className="text-4xl">{totalGigs.toLocaleString()}</p>
                <p className="text-green-200">+0.9% from last month</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Total Revenue
                </h3>
                <div className="flex items-end space-x-2 h-48">
                  {revenueData.map((value, index) => (
                    <div key={index} className="flex-1 group">
                      <div
                        className="bg-gradient-to-t from-blue-600 to-gray-700 w-full rounded-t-lg transition-all duration-300 group-hover:scale-105"
                        style={{
                          height: `${
                            (value / Math.max(...revenueData)) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Community Growth
                </h3>
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                      strokeDasharray={`${communityGrowth}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-800">
                      {communityGrowth}%
                    </span>
                  </div>
                </div>
                <p className="text-green-600 mt-2 font-semibold">
                  +0.9% from last month
                </p>
              </div>
            </div>
          </div>
        );
      case "Freelancers":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
              Freelancers
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
              <table className="w-full min-w-[40rem]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left text-gray-800 font-bold">
                      Name
                    </th>
                    <th className="p-3 text-left text-gray-800 font-bold">
                      Skills
                    </th>
                    <th className="p-3 text-left text-gray-800 font-bold">
                      Rating
                    </th>
                    <th className="p-3 text-left text-gray-800 font-bold">
                      Gigs Completed
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {freelancerList.map((freelancer) => (
                    <tr
                      key={freelancer.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{freelancer.name}</td>
                      <td className="p-3">{freelancer.skills}</td>
                      <td className="p-3">{freelancer.rating}</td>
                      <td className="p-3">{freelancer.gigsCompleted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "Clients":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
              Clients
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
              <table className="w-full min-w-[40rem]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left text-gray-800 font-bold">
                      Name
                    </th>
                    <th className="p-3 text-left text-gray-800 font-bold">
                      Projects Posted
                    </th>
                    <th className="p-3 text-left text-gray-800 font-bold">
                      Total Spent
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clientList.map((client) => (
                    <tr
                      key={client.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{client.name}</td>
                      <td className="p-3">{client.projectsPosted}</td>
                      <td className="p-3">${client.totalSpent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "Analytics":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
              Analytics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  User Growth
                </h3>
                <div className="flex items-end space-x-2 h-48">
                  {analyticsData.userGrowth.map((value, index) => (
                    <div key={index} className="flex-1 group">
                      <div
                        className="bg-gradient-to-t from-blue-600 to-gray-700 w-full rounded-t-lg transition-all duration-300 group-hover:scale-105"
                        style={{
                          height: `${
                            (value / Math.max(...analyticsData.userGrowth)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Revenue by Category
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {analyticsData.revenueByCategory.map((cat) => (
                    <div key={cat.name} className="text-center">
                      <div className="bg-gradient-to-br from-gray-200 to-gray-400 h-20 w-full rounded-lg flex items-center justify-center text-xl font-bold text-gray-800">
                        {cat.value}%
                      </div>
                      <p className="mt-2 font-semibold text-gray-700">
                        {cat.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case "Gigs":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
              Gigs
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
              <table className="w-full min-w-[40rem]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left text-gray-800 font-bold">
                      Title
                    </th>
                    <th className="p-3 text-left text-gray-800 font-bold">
                      Freelancer
                    </th>
                    <th className="p-3 text-left text-gray-800 font-bold">
                      Price
                    </th>
                    <th className="p-3 text-left text-gray-800 font-bold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {gigList.map((gig) => (
                    <tr
                      key={gig.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{gig.title}</td>
                      <td className="p-3">{gig.freelancer}</td>
                      <td className="p-3">${gig.price}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            gig.status === "Active"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {gig.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col shadow-lg">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            MyGigsAfrica
          </h1>
        </div>
        <nav className="flex-1 px-6 py-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => setActiveTab(item.name)}
                  className={`flex items-center p-3 w-full text-left rounded-lg transition ${
                    activeTab === item.name
                      ? "bg-gradient-to-r from-blue-600 to-gray-700 text-white font-bold"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <item.icon className="mr-3 h-6 w-6" />
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-6 border-t border-gray-700">
          <button className="flex items-center w-full p-3 text-gray-300 hover:bg-gray-700 rounded-lg transition">
            <LogOut className="mr-3 h-6 w-6" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
    </div>
  );
};

export default Dashboard;

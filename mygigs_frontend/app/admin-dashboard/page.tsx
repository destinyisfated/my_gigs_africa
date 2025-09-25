"use client";
// components/admin/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
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

const Dashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [loading, setLoading] = useState(true);
  const [activeDateRange, setActiveDateRange] = useState("Month");

  // Dynamic data states
  const [totalUsers, setTotalUsers] = useState(0);
  const [freelancers, setFreelancers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalGigs, setTotalGigs] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [communityGrowth, setCommunityGrowth] = useState(0);

  // Mock data for different date ranges. You would replace this with real data
  // from your backend, likely by passing a date range parameter to your API.
  const mockRevenueData = {
    Day: [100, 120, 90, 150, 180, 200, 160, 220, 250, 210, 240, 280],
    Week: [800, 1200, 1000, 1500, 1800, 1600, 2000],
    Month: [5000, 7500, 12000, 9000, 15000, 18000],
    Year: [
      50000, 75000, 120000, 90000, 150000, 180000, 220000, 250000, 280000,
      300000, 350000, 400000,
    ],
  };

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
      skills: "UI/UX Design, Figma",
      rating: 4.9,
      gigsCompleted: 62,
    },
    {
      id: 3,
      name: "Peter Jones",
      skills: "Content Writing, SEO",
      rating: 4.7,
      gigsCompleted: 30,
    },
  ];

  const clientList = [
    { id: 1, name: "Company A", projectsPosted: 12, totalSpent: 4500 },
    { id: 2, name: "Startup B", projectsPosted: 8, totalSpent: 3200 },
    { id: 3, name: "Agency C", projectsPosted: 15, totalSpent: 6700 },
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
      title: "Design a landing page",
      freelancer: "Jane Smith",
      price: 350,
      status: "Completed",
    },
    {
      id: 3,
      title: "Write blog posts",
      freelancer: "Peter Jones",
      price: 200,
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

  useEffect(() => {
    const fetchDjangoData = async () => {
      try {
        // TODO: Replace with your actual Django API endpoint for dashboard data
        const response = await fetch(
          "https://your-django-api.com/api/dashboard-data",
          {
            headers: {
              // TODO: Add your Django backend authentication headers if needed
              Authorization: "Bearer YOUR_AUTH_TOKEN",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Django API error: ${response.statusText}`);
        }
        const data = await response.json();
        setTotalGigs(data.total_gigs);
        setTotalRevenue(data.total_revenue);
      } catch (error) {
        console.error("Failed to fetch Django data:", error);
      }
    };

    const fetchClerkData = async () => {
      try {
        // TODO: Replace with your actual Clerk API key
        const clerkApiKey = "YOUR_CLERK_API_KEY";
        const headers = {
          Authorization: `Bearer ${clerkApiKey}`,
          "Content-Type": "application/json",
        };

        // Fetch all users to get the total count
        const usersResponse = await fetch("https://api.clerk.dev/v1/users", {
          headers,
        });
        if (!usersResponse.ok) {
          throw new Error(`Clerk users API error: ${usersResponse.statusText}`);
        }
        const usersData = await usersResponse.json();
        setTotalUsers(usersData.length);

        // Fetch users with the "freelancer" role
        const freelancersResponse = await fetch(
          "https://api.clerk.dev/v1/users?role=freelancer",
          { headers }
        );
        if (!freelancersResponse.ok) {
          throw new Error(
            `Clerk freelancers API error: ${freelancersResponse.statusText}`
          );
        }
        const freelancersData = await freelancersResponse.json();
        setFreelancers(freelancersData.length);

        // Calculate community growth based on fetched data
        if (usersData.length > 0) {
          setCommunityGrowth(
            Math.floor((freelancersData.length / usersData.length) * 100)
          );
        }
      } catch (error) {
        console.error("Failed to fetch Clerk data:", error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchDjangoData(), fetchClerkData()]);
      setLoading(false);
      setRevenueData(mockRevenueData[activeDateRange]);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // This effect is for updating the chart based on the selected date range.
    // In a real-world app, you would likely re-fetch data from the backend
    // with a date range parameter.
    setRevenueData(mockRevenueData[activeDateRange]);
  }, [activeDateRange]);

  if (!isLoaded || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl">
          <h1 className="text-4xl font-bold text-gray-800 animate-pulse">
            Loading Dashboard...
          </h1>
          <p className="mt-4 text-gray-700">
            Please wait while we fetch the latest data.
          </p>
        </div>
      </div>
    );
  }

  const userRole = user?.publicMetadata?.role;

  if (!isSignedIn || userRole !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl">
          <h1 className="text-4xl font-bold text-red-500">Access Denied</h1>
          <p className="mt-4 text-gray-700">
            You do not have permission to view this page. If you believe this is
            an error, please contact support.
          </p>
        </div>
      </div>
    );
  }

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
              <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
                Welcome {user.firstName || user.lastName}
              </h2>
              <div className="flex items-center space-x-2 sm:space-x-4 w-full md:w-auto">
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
                {["Day", "Week", "Month", "Year"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setActiveDateRange(range)}
                    className={`px-3 sm:px-4 py-2 rounded-lg shadow-md text-sm sm:text-base transition ${
                      activeDateRange === range
                        ? "bg-gray-200 text-gray-800"
                        : "bg-white border border-gray-300 text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-md text-sm sm:text-base">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                <span>1 Sep 2024 - 30 Sep 2024</span>
              </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-700 to-gray-800 text-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                <h3 className="text-lg sm:text-xl font-bold">Total Revenue</h3>
                <p className="text-3xl sm:text-4xl">
                  KES{totalRevenue.toLocaleString()}
                </p>
                <p className="text-green-200 text-sm sm:text-base">
                  +0 from last month
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-700 to-gray-900 text-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                <h3 className="text-lg sm:text-xl font-bold">Total Users</h3>
                <p className="text-3xl sm:text-4xl">
                  {totalUsers.toLocaleString()}
                </p>
                <p className="text-green-200 text-sm sm:text-base">
                  +0 from last month
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-700 to-gray-900 text-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                <h3 className="text-lg sm:text-xl font-bold">Freelancers</h3>
                <p className="text-3xl sm:text-4xl">
                  {freelancers.toLocaleString()}
                </p>
                <p className="text-red-200 text-sm sm:text-base">
                  +2.9% from last month
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-700 to-gray-800 text-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                <h3 className="text-lg sm:text-xl font-bold">Total Gigs</h3>
                <p className="text-3xl sm:text-4xl">
                  {totalGigs.toLocaleString()}
                </p>
                <p className="text-green-200 text-sm sm:text-base">
                  +0.9% from last month
                </p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
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
                <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-600">
                  {activeDateRange === "Day" && <span>AM/PM</span>}
                  {activeDateRange === "Week" && (
                    <span>Mon, Tue, Wed, Thu, Fri, Sat, Sun</span>
                  )}
                  {activeDateRange === "Month" && (
                    <span>Jan, Feb, Mar, Apr, May, Jun</span>
                  )}
                  {activeDateRange === "Year" && (
                    <span>
                      Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                  Community Growth
                </h3>
                <div className="relative w-28 h-28 sm:w-32 sm:h-32">
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
                    <span className="text-2xl sm:text-3xl font-bold text-gray-800">
                      {communityGrowth}%
                    </span>
                  </div>
                </div>
                <p className="text-green-600 mt-2 font-semibold text-sm sm:text-base">
                  +0.9% from last month
                </p>
              </div>
            </div>
          </div>
        );
      case "Freelancers":
      case "Clients":
      case "Gigs":
        const data =
          activeTab === "Freelancers"
            ? freelancerList
            : activeTab === "Clients"
            ? clientList
            : gigList;
        const columns =
          activeTab === "Freelancers"
            ? ["Name", "Skills", "Rating", "Gigs Completed"]
            : activeTab === "Clients"
            ? ["Name", "Projects Posted", "Total Spent"]
            : ["Title", "Freelancer", "Price", "Status"];

        return (
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
              {activeTab}
            </h2>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg overflow-x-auto">
              <table className="w-full min-w-[40rem] text-sm sm:text-base">
                <thead className="bg-gray-100">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col}
                        className="p-2 sm:p-3 text-left text-gray-800 font-bold whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item: any, index: number) => (
                    <tr
                      key={item.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-2 sm:p-3">{item.name || item.title}</td>
                      <td className="p-2 sm:p-3">
                        {item.skills || item.projectsPosted || item.freelancer}
                      </td>
                      <td className="p-2 sm:p-3">
                        {item.rating ||
                          `$${item.totalSpent}` ||
                          `$${item.price}`}
                      </td>
                      <td className="p-2 sm:p-3">
                        {item.gigsCompleted || (
                          <span
                            className={`px-2 py-1 rounded-full text-xs sm:text-sm ${
                              item.status === "Active"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        )}
                      </td>
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
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
              Analytics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
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
                <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-600">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                  Revenue by Category
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {analyticsData.revenueByCategory.map((cat) => (
                    <div key={cat.name} className="text-center">
                      <div className="bg-gradient-to-br from-gray-200 to-gray-400 h-20 w-full rounded-lg flex items-center justify-center text-lg sm:text-xl font-bold text-gray-800">
                        {cat.value}%
                      </div>
                      <p className="mt-2 font-semibold text-gray-700 text-sm sm:text-base">
                        {cat.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-Quicksand">
      {/* Mobile Tabs */}
      <div className="md:hidden w-full bg-gray-900 text-white shadow-lg overflow-x-auto">
        <nav className="flex items-center justify-center space-x-2 p-2 min-w-max">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex items-center px-4 py-2 rounded-lg transition text-sm ${
                activeTab === item.name
                  ? "bg-gradient-to-r from-blue-600 to-gray-700 text-white font-bold"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white flex-col shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            MyGigsAfrica
          </h1>
        </div>
        <nav className="flex-1 px-4 py-4 sm:px-6">
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
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;

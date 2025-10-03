'use client';

import React, { useState, useEffect, useCallback } from 'react';

// Use a custom dark blue color from the image for the sidebar and cards
const PRIMARY_NAVY = 'rgb(30, 41, 59)'; // slate-800 equivalent

// Main App component to manage the application state and views
const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Initial page is 'dashboard'
  const [currentPage, setCurrentPage] = useState('dashboard');

  // API base URL
  const API_BASE_URL = 'http://localhost:8000';

  // State for the lists displayed on other pages
  const [freelancersList, setFreelancersList] = useState([]);
  const [gigsList, setGigsList] = useState([]);
  const [transactionsList, setTransactionsList] = useState([]);
  const [usersList, setUsersList] = useState([]); // This will represent "Clients" in the UI
  const [usersError, setUsersError] = useState(null);

  // Define navigation items based on the image structure
  const navItems = [
    { name: 'Dashboard', page: 'dashboard', icon: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l-2-2m2 2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>)
    },
    { name: 'Freelancers', page: 'freelancers', icon: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h2a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h2m4-12h4m-4 4h4m-9-4h.01M5 16h.01" />
      </svg>)
    },
    { name: 'Clients', page: 'clients', icon: (props) => ( // Users map to Clients
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>)
    },
    { name: 'Analytics', page: 'analytics', icon: (props) => ( // Transactions map to Analytics
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.98 9.98 0 0112 2c5.523 0 10 4.477 10 10S17.523 22 12 22 2 17.523 2 12c0-2.38.837-4.57 2.222-6.31" />
      </svg>)
    },
    { name: 'Gigs', page: 'gigs', icon: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 8l-4 4 4 4" />
      </svg>)
    },
  ];

  // --- Deletion Handler (Kept from previous iteration) ---
  const handleDelete = useCallback(async (type, id) => {
    let endpoint;
    let setter;
    let list;
    let idKey;

    switch (type) {
        case 'gig':
            endpoint = `${API_BASE_URL}/core/gigs/${id}/`;
            setter = setGigsList;
            list = gigsList;
            idKey = 'id';
            break;
        case 'freelancer':
            endpoint = `${API_BASE_URL}/core/freelancers/${id}/`;
            setter = setFreelancersList;
            list = freelancersList;
            idKey = 'id';
            break;
        case 'user':
            // Users are filtered by clerk_id
            endpoint = `${API_BASE_URL}/core/clerk-users/${id}/`;
            setter = setUsersList;
            list = usersList;
            idKey = 'clerk_id';
            break;
        default:
            console.error("Unknown item type for deletion:", type);
            return;
    }

    try {
        console.log(`Sending DELETE request for ${type} (ID: ${id}) to: ${endpoint}`);

        const response = await fetch(endpoint, {
            method: 'DELETE',
        });

        if (response.ok || response.status === 204) {
            console.log(`${type} (ID: ${id}) successfully deleted. Updating local state.`);
            setter(list.filter(item => item[idKey] !== id));
        } else {
            const errorText = await response.text();
            console.error(`Deletion failed for ${type} (ID: ${id}). Status: ${response.status}`, errorText);
        }
    } catch (e) {
        console.error(`Network or critical error while deleting ${type} (ID: ${id}):`, e);
    }
  }, [API_BASE_URL, gigsList, freelancersList, usersList]);

  // --- Data Fetching (Kept from previous iteration) ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/core/dashboard-data/`);
        if (!response.ok) throw new Error('Failed to fetch dashboard data.');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (e) {
        console.error("Error fetching dashboard data:", e);
        setError("Failed to fetch dashboard data. Check backend and network.");
      }
    };

    const fetchFreelancers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/core/freelancers/`);
        if (!response.ok) throw new Error('Failed to fetch freelancers list.');
        setFreelancersList(await response.json());
      } catch (e) {
        console.error("Error fetching freelancers:", e);
      }
    };

    const fetchGigs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/core/gigs/`);
        if (!response.ok) throw new Error('Failed to fetch gigs list.');
        setGigsList(await response.json());
      } catch (e) {
        console.error("Error fetching gigs:", e);
      }
    };

    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/core/transactions/`);
        if (!response.ok) throw new Error('Failed to fetch transactions list.');
        setTransactionsList(await response.json());
      } catch (e) {
        console.error("Error fetching transactions:", e);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/core/clerk-users/`);
        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
        }
        setUsersList(await response.json());
      } catch (e) {
        console.error("Error fetching users:", e);
        setUsersError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    fetchFreelancers();
    fetchGigs();
    fetchTransactions();
    fetchUsers();
  }, [API_BASE_URL]);

  // --- Shared Components ---

  const Sidebar = () => (
    <div className="w-64 h-full fixed left-0 top-0 text-white p-6 flex flex-col" style={{ backgroundColor: PRIMARY_NAVY }}>
      {/* Logo */}
      <div className="mb-10 text-2xl font-extrabold tracking-tight">
        MyGigs<span className="text-blue-400">Africa</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow space-y-2">
        {navItems.map((item) => (
          <div
            key={item.page}
            onClick={() => setCurrentPage(item.page)}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-150 ${
              currentPage === item.page
                ? 'bg-blue-600/70 shadow-lg'
                : 'hover:bg-slate-700/50'
            }`}
          >
            {item.icon({ className: 'w-6 h-6 mr-3' })}
            <span className="font-medium">{item.name}</span>
          </div>
        ))}
      </nav>

      {/* User Profile Footer Placeholder */}
      <div className="flex items-center p-3 mt-8">
        <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-lg font-bold mr-3">
          N
        </div>
        <span className="text-sm font-semibold">User Settings</span>
      </div>
    </div>
  );

  const Header = () => (
    <header className="flex justify-between items-center p-6 bg-white border-b border-gray-200">
      <h1 className="text-2xl font-semibold text-gray-800">Welcome Elijah</h1>
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-48 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="w-5 h-5 absolute right-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {/* Notification Icon */}
        <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer relative">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
        </div>
      </div>
    </header>
  );

  // --- Dashboard View Components ---

  const StatCard = ({ title, value, unit = '', percentage = '+0 from last month' }) => {
    // Custom color for the card background to match the image
    const cardStyle = {
      backgroundColor: PRIMARY_NAVY,
    };

    const isPositive = percentage.startsWith('+');

    return (
      <div className="p-6 rounded-2xl shadow-xl transition-transform duration-300 hover:scale-[1.02] cursor-default text-white" style={cardStyle}>
        <h2 className="text-lg font-medium opacity-80 mb-2">{title}</h2>
        <p className="text-4xl font-extrabold mb-1">
          {value} {unit}
        </p>
        <p className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {percentage}
        </p>
      </div>
    );
  };

  const TimeSelector = () => {
    const timeOptions = ['Day', 'Week', 'Month', 'Year'];
    const [activeTab, setActiveTab] = useState('Month');

    return (
      <div className="flex space-x-1 p-1 bg-gray-200 rounded-lg w-max mb-6">
        {timeOptions.map((option) => (
          <button
            key={option}
            onClick={() => setActiveTab(option)}
            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-150 ${
              activeTab === option
                ? 'bg-white shadow text-gray-900'
                : 'text-gray-600 hover:bg-gray-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    );
  };

  const DashboardView = () => (
    <div className="p-8">
      {/* Time Selector and Date Range */}
      <div className="flex justify-between items-center mb-6">
        <TimeSelector />
        <div className="flex items-center p-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white shadow-sm">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h.01M17 11h.01M11 15h.01M17 15h.01M12 21h.01M3 15h.01M15 19H8a2 2 0 01-2-2v-4a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2z" />
          </svg>
          1 Sep 2024 - 30 Sep 2024
        </div>
      </div>

      {/* Key Metrics Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Revenue"
          value={data?.total_revenue?.toLocaleString() || '0'}
          unit="KESO"
          percentage="+0 from last month"
        />
        <StatCard
          title="Total Users"
          value={usersList.length.toLocaleString()}
          percentage={data?.user_growth || '+0 from last month'}
        />
        <StatCard
          title="Freelancers"
          value={freelancersList.length.toLocaleString()}
          percentage={data?.freelancer_growth || '+0 from last month'}
        />
        <StatCard
          title="Total Gigs"
          value={gigsList.length.toLocaleString()}
          percentage={data?.gig_growth || '+0.9% from last month'}
        />
      </section>

      {/* Charts/Content Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Revenue Chart Placeholder (Larger Column) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 min-h-[350px]">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Total Revenue</h2>
          <div className="flex items-center justify-center h-64 text-gray-400">
            {/* Placeholder for the Revenue Chart */}
            [Line/Bar Chart Placeholder]
          </div>
        </div>

        {/* Community Growth Donut Placeholder (Smaller Column) */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 min-h-[350px] flex flex-col items-center">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Community Growth</h2>
          <div className="relative w-40 h-40 flex items-center justify-center mb-4">
            {/* Placeholder for the circular chart */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="10"
                strokeDasharray="283" strokeDashoffset="283" // Total circumference 2*pi*45 ≈ 283
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
              />
            </svg>
            <div className="absolute text-3xl font-extrabold text-gray-800">0%</div>
          </div>
          <p className="text-sm font-semibold text-green-500 mt-2">+0.9% from last month</p>
        </div>
      </section>
    </div>
  );

  // --- List View Components (Refactored to match the overall style) ---

  const ListViewContainer = ({ title, children, backPage = 'dashboard' }) => (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <button
          onClick={() => setCurrentPage(backPage)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md">
          Back to Dashboard
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        {children}
      </div>
    </div>
  );

  const FreelancersListView = () => (
    <ListViewContainer title="All Freelancers">
      <ul className="divide-y divide-gray-200">
        {freelancersList?.map((freelancer) => (
          <li key={freelancer.id} className="py-4 flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4 flex-grow">
              <img
                src={freelancer.profile_image || "https://placehold.co/80x80/D1D5DB/1F2937?text=Profile"}
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/80x80/D1D5DB/1F2937?text=Profile"; }}
                alt={`${freelancer.first_name}'s profile`}
                className="w-20 h-20 object-cover rounded-full border-2 border-blue-400 flex-shrink-0"
              />
              <div className="min-w-0">
                <h3 className="text-xl font-semibold text-gray-900 truncate">
                  {freelancer.first_name} {freelancer.last_name}
                </h3>
                <p className="text-gray-600 text-sm">
                  <span className="font-bold">Profession:</span> {freelancer.profession || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-bold">Country:</span> {freelancer.country || 'N/A'}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDelete('freelancer', freelancer.id)}
              className="bg-red-500 text-white px-3 py-1 rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors duration-200 flex-shrink-0 shadow-md"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </ListViewContainer>
  );

  const GigsListView = () => (
    <ListViewContainer title="All Gigs">
      <ul className="divide-y divide-gray-200">
        {gigsList?.map((gig) => (
          <li key={gig.id} className="py-4 flex items-center justify-between space-x-4">
            <div className="flex space-x-4 flex-grow items-center">
              <img
                src={gig.image || "https://placehold.co/150x100/D1D5DB/1F2937?text=Gig+Image"}
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x100/D1D5DB/1F2937?text=Gig+Image"; }}
                alt={`${gig.title} image`}
                className="w-36 h-24 object-cover rounded-lg border border-gray-300 flex-shrink-0"
              />
              <div className="min-w-0">
                <h3 className="text-xl font-semibold text-gray-900 truncate">{gig.title}</h3>
                <p className="text-gray-600">
                  <span className="font-medium text-lg text-blue-600">${gig.price}</span>
                </p>
                <p className="text-sm text-gray-500 truncate">
                  Location: {gig.location} | Posted: {new Date(gig.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDelete('gig', gig.id)}
              className="bg-red-500 text-white px-3 py-1 rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors duration-200 flex-shrink-0 shadow-md"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </ListViewContainer>
  );

  // ClientsListView is the refactored UsersListView
  const ClientsListView = () => (
    <ListViewContainer title="All Clients">
      {usersError ? (
        <div className="text-center text-red-500 p-4">
          <h2 className="text-xl font-bold">Error fetching clients/users</h2>
          <p className="text-sm">{usersError}</p>
        </div>
      ) : usersList.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {usersList.map((user) => (
            <li key={user.clerk_id} className="py-4 flex items-center justify-between space-x-4">
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-gray-900">{user.first_name} {user.last_name}</h3>
                <p className="text-gray-600">
                  Email: {user.email}
                </p>
                <p className="text-sm text-gray-500">
                  Role: {user.role} | Joined: {new Date(user.created_at).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400">Clerk ID: {user.clerk_id}</p>
              </div>
              <button
                onClick={() => handleDelete('user', user.clerk_id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors duration-200 flex-shrink-0 shadow-md"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500 p-4">
          <p className="text-lg">No clients/users found.</p>
        </div>
      )}
    </ListViewContainer>
  );

  // AnalyticsListView is the refactored TransactionsListView
  const AnalyticsListView = () => (
    <ListViewContainer title="Transaction Analytics (History)">
      <ul className="divide-y divide-gray-200">
        {transactionsList?.map((transaction) => (
          <li key={transaction.mpesa_receipt_number} className="py-4">
            <h3 className="text-xl font-semibold text-gray-900">Receipt: {transaction.mpesa_receipt_number}</h3>
            <p className="text-gray-600">
              <span className="font-medium text-lg text-green-600">Amount: ${transaction.amount}</span>
            </p>
            <p className="text-sm text-gray-500">
              Phone Number: {transaction.phone_number} | Status:  <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold
                          ${transaction.result_code === '0'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {transaction.result_code === '0' ? 'Success' : 'Failed'}
                      </span>
            </p>
            <p className="text-sm text-gray-500">
              Date: {new Date(transaction.transaction_date).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </ListViewContainer>
  );

  // --- Main Render Logic ---

  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardView />;
      case 'freelancers':
        return <FreelancersListView />;
      case 'gigs':
        return <GigsListView />;
      case 'clients': // Mapped to Users data
        return <ClientsListView />;
      case 'analytics': // Mapped to Transactions data
        return <AnalyticsListView />;
      default:
        return <DashboardView />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 p-4">
        <div className="text-center bg-red-100 p-6 rounded-2xl shadow-xl border border-red-200">
          <h1 className="text-2xl font-bold text-red-800">Error</h1>
          <p className="mt-2 text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex">
      <Sidebar />
      <div className="ml-64 flex-grow">
        <Header />
        <main className="container mx-auto max-w-7xl">
          {renderPageContent()}
        </main>
      </div>
    </div>
  );
};

export default App;

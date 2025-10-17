"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

/* ============================
   Styling tokens & helpers
   ============================ */
const PRIMARY_NAVY = "rgb(30, 41, 59)"; // slate-800 equivalent
const ACCENT_BLUE = "#3b82f6";
const ACCENT_INDIGO = "#6366f1";

/* small icon components used in metric cards */
const IconRevenue = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white">
    <path
      strokeWidth="1.6"
      d="M12 8c-3 0-5 1-6 3 1 2 3 3 6 3s5-1 6-3c-1-2-3-3-6-3z"
    />
    <path strokeWidth="1.6" d="M12 2v4M12 18v4M4 12h16" />
  </svg>
);
const IconUsers = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white">
    <path
      strokeWidth="1.6"
      d="M16 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM8 11c1.657 0 3-1.343 3-3S9.657 5 8 5 5 6.343 5 8s1.343 3 3 3z"
    />
    <path strokeWidth="1.6" d="M2 20c0-3 4-5 10-5s10 2 10 5" />
  </svg>
);
const IconFreelancers = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white">
    <path strokeWidth="1.6" d="M12 14c4 0 7 2 7 5v1H5v-1c0-3 3-5 7-5z" />
    <path strokeWidth="1.6" d="M12 10a3 3 0 100-6 3 3 0 000 6z" />
  </svg>
);
const IconGigs = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white">
    <path strokeWidth="1.6" d="M3 7h18M12 3v18" />
  </svg>
);

/* Simple skeleton element */
const Skeleton = ({ className = "" }) => (
  <div
    className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer rounded-lg ${className}`}
  />
);

/* Add a tiny inline style block for shimmer keyframes and minor CSS */
const InlineStyles = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .animate-shimmer { background-size: 200% 100%; animation: shimmer 1.6s linear infinite; }
    .soft-glow { box-shadow: 0 10px 30px rgba(14, 165, 233, 0.08), inset 0 1px 0 rgba(255,255,255,0.02);}
    .card-blur { background: linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.5)); backdrop-filter: blur(6px); }
    .truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    `,
    }}
  />
);

/* ============================
   Your original logic is kept intact
   I will only add UI state & presentation code below
   ============================ */

/* -----------------------
   ORIGINAL APP START
   (kept your logic EXACTLY)
   ----------------------- */

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Initial page is 'dashboard'
  const [currentPage, setCurrentPage] = useState("dashboard");

  // API base URL
  const API_BASE_URL = "http://localhost:8000";

  // State for the lists displayed on other pages
  const [freelancersList, setFreelancersList] = useState([]);
  const [gigsList, setGigsList] = useState([]);
  const [transactionsList, setTransactionsList] = useState([]);
  const [usersList, setUsersList] = useState([]); // This will represent "Clients" in the UI
  const [usersError, setUsersError] = useState(null);

  // Additional states for time filtering and mobile sidebar
  const [period, setPeriod] = useState("Month");
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [endDate, setEndDate] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Define navigation items based on the image structure
  const navItems = [
    {
      name: "Dashboard",
      page: "dashboard",
      icon: (props) => (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l-2-2m2 2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: "Freelancers",
      page: "freelancers",
      icon: (props) => (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h2a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h2m4-12h4m-4 4h4m-9-4h.01M5 16h.01"
          />
        </svg>
      ),
    },
    {
      name: "Clients",
      page: "clients",
      icon: (props) => (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      name: "Analytics",
      page: "analytics",
      icon: (props) => (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 3.055A9.98 9.98 0 0112 2c5.523 0 10 4.477 10 10S17.523 22 12 22 2 17.523 2 12c0-2.38.837-4.57 2.222-6.31"
          />
        </svg>
      ),
    },
    {
      name: "Gigs",
      page: "gigs",
      icon: (props) => (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 20l4-16m4 4l4 4-4 4M6 8l-4 4 4 4"
          />
        </svg>
      ),
    },
  ];

  // --- Deletion Handler (Kept from previous iteration) ---
  const handleDelete = useCallback(
    async (type, id) => {
      let endpoint;
      let setter;
      let list;
      let idKey;

      switch (type) {
        case "gig":
          endpoint = `${API_BASE_URL}/core/gigs/${id}/`;
          setter = setGigsList;
          list = gigsList;
          idKey = "id";
          break;
        case "freelancer":
          endpoint = `${API_BASE_URL}/core/freelancers/${id}/`;
          setter = setFreelancersList;
          list = freelancersList;
          idKey = "id";
          break;
        case "user":
          // Users are filtered by clerk_id
          endpoint = `${API_BASE_URL}/core/clerk-users/${id}/`;
          setter = setUsersList;
          list = usersList;
          idKey = "clerk_id";
          break;
        default:
          console.error("Unknown item type for deletion:", type);
          return;
      }

      try {
        console.log(
          `Sending DELETE request for ${type} (ID: ${id}) to: ${endpoint}`
        );

        const response = await fetch(endpoint, {
          method: "DELETE",
        });

        if (response.ok || response.status === 204) {
          console.log(
            `${type} (ID: ${id}) successfully deleted. Updating local state.`
          );
          setter(list.filter((item) => item[idKey] !== id));
        } else {
          const errorText = await response.text();
          console.error(
            `Deletion failed for ${type} (ID: ${id}). Status: ${response.status}`,
            errorText
          );
        }
      } catch (e) {
        console.error(
          `Network or critical error while deleting ${type} (ID: ${id}):`,
          e
        );
      }
    },
    [API_BASE_URL, gigsList, freelancersList, usersList]
  );

  // --- Data Fetching (Updated to use Promise.all for loading) ---
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/core/dashboard-data/`).then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      }),
      fetch(`${API_BASE_URL}/core/freelancers/`).then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      }),
      fetch(`${API_BASE_URL}/core/gigs/`).then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      }),
      fetch(`${API_BASE_URL}/core/transactions/`).then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      }),
      fetch(`${API_BASE_URL}/core/clerk-users/`).then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      }),
    ])
      .then(([dashboardData, freelancers, gigs, transactions, users]) => {
        setData(dashboardData);
        setFreelancersList(freelancers);
        setGigsList(gigs);
        setTransactionsList(transactions);
        setUsersList(users);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [API_BASE_URL]);

  // Update start and end dates when period changes
  useEffect(() => {
    const now = new Date();
    let start;
    switch (period) {
      case "Day":
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "Week":
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case "Month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "Year":
        start = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        start = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    setStartDate(start);
    setEndDate(now);
  }, [period]);

  // Calculate stats based on current start and end dates
  const calculatedData = useMemo(() => {
    const filterByDate = (item, dateKey) => {
      const itemDate = new Date(item[dateKey]);
      return itemDate >= startDate && itemDate <= endDate;
    };

    const filteredTransactions = transactionsList.filter(
      (t) => filterByDate(t, "transaction_date") && t.result_code === "0"
    );
    const totalRevenue = filteredTransactions.reduce(
      (sum, t) => sum + parseFloat(t.amount || 0),
      0
    );

    const filteredUsers = usersList.filter((u) =>
      filterByDate(u, "created_at")
    );
    const userCount = filteredUsers.length;

    const filteredFreelancers = freelancersList.filter((f) =>
      filterByDate(f, "created_at")
    );
    const freelancerCount = filteredFreelancers.length;

    const filteredGigs = gigsList.filter((g) => filterByDate(g, "created_at"));
    const gigCount = filteredGigs.length;

    // Previous period calculations
    const periodMs = endDate - startDate;
    const previousEnd = new Date(startDate.getTime() - 1);
    const previousStart = new Date(startDate.getTime() - periodMs - 1);

    const filterPrevious = (item, dateKey) => {
      const itemDate = new Date(item[dateKey]);
      return itemDate >= previousStart && itemDate <= previousEnd;
    };

    const previousTransactions = transactionsList.filter(
      (t) => filterPrevious(t, "transaction_date") && t.result_code === "0"
    );
    const previousRevenue = previousTransactions.reduce(
      (sum, t) => sum + parseFloat(t.amount || 0),
      0
    );
    const revenueGrowth =
      previousRevenue > 0
        ? (((totalRevenue - previousRevenue) / previousRevenue) * 100).toFixed(
            1
          )
        : 0;
    const revenuePercentage = `${
      revenueGrowth >= 0 ? "+" : ""
    }${revenueGrowth}% from last period`;

    const previousUsers = usersList.filter((u) =>
      filterPrevious(u, "created_at")
    ).length;
    const userGrowth =
      previousUsers > 0
        ? (((userCount - previousUsers) / previousUsers) * 100).toFixed(1)
        : 0;
    const userPercentage = `${
      userGrowth >= 0 ? "+" : ""
    }${userGrowth}% from last period`;

    const previousFreelancers = freelancersList.filter((f) =>
      filterPrevious(f, "created_at")
    ).length;
    const freelancerGrowth =
      previousFreelancers > 0
        ? (
            ((freelancerCount - previousFreelancers) / previousFreelancers) *
            100
          ).toFixed(1)
        : 0;
    const freelancerPercentage = `${
      freelancerGrowth >= 0 ? "+" : ""
    }${freelancerGrowth}% from last period`;

    const previousGigs = gigsList.filter((g) =>
      filterPrevious(g, "created_at")
    ).length;
    const gigGrowth =
      previousGigs > 0
        ? (((gigCount - previousGigs) / previousGigs) * 100).toFixed(1)
        : 0;
    const gigPercentage = `${
      gigGrowth >= 0 ? "+" : ""
    }${gigGrowth}% from last period`;

    // Community growth: average of user and freelancer growth
    const communityGrowth = (
      (parseFloat(userGrowth) + parseFloat(freelancerGrowth)) /
      2
    ).toFixed(1);
    const communityPercentage = `${
      communityGrowth >= 0 ? "+" : ""
    }${communityGrowth}% from last period`;

    // Revenue data for chart
    const revenueData = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().slice(0, 10);
      const dailyRevenue = transactionsList
        .filter(
          (t) =>
            new Date(t.transaction_date).toISOString().slice(0, 10) ===
              dateStr && t.result_code === "0"
        )
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
      revenueData.push({ date: dateStr, revenue: dailyRevenue });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      totalRevenue,
      revenuePercentage,
      userCount,
      userPercentage,
      freelancerCount,
      freelancerPercentage,
      gigCount,
      gigPercentage,
      communityGrowth: parseFloat(communityGrowth),
      communityPercentage,
      revenueData,
    };
  }, [
    startDate,
    endDate,
    transactionsList,
    usersList,
    freelancersList,
    gigsList,
  ]);

  /* -----------------------
     END original logic block
     ----------------------- */

  /* =========================
     UI-only state & helpers
     (safe to change — does NOT modify logic)
     ========================= */

  // profile dropdown and small UI states
  const [profileOpen, setProfileOpen] = useState(false);
  // delete confirm modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState({ type: null, id: null, label: "" });
  // applications modal (fetching real endpoints is handled elsewhere; this modal just displays)
  const [appsModalOpen, setAppsModalOpen] = useState(false);
  const [allApplications, setAllApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);

  // pagination state for listing pages (client-side)
  const [pageSizes] = useState({ list: 10 }); // can change later
  const [page, setPage] = useState(1);

  // compact view toggles
  const [compactCards, setCompactCards] = useState(false);

  /* UI helper: open confirm delete */
  const openConfirmDelete = (type, id, label) => {
    setToDelete({ type, id, label });
    setConfirmOpen(true);
  };

  /* UI helper: handle confirming delete -> call your existing logic */
  const confirmDelete = async () => {
    if (!toDelete.type || !toDelete.id) {
      setConfirmOpen(false);
      return;
    }
    await handleDelete(toDelete.type, toDelete.id); // uses your logic
    setConfirmOpen(false);
    setToDelete({ type: null, id: null, label: "" });
  };

  /* Applications modal UI — will call your endpoints (no simulation) */
  const openApplicationsModal = async () => {
    setAppsModalOpen(true);
    setAppsLoading(true);
    try {
      // Try to aggregate from gigsList if embedded
      const gigsWithApps = gigsList.filter(
        (g) => Array.isArray(g.applications) && g.applications.length
      );
      let aggregated = [];
      if (gigsWithApps.length === gigsList.length && gigsWithApps.length > 0) {
        aggregated = gigsList.flatMap((g) =>
          g.applications.map((a) => ({ ...a, gigTitle: g.title, gigId: g.id }))
        );
      } else {
        // fetch per-gig apps in parallel, using your API_BASE_URL (no auth changes)
        const requests = gigsList.map((g) =>
          fetch(`${API_BASE_URL}/core/gigs/${g.id}/applications/`)
            .then((r) => (r.ok ? r.json() : []))
            .then((arr) =>
              Array.isArray(arr)
                ? arr.map((a) => ({ ...a, gigTitle: g.title, gigId: g.id }))
                : []
            )
            .catch((e) => {
              console.warn("Failed to fetch apps for gig", g.id, e);
              return [];
            })
        );
        const results = await Promise.all(requests);
        aggregated = results.flat();
      }

      const normalized = aggregated.map((a) => ({
        id: a.id || `${a.user_id || "u"}-${a.created_at || Date.now()}`,
        applicant_name: a.applicant_name || a.name || a.user_name || "Unknown",
        applicant_email: a.email || a.applicant_email || a.user_email || "N/A",
        cover_letter: a.cover_letter || a.message || a.note || "",
        date_applied:
          a.created_at ||
          a.date_applied ||
          a.submitted_at ||
          new Date().toISOString(),
        status: a.status || "pending",
        gigTitle: a.gigTitle || "Unknown Gig",
        raw: a,
      }));
      normalized.sort(
        (x, y) => new Date(y.date_applied) - new Date(x.date_applied)
      );
      setAllApplications(normalized);
    } catch (e) {
      console.error("Error fetching applications:", e);
      setAllApplications([]);
    } finally {
      setAppsLoading(false);
    }
  };

  // accessibility: close modals with Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        if (confirmOpen) setConfirmOpen(false);
        if (appsModalOpen) setAppsModalOpen(false);
        if (profileOpen) setProfileOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [confirmOpen, appsModalOpen, profileOpen]);

  /* Sidebar (polished) */
  const Sidebar = () => (
    <aside
      className={`w-65 md:w-64 lg:w-64 h-full fixed left-0 top-30 text-white p-4 flex flex-col z-40 transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
      aria-label="Main navigation"
    >
      {/* Mobile close */}
      <div className="md:hidden flex justify-end mb-4">
        <button
          className="text-white"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          ✕
        </button>
      </div>

      <nav className="flex-grow space-y-2">
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => {
              setCurrentPage(item.page);
              setSidebarOpen(false);
            }}
            className={`w-full text-left flex items-center gap-3 py-3 px-3 rounded-lg transition-all duration-150 ${
              currentPage === item.page
                ? "bg-gradient-to-r from-blue-600/80 to-indigo-600/70 shadow-lg transform scale-[1.01]"
                : "hover:bg-white/5"
            }`}
            aria-current={currentPage === item.page}
          >
            <div className="text-black opacity-95">
              {item.icon({ className: "w-5 h-5" })}
            </div>
            <span className="text-sm font-medium text-black">{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="mt-8">
        <div className="flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-white/5 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-black">
            N
          </div>
          <div>
            <div className="text-sm font-semibold">Elijah</div>
            <div className="text-xs text-blue-200">Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );

  /* Header (polished) */
  const Header = () => {
    const [searchFocused, setSearchFocused] = useState(false);

    return (
      <header className="flex justify-between items-center p-6 bg-white/70 backdrop-blur sticky top-0 z-30 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 rounded-md bg-white shadow"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div>
            <div className="text-sm text-gray-500">Welcome back,</div>
            <div className="text-lg font-bold text-gray-800">Elijah</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen((s) => !s)}
              className="flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-white shadow-sm"
              aria-haspopup="true"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                E
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-semibold text-gray-800">
                  Elijah
                </div>
                <div className="text-xs text-gray-500">Admin</div>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50">
                  Settings
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50">
                  Profile
                </button>
                <div className="border-t my-1" />
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  };

  /* StatCard — polished design */
  const StatCard = ({
    title,
    value,
    unit = "",
    percentage = "+0 from last period",
    onClick,
  }) => {
    const isPositive = String(percentage).startsWith("+");
    const accent = title.includes("Revenue")
      ? "from-blue-500 to-indigo-600"
      : title.includes("Users")
      ? "from-green-400 to-teal-400"
      : title.includes("Freelancers")
      ? "from-purple-500 to-indigo-500"
      : "from-yellow-400 to-orange-400";

    return (
      <div
        onClick={onClick}
        role={onClick ? "button" : undefined}
        className={`p-6 rounded-2xl soft-glow card-blur border border-white/20 transition-transform transform hover:-translate-y-1 ${
          onClick ? "cursor-pointer" : ""
        }`}
        style={{ minHeight: 140 }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-gray-700 mb-1">{title}</div>
            <div className="text-3xl font-extrabold text-black">
              {value} {unit}
            </div>
            <div
              className={`mt-2 text-sm font-medium ${
                isPositive ? "text-green-300" : "text-red-300"
              }`}
            >
              {percentage}
            </div>
          </div>
          <div
            className={`rounded-lg p-3 bg-gradient-to-tr ${accent} shadow-lg`}
          >
            {title.includes("Revenue") ? (
              <IconRevenue />
            ) : title.includes("Users") ? (
              <IconUsers />
            ) : title.includes("Freelancers") ? (
              <IconFreelancers />
            ) : (
              <IconGigs />
            )}
          </div>
        </div>

        {/* subtle progress bar */}
        <div className="mt-4">
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-2 bg-gradient-to-r from-white/50 to-white/30"
              style={{
                width: `${Math.min(
                  100,
                  (Number(String(value).replace(/,/g, "")) /
                    (Number(String(value).replace(/,/g, "")) + 100)) *
                    100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  /* Dashboard view (polish + responsiveness) */
  const TimeSelector = () => {
    const timeOptions = ["Day", "Week", "Month", "Year"];
    return (
      <div className="flex space-x-1 p-1 bg-white/90 rounded-lg w-max shadow-sm">
        {timeOptions.map((o) => (
          <button
            key={o}
            onClick={() => setPeriod(o)}
            className={`px-3 py-1 text-sm font-semibold rounded-md ${
              period === o
                ? "bg-gradient-to-tr from-blue-500 to-indigo-500 text-white shadow"
                : "text-gray-700"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    );
  };

  const DashboardView = () => (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <TimeSelector />
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg text-sm bg-white shadow-sm">
            <input
              type="date"
              value={startDate.toISOString().slice(0, 10)}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="border-none focus:outline-none bg-transparent"
            />
            <span>-</span>
            <input
              type="date"
              value={endDate.toISOString().slice(0, 10)}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="border-none focus:outline-none bg-transparent"
            />
          </div>

          <button
            className="px-4 py-2 rounded-full bg-white shadow hover:bg-gray-50"
            onClick={() => setCompactCards((s) => !s)}
          >
            {compactCards ? "Comfort view" : "Compact view"}
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Revenue"
          value={calculatedData.totalRevenue.toLocaleString()}
          unit="KES"
          percentage={calculatedData.revenuePercentage}
        />
        <StatCard
          title="Total Users"
          value={calculatedData.userCount.toLocaleString()}
          percentage={calculatedData.userPercentage}
        />
        <StatCard
          title="Freelancers"
          value={calculatedData.freelancerCount.toLocaleString()}
          percentage={calculatedData.freelancerPercentage}
        />
        <StatCard
          title="Total Gigs"
          value={calculatedData.gigCount.toLocaleString()}
          percentage={calculatedData.gigPercentage}
          onClick={() => {
            /* left as UI hook, does not change logic */
          }}
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 min-h-[360px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Total Revenue</h2>
            <div className="text-sm text-gray-500">
              {calculatedData.revenueData.length} points
            </div>
          </div>

          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={calculatedData.revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => v.toLocaleString()} />
                <Tooltip
                  formatter={(value) => `${value.toLocaleString()} KES`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={ACCENT_BLUE}
                  strokeWidth={3}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 min-h-[360px] flex flex-col items-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Community Growth
          </h2>
          <div className="relative w-40 h-40 mb-4">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={
                  calculatedData.communityGrowth >= 0 ? ACCENT_BLUE : "#ef4444"
                }
                strokeWidth="10"
                strokeDasharray="283"
                strokeDashoffset={
                  283 -
                  (Math.min(Math.abs(calculatedData.communityGrowth), 100) /
                    100) *
                    283
                }
                style={{
                  transform: "rotate(-90deg)",
                  transformOrigin: "50% 50%",
                  transition: "stroke-dashoffset 0.8s ease",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`text-3xl font-extrabold ${
                  calculatedData.communityGrowth >= 0
                    ? "text-gray-800"
                    : "text-red-600"
                }`}
              >
                {calculatedData.communityGrowth}%
              </div>
            </div>
          </div>
          <div
            className={`text-sm font-semibold ${
              calculatedData.communityGrowth >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {calculatedData.communityPercentage}
          </div>
        </div>
      </section>
    </div>
  );

  /* List page container (polished) */
  const ListViewContainer = ({ title, children, backPage = "dashboard" }) => (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage(backPage)}
            className="bg-white px-4 py-2 rounded-full shadow hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        {children}
      </div>
    </div>
  );

  /* Helper for paginating array (client-side) */
  const paginate = (arr, page, perPage) => {
    const start = (page - 1) * perPage;
    return arr.slice(start, start + perPage);
  };

  const FreelancersListView = () => {
    const perPage = pageSizes.list;
    const pages = Math.max(
      1,
      Math.ceil((freelancersList || []).length / perPage)
    );
    const pageItems = paginate(freelancersList || [], page, perPage);

    return (
      <ListViewContainer title="All Freelancers">
        <ul className="divide-y divide-gray-200">
          {pageItems?.map((freelancer) => (
            <li
              key={freelancer.id}
              className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <div className="flex items-center space-x-4 flex-grow">
                <img
                  src={
                    freelancer.profile_image ||
                    "https://placehold.co/80x80/D1D5DB/1F2937?text=Profile"
                  }
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/80x80/D1D5DB/1F2937?text=Profile";
                  }}
                  alt={`${freelancer.first_name}'s profile`}
                  className="w-20 h-20 object-cover rounded-full border-2 border-blue-400 flex-shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold text-gray-900 truncate">
                    {freelancer.first_name} {freelancer.last_name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    <span className="font-bold">Profession:</span>{" "}
                    {freelancer.profession || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-bold">Country:</span>{" "}
                    {freelancer.country || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    openConfirmDelete(
                      "freelancer",
                      freelancer.id,
                      `${freelancer.first_name} ${freelancer.last_name}`
                    )
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {(page - 1) * perPage + 1} -{" "}
            {Math.min(page * perPage, freelancersList.length)} of{" "}
            {freelancersList.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 bg-white rounded shadow"
            >
              Prev
            </button>
            <div className="px-3 py-1 text-sm">
              Page {page} / {pages}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              className="px-3 py-1 bg-white rounded shadow"
            >
              Next
            </button>
          </div>
        </div>
      </ListViewContainer>
    );
  };

  const GigsListView = () => {
    const perPage = pageSizes.list;
    const pages = Math.max(1, Math.ceil((gigsList || []).length / perPage));
    const pageItems = paginate(gigsList || [], page, perPage);

    return (
      <ListViewContainer title="All Gigs">
        <ul className="divide-y divide-gray-200">
          {pageItems?.map((gig) => (
            <li
              key={gig.id}
              className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <div className="flex space-x-4 flex-grow items-center">
                <img
                  src={
                    gig.image ||
                    "https://placehold.co/150x100/D1D5DB/1F2937?text=Gig+Image"
                  }
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/150x100/D1D5DB/1F2937?text=Gig+Image";
                  }}
                  alt={`${gig.title} image`}
                  className="w-36 h-24 object-cover rounded-lg border border-gray-300 flex-shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold text-gray-900 truncate">
                    {gig.title}
                  </h3>
                  <p className="text-gray-600">
                    <span className="font-medium text-lg text-blue-600">
                      ${gig.price}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    Location: {gig.location} | Posted:{" "}
                    {new Date(gig.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openApplicationsModal()}
                  className="px-3 py-1 bg-indigo-600 text-white rounded"
                >
                  Applications
                </button>
                <button
                  onClick={() => openConfirmDelete("gig", gig.id, gig.title)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {(page - 1) * perPage + 1} -{" "}
            {Math.min(page * perPage, gigsList.length)} of {gigsList.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 bg-white rounded shadow"
            >
              Prev
            </button>
            <div className="px-3 py-1 text-sm">
              Page {page} / {Math.max(1, Math.ceil(gigsList.length / perPage))}
            </div>
            <button
              onClick={() =>
                setPage((p) =>
                  Math.min(Math.ceil(gigsList.length / perPage), p + 1)
                )
              }
              className="px-3 py-1 bg-white rounded shadow"
            >
              Next
            </button>
          </div>
        </div>
      </ListViewContainer>
    );
  };

  const ClientsListView = () => {
    const perPage = pageSizes.list;
    const pages = Math.max(1, Math.ceil((usersList || []).length / perPage));
    const pageItems = paginate(usersList || [], page, perPage);

    return (
      <ListViewContainer title="All Clients">
        {usersError ? (
          <div className="text-center text-red-500 p-4">
            <h2 className="text-xl font-bold">Error fetching clients/users</h2>
            <p className="text-sm">{usersError}</p>
          </div>
        ) : usersList.length > 0 ? (
          <>
            <ul className="divide-y divide-gray-200">
              {pageItems.map((user) => (
                <li
                  key={user.clerk_id}
                  className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4"
                >
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-gray-600">Email: {user.email}</p>
                    <p className="text-sm text-gray-500">
                      Role: {user.role} | Joined:{" "}
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      Clerk ID: {user.clerk_id}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        openConfirmDelete(
                          "user",
                          user.clerk_id,
                          `${user.first_name} ${user.last_name}`
                        )
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* pagination */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {(page - 1) * perPage + 1} -{" "}
                {Math.min(page * perPage, usersList.length)} of{" "}
                {usersList.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 bg-white rounded shadow"
                >
                  Prev
                </button>
                <div className="px-3 py-1 text-sm">
                  Page {page} / {pages}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  className="px-3 py-1 bg-white rounded shadow"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 p-4">
            <p className="text-lg">No clients/users found.</p>
          </div>
        )}
      </ListViewContainer>
    );
  };

  const AnalyticsListView = () => (
    <ListViewContainer title="Transaction Analytics (History)">
      <ul className="divide-y divide-gray-200">
        {transactionsList?.map((transaction) => (
          <li key={transaction.mpesa_receipt_number} className="py-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Receipt: {transaction.mpesa_receipt_number}
            </h3>
            <p className="text-gray-600">
              <span className="font-medium text-lg text-green-600">
                Amount: ${transaction.amount}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Phone Number: {transaction.phone_number} | Status:{" "}
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  transaction.result_code === "0"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {transaction.result_code === "0" ? "Success" : "Failed"}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Date:{" "}
              {new Date(transaction.transaction_date).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </ListViewContainer>
  );

  const renderPageContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardView />;
      case "freelancers":
        return <FreelancersListView />;
      case "gigs":
        return <GigsListView />;
      case "clients": // Mapped to Users data
        return <ClientsListView />;
      case "analytics": // Mapped to Transactions data
        return <AnalyticsListView />;
      default:
        return <DashboardView />;
    }
  };

  /* Loading & error UI preserved but polished */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="text-center p-6 bg-white/80 rounded-2xl shadow-xl border border-gray-100">
          <svg
            className="animate-spin h-12 w-12 text-blue-500 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-gray-800">
            Loading dashboard...
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Fetching latest data from your backend
          </p>
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

  /* Applications modal (polished) */
  const ApplicationsModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setAppsModalOpen(false)}
      />
      <div className="relative w-full max-w-4xl mx-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[85vh]">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Applications</h3>
              <div className="text-sm text-gray-500">
                {allApplications.length} applications
              </div>
            </div>
            <div>
              <button
                onClick={() => setAppsModalOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>

          <div className="p-6 overflow-auto">
            {appsLoading ? (
              <div className="flex items-center gap-3">
                <svg
                  className="animate-spin w-5 h-5 text-gray-500"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                </svg>
                <div className="text-gray-500">Loading applications...</div>
              </div>
            ) : allApplications.length === 0 ? (
              <div className="text-gray-500">No applications found.</div>
            ) : (
              <ul className="space-y-3">
                {allApplications.map((a) => (
                  <li
                    key={a.id}
                    className="p-4 border rounded-lg bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-gray-800">
                          {a.applicant_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          • {a.applicant_email}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1 truncate-2">
                        {a.cover_letter || "No cover letter provided."}
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        Applied for{" "}
                        <span className="font-medium text-gray-600">
                          {a.gigTitle}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-2">
                      <div
                        className={`text-sm px-3 py-1 rounded-full ${
                          a.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : a.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {a.status || "pending"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(a.date_applied).toLocaleString()}
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button className="px-3 py-1 rounded-md bg-green-50 text-green-700 text-sm">
                          Accept
                        </button>
                        <button className="px-3 py-1 rounded-md bg-red-50 text-red-700 text-sm">
                          Decline
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              onClick={() => setAppsModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /* Confirm delete modal */
  const ConfirmDeleteModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={() => setConfirmOpen(false)}
      />
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Confirm Delete
          </h3>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{toDelete.label}</span>? This action
            cannot be undone.
          </p>
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={() => setConfirmOpen(false)}
              className="px-4 py-2 rounded-lg bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={() => confirmDelete()}
              className="px-4 py-2 rounded-lg bg-red-600 text-white"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /* Final render */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 text-gray-900 antialiased">
      <InlineStyles />
      <div className="flex relative">
        <Sidebar />

        {/* mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-grow md:ml-72 min-h-screen">
          <Header />
          <main className="container mx-auto max-w-7xl px-4 md:px-0 py-6">
            {renderPageContent()}
          </main>
        </div>
      </div>

      {/* modals */}
      {appsModalOpen && <ApplicationsModal />}
      {confirmOpen && <ConfirmDeleteModal />}
    </div>
  );
};

export default App;

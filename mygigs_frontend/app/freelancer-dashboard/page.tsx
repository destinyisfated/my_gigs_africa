"use client";

import { useState, useEffect, useMemo } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import {
  Briefcase,
  Users,
  Clock,
  Handshake,
  X,
  DollarSign,
  Calendar,
  FileText,
  Mail,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const shimmerClass =
  "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer rounded-lg";
const Skeleton = ({ className = "" }) => (
  <div className={`${shimmerClass} ${className}`} />
);

function useAnimatedNumber(value, speed = 800) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const from = display;
    const to = Number(value) || 0;
    const diff = to - from;
    if (diff === 0) return;
    let raf = null;
    const step = (ts) => {
      const elapsed = ts - start;
      const t = Math.min(1, elapsed / speed);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + diff * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return display;
}

/* Metric card (clickable optional) */
const MetricCard = ({
  icon,
  label,
  value,
  accentClass = "bg-blue-600",
  onClick,
}) => {
  const animated = useAnimatedNumber(value, 900);
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-start gap-3 p-4 rounded-2xl border border-gray-100 bg-white/60 backdrop-blur-md shadow-sm hover:shadow-lg transition-all ${
        onClick ? "cursor-pointer" : ""
      }`}
      aria-pressed="false"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${accentClass} text-white`}
          >
            {icon}
          </div>
          <div>
            <div className="text-sm text-gray-500">{label}</div>
            <div className="text-2xl font-bold text-gray-800">{animated}</div>
          </div>
        </div>
        {onClick && <div className="text-xs text-blue-500">View</div>}
      </div>
      <div className="w-full">
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-2 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full"
            style={{ width: `${Math.min(100, (value || 0) * 2)}%` }}
          />
        </div>
      </div>
    </button>
  );
};

/* ---------- Dashboard component ---------- */

export default function Dashboard() {
  const { user } = useUser();
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [data, setData] = useState({ gigs: [], totalGigs: 0 });
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("gigs");
  const [selectedGig, setSelectedGig] = useState(null);

  // Applications modal state
  const [appsModalOpen, setAppsModalOpen] = useState(false);
  const [allApplications, setAllApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);

  /* Derived stats */
  const totalApplications = useMemo(
    () =>
      data.gigs.reduce(
        (acc, g) => acc + (Number(g.applications_count) || 0),
        0
      ),
    [data.gigs]
  );
  const activeGigs = useMemo(
    () =>
      data.gigs.filter((g) => (g.status || "active").toLowerCase() === "active")
        .length,
    [data.gigs]
  );

  /* Fetch gigs */
  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !isSignedIn || !user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const token = await getToken({ template: "default" });
        const res = await fetch("http://localhost:8000/core/gigs/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          if (res.status === 401)
            console.error("401 Unauthorized: check Clerk auth.");
          throw new Error(`Failed to fetch gigs: ${res.statusText}`);
        }
        const gigs = await res.json();
        setData({ gigs, totalGigs: gigs.length });
      } catch (err) {
        console.error("Error fetching gigs:", err);
        setData({ gigs: [], totalGigs: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, isLoaded, isSignedIn, getToken]);

  const openAllApplications = async () => {
    setAppsModalOpen(true);
    setAppsLoading(true);
    try {
      const token = await getToken({ template: "default" });

      // If gigs payload includes embedded applications for each gig, use them:
      const gigsWithApps = data.gigs.filter(
        (g) => Array.isArray(g.applications) && g.applications.length > 0
      );
      let aggregated = [];
      if (gigsWithApps.length === data.gigs.length && gigsWithApps.length > 0) {
        // every gig has .applications
        aggregated = data.gigs.flatMap((g) =>
          g.applications.map((a) => ({ ...a, gigTitle: g.title, gigId: g.id }))
        );
      } else {
        // fetch per-gig applications in parallel (adjust endpoint as needed)
        const requests = data.gigs.map((g) =>
          fetch(`http://localhost:8000/core/gigs/${g.id}/applications/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then(async (r) => (r.ok ? r.json() : []))
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

      // normalize: ensure date fields exist
      const normalized = aggregated.map((a) => ({
        id:
          a.id ||
          `${a.user_id || "u"}-${a.created_at || a.date_applied || Date.now()}`,
        applicant_name:
          a.applicant_name || a.name || a.user_name || a.user || "Unknown",
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

      // sort by date desc
      normalized.sort(
        (x, y) => new Date(y.date_applied) - new Date(x.date_applied)
      );
      setAllApplications(normalized);
    } catch (err) {
      console.error("Error aggregating applications:", err);
      setAllApplications([]);
    } finally {
      setAppsLoading(false);
    }
  };

  /* Render a gig card (keeps your visual style) */
  const renderGigCard = (gig, index) => (
    <motion.div
      key={gig.id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group p-5 rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
        {gig.title}
      </h3>

      <p className="text-sm text-gray-600 mt-1 truncate">
        {gig.description ? gig.description : "No description available."}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-500" />
          {new Date(
            gig.created_at || gig.date_posted || Date.now()
          ).toLocaleDateString()}
        </span>

        <span className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-blue-500" />
          Ksh.{gig.price || "N/A"}
        </span>

        <span className="flex items-center gap-2 ml-auto text-xs text-gray-500">
          {String(gig.status || "Active").toUpperCase()}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => setSelectedGig(gig)}
          className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
        >
          View Details
        </button>
      </div>

      {/* footer small line */}
      <div className="mt-3 border-t pt-3 text-sm text-gray-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-green-500" />
          {gig.applications_count || 0} applications
        </div>
      </div>
    </motion.div>
  );

  /* Skeleton for loading */
  const renderSkeletons = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-gray-200 bg-white/60 backdrop-blur-md"
          >
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3 mb-2" />
            <div className="mt-4 flex gap-3">
              <Skeleton className="h-9 w-1/2 rounded-lg" />
              <Skeleton className="h-9 w-1/2 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* Applications modal content */
  const ApplicationsModal = () => (
    <AnimatePresence>
      {appsModalOpen && (
        <motion.div
          key="apps-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setAppsModalOpen(false)}
          />

          <motion.div
            key="apps-modal"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            className="relative w-full max-w-3xl mx-4"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[88vh]">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 p-3">
                    <Users className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      All Applications
                    </h3>
                    <div className="text-sm text-gray-500">
                      {allApplications.length} application(s)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAppsModalOpen(false)}
                    className="p-2 rounded-md hover:bg-gray-100"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-auto">
                {appsLoading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin w-5 h-5 text-gray-500" />
                    <div className="text-gray-500">Loading applications...</div>
                  </div>
                ) : allApplications.length === 0 ? (
                  <div className="text-gray-500">No applications found.</div>
                ) : (
                  <ul className="space-y-3">
                    {allApplications.map((a) => (
                      <li key={a.id} className="p-4 border rounded-lg bg-white">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="font-semibold text-gray-800">
                                {a.applicant_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                • {a.applicant_email}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 mt-1 line-clamp-3">
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  /* Single-gig modal (keeps previous modal UI) */
  const GigModal = () => (
    <AnimatePresence>
      {selectedGig && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedGig(null)}
          />
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.995 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.995 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="relative w-full max-w-2xl mx-4"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {selectedGig.title}
                    </h3>
                    <div className="text-sm text-gray-500">
                      Posted{" "}
                      {new Date(selectedGig.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => setSelectedGig(null)}
                      className="p-2 rounded-md hover:bg-gray-100"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/60 backdrop-blur-md border border-gray-100 rounded-xl p-4">
                    <div className="text-sm text-gray-500">Budget</div>
                    <div className="font-semibold text-gray-800">
                      Ksh.{selectedGig.price || "N/A"}
                    </div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-md border border-gray-100 rounded-xl p-4">
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="font-semibold text-gray-800">
                      {selectedGig.status || "Active"}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="text-sm text-gray-500 mb-2">Description</div>
                  <div className="text-gray-700 leading-relaxed">
                    {selectedGig.description || "No description."}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  /* Responsive grid: single column on small screens, multi on large */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 text-gray-900 antialiased">
      {/* Header (keeps your header style) */}
      <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-2">
              <Handshake className="text-white w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Welcome back,</div>
              <div className="text-lg font-bold text-gray-800">
                {user ? user.firstName : "User"}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="px-3 py-2 bg-white rounded-full border border-gray-100 text-sm text-gray-600">
              Your Analytics
            </div>
            <div className="px-3 py-2 bg-white rounded-full border border-gray-100 text-sm text-gray-700">
              {data.totalGigs} gigs
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {/* top metric row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <MetricCard
            icon={<Briefcase />}
            label="Total Gigs"
            value={data.totalGigs}
            accentClass="bg-blue-600"
          />
          <MetricCard
            icon={<Users />}
            label="Total Applications"
            value={totalApplications}
            accentClass="bg-green-600"
            onClick={openAllApplications}
          />
        </div>

        {/* content area */}
        <div className="grid grid-cols-1 gap-8">
          {loading ? (
            renderSkeletons()
          ) : data.gigs.length === 0 ? (
            <div className="p-8 bg-white/60 border border-dashed border-gray-200 rounded-2xl text-center text-gray-500">
              No gigs found. Use the Post Gig action to create one.
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {data.gigs.map((g, i) => renderGigCard(g, i))}
            </motion.div>
          )}
        </div>
      </main>

      {/* Applications modal */}
      {appsModalOpen && <ApplicationsModal />}

      {/* Gig details modal */}
      {selectedGig && <GigModal />}
    </div>
  );
}

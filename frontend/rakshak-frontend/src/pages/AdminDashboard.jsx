import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaExclamationTriangle,
  FaFileAlt,
  FaHospital,
  FaShieldAlt,
  FaSpinner,
  FaUserFriends,
  FaUsers,
  FaVenus,
} from "react-icons/fa";

import { getAdminDashboard } from "../services/adminService";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminDashboard();

      setDashboard(data);
    } catch (requestError) {
      console.error("Admin dashboard error:", requestError);

      setError(
        requestError.response?.data?.message ||
          "Admin dashboard load nahi ho paaya."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not available";
    }

    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateValue));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <FaSpinner className="mx-auto animate-spin text-5xl text-blue-400" />

          <p className="mt-4 text-slate-400">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="w-full max-w-xl rounded-3xl border border-red-500/30 bg-red-950/20 p-8 text-center">
          <FaExclamationTriangle className="mx-auto text-5xl text-red-400" />

          <h1 className="mt-5 text-2xl font-bold">
            Admin Dashboard Error
          </h1>

          <p className="mt-3 text-red-300">{error}</p>

          <button
            type="button"
            onClick={loadDashboard}
            className="mt-6 rounded-xl bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboard?.stats;

  const statCards = [
    {
      title: "Total Users",
      value: stats?.users?.total || 0,
      description: `${stats?.users?.police || 0} police accounts`,
      icon: <FaUsers className="text-3xl text-blue-400" />,
    },
    {
      title: "Active Emergencies",
      value: stats?.emergencies?.active || 0,
      description: `${stats?.emergencies?.total || 0} total records`,
      icon: <FaShieldAlt className="text-3xl text-red-400" />,
    },
    {
      title: "FIR Records",
      value: stats?.firs?.total || 0,
      description: `${stats?.firs?.underReview || 0} under review`,
      icon: <FaFileAlt className="text-3xl text-cyan-400" />,
    },
    {
      title: "Women Safety",
      value: stats?.womenSafety?.active || 0,
      description: `${stats?.womenSafety?.total || 0} total sessions`,
      icon: <FaVenus className="text-3xl text-pink-400" />,
    },
    {
      title: "Hospital Accounts",
      value: stats?.users?.hospital || 0,
      description: "Registered hospital roles",
      icon: <FaHospital className="text-3xl text-green-400" />,
    },
    {
      title: "Emergency Contacts",
      value: stats?.emergencyContacts || 0,
      description: "Saved trusted contacts",
      icon: <FaUserFriends className="text-3xl text-purple-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border border-blue-500/20 bg-gradient-to-r from-slate-900 via-blue-950/30 to-slate-900 p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Rakshak India Administration
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Admin Control Center
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-slate-300">
            Monitor users, emergency activity, FIR complaint records and
            Women Safety sessions from one secure administrative dashboard.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
  <Link
    to="/admin/users"
    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
  >
    <FaUsers />
    Manage Users
  </Link>

  <Link
    to="/admin/emergencies"
    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
  >
    <FaShieldAlt />
    Manage Emergencies
  </Link>
</div>
          
        </section>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">
                    {card.title}
                  </p>

                  <p className="mt-3 text-4xl font-black text-white">
                    {card.value}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-950 p-4">
                  {card.icon}
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-500">
                {card.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-2">
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <FaShieldAlt className="text-2xl text-red-400" />

              <h2 className="text-2xl font-bold">
                Recent Emergencies
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              {dashboard?.recentEmergencies?.length ? (
                dashboard.recentEmergencies.map((emergency) => (
                  <article
                    key={emergency.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-white">
                          {emergency.user?.fullName ||
                            "Unknown User"}
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                          {emergency.type || "SOS Emergency"}
                        </p>
                      </div>

                      <span className="rounded-full border border-red-500/30 bg-red-950/30 px-3 py-1 text-xs font-semibold capitalize text-red-300">
                        {emergency.status}
                      </span>
                    </div>

                    <p className="mt-4 text-sm text-slate-500">
                      {formatDate(emergency.createdAt)}
                    </p>
                  </article>
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-500">
                  No emergency records found.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <FaFileAlt className="text-2xl text-cyan-400" />

              <h2 className="text-2xl font-bold">
                Recent FIR Records
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              {dashboard?.recentFIRs?.length ? (
                dashboard.recentFIRs.map((fir) => (
                  <article
                    key={fir.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-white">
                          {fir.complaintTitle}
                        </h3>

                        <p className="mt-1 break-all text-sm font-semibold text-cyan-400">
                          {fir.referenceNumber}
                        </p>

                        <p className="mt-2 text-sm text-slate-400">
                          {fir.user?.fullName || "Unknown User"}
                        </p>
                      </div>

                      <span className="rounded-full border border-cyan-500/30 bg-cyan-950/30 px-3 py-1 text-xs font-semibold capitalize text-cyan-300">
                        {fir.status?.replace("-", " ")}
                      </span>
                    </div>

                    <p className="mt-4 text-sm text-slate-500">
                      {formatDate(fir.createdAt)}
                    </p>
                  </article>
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-500">
                  No FIR records found.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
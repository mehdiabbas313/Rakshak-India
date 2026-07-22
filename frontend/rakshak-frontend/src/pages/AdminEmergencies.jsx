import { useEffect, useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaDirections,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaSearch,
  FaShieldAlt,
  FaSpinner,
  FaTimesCircle,
  FaUser,
} from "react-icons/fa";
import toast from "react-hot-toast";

import {
  getAllEmergencies,
  updateEmergencyStatus,
} from "../services/adminService";

const STATUS_OPTIONS = ["activated", "resolved", "cancelled"];

function AdminEmergencies() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadEmergencies = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllEmergencies();

      setEmergencies(data.emergencies || []);
    } catch (requestError) {
      console.error("Admin emergencies error:", requestError);

      setError(
        requestError.response?.data?.message ||
          "Emergency records load nahi ho paaye."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmergencies();
  }, []);

  const filteredEmergencies = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    return emergencies.filter((emergency) => {
      const userName =
        emergency.user?.fullName?.toLowerCase() || "";

      const userEmail =
        emergency.user?.email?.toLowerCase() || "";

      const userPhone =
        emergency.user?.phone?.toLowerCase() || "";

      const emergencyType =
        emergency.type?.toLowerCase() || "";

      const message =
        emergency.message?.toLowerCase() || "";

      const matchesSearch =
        !cleanSearch ||
        userName.includes(cleanSearch) ||
        userEmail.includes(cleanSearch) ||
        userPhone.includes(cleanSearch) ||
        emergencyType.includes(cleanSearch) ||
        message.includes(cleanSearch);

      const matchesStatus =
        statusFilter === "all" ||
        emergency.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [emergencies, search, statusFilter]);

  const handleStatusChange = async (
    emergencyId,
    newStatus
  ) => {
    try {
      setUpdatingId(emergencyId);

      const data = await updateEmergencyStatus(
        emergencyId,
        newStatus
      );

      setEmergencies((current) =>
        current.map((emergency) =>
          emergency.id === emergencyId
            ? data.emergency
            : emergency
        )
      );

      toast.success(
        data.message || "Emergency status updated."
      );
    } catch (requestError) {
      console.error(
        "Update emergency status error:",
        requestError
      );

      toast.error(
        requestError.response?.data?.message ||
          "Emergency status update nahi ho paaya."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateValue) =>
    {
  if (!dateValue) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateValue));
};

const getStatusClasses = (status) => {
  if (status === "resolved") {
    return "border-green-500/30 bg-green-950/30 text-green-300";
  }

  if (status === "cancelled") {
    return "border-slate-600 bg-slate-800 text-slate-300";
  }

  return "border-red-500/30 bg-red-950/30 text-red-300";
};

const getStatusIcon = (status) => {
  if (status === "resolved") {
    return <FaCheckCircle />;
  }

  if (status === "cancelled") {
    return <FaTimesCircle />;
  }

  return <FaExclamationTriangle />;
};

return (
  <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
    <div className="mx-auto max-w-7xl">
      <section className="rounded-3xl border border-red-500/20 bg-gradient-to-r from-slate-900 via-red-950/20 to-slate-900 p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-red-500/10 p-4 text-red-400">
            <FaShieldAlt className="text-3xl" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-red-400">
              Administration
            </p>

            <h1 className="mt-1 text-4xl font-bold">
              Emergency Management
            </h1>
          </div>
        </div>

        <p className="mt-5 max-w-3xl leading-7 text-slate-300">
          View all user SOS records, inspect saved locations and update
          emergency status.
        </p>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <FaSearch className="absolute left-4 top-4 text-slate-500" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by user, phone, email or emergency type"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none placeholder:text-slate-600 focus:border-red-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-red-500"
          >
            <option value="all">All Statuses</option>

            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </section>

      {loading ? (
        <div className="mt-8 flex min-h-80 items-center justify-center rounded-3xl border border-slate-800 bg-slate-900">
          <div className="text-center">
            <FaSpinner className="mx-auto animate-spin text-4xl text-red-400" />

            <p className="mt-4 text-slate-400">
              Loading emergency records...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-950/30 p-6">
          <p className="font-semibold text-red-300">{error}</p>

          <button
            type="button"
            onClick={loadEmergencies}
            className="mt-4 rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      ) : filteredEmergencies.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-12 text-center">
          <FaShieldAlt className="mx-auto text-5xl text-slate-600" />

          <h2 className="mt-5 text-2xl font-bold">
            No emergency records found
          </h2>

          <p className="mt-3 text-slate-400">
            Search ya status filter change karke dekho.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {filteredEmergencies.map((emergency) => {
            const isUpdating = updatingId === emergency.id;

            return (
              <article
                key={emergency.id}
                className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:p-8"
              >
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-red-500/10 p-4 text-red-400">
                      <FaExclamationTriangle className="text-2xl" />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {emergency.type || "SOS"} Emergency
                      </h2>

                      <p className="mt-2 text-sm text-slate-400">
                        Activated:{" "}
                        {formatDate(
                          emergency.activatedAt || emergency.createdAt
                        )}
                      </p>

                      <p className="mt-1 break-all text-xs text-slate-600">
                        Record ID: {emergency.id}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold capitalize ${getStatusClasses(
                      emergency.status
                    )}`}
                  >
                    {getStatusIcon(emergency.status)}
                    {emergency.status}
                  </span>
                </div>

                <div className="mt-7 grid gap-4 lg:grid-cols-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <FaUser className="text-2xl text-blue-400" />

                    <p className="mt-4 text-sm text-slate-500">
                      User Details
                    </p>

                    <p className="mt-2 font-semibold text-white">
                      {emergency.user?.fullName || "Unknown User"}
                    </p>

                    <p className="mt-1 break-all text-sm text-slate-400">
                      {emergency.user?.email || "Email unavailable"}
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      {emergency.user?.phone || "Phone unavailable"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <FaMapMarkerAlt className="text-2xl text-pink-400" />

                    <p className="mt-4 text-sm text-slate-500">
                      Emergency Location
                    </p>

                    <p className="mt-2 text-sm font-semibold text-white">
                      {emergency.location?.latitude ?? "Not available"},{" "}
                      {emergency.location?.longitude ?? "Not available"}
                    </p>

                    {emergency.location?.mapLink && (
                      <a
                        href={emergency.location.mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300"
                      >
                        <FaDirections />
                        Open Map
                      </a>
                    )}
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <FaShieldAlt className="text-2xl text-green-400" />

                    <p className="mt-4 text-sm text-slate-500">
                      Police Workflow
                    </p>

                    <p className="mt-2 font-semibold text-white">
                      {emergency.nearestPoliceStation?.name ||
                        "Nearest police station"}
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      {emergency.nearestPoliceStation?.status ||
                        "Demo alert prepared"}
                    </p>
                  </div>
                </div>

                {emergency.message && (
                  <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-sm text-slate-500">
                      Emergency Message
                    </p>

                    <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-300">
                      {emergency.message}
                    </p>
                  </div>
                )}

                <div className="mt-6">
                  <label className="mb-2 block text-sm font-medium text-slate-400">
                    Update Emergency Status
                  </label>

                  <select
                    value={emergency.status}
                    onChange={(event) =>
                      handleStatusChange(
                        emergency.id,
                        event.target.value
                      )
                    }
                    disabled={isUpdating}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>

                  {isUpdating && (
                    <p className="mt-3 flex items-center gap-2 text-sm text-red-400">
                      <FaSpinner className="animate-spin" />
                      Updating emergency status...
                    </p>
                  )}
                </div>

                {emergency.resolvedAt && (
                  <p className="mt-5 text-sm text-slate-500">
                    Status updated: {formatDate(emergency.resolvedAt)}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  </div>
);
}

export default AdminEmergencies;
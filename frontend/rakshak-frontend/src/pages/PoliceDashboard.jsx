import { useEffect, useMemo, useState } from "react";
import {
  FaDirections,
  FaExclamationTriangle,
  FaSearch,
  FaShieldAlt,
  FaSpinner,
  FaUser,
} from "react-icons/fa";
import toast from "react-hot-toast";

import {
  getAllPoliceRequests,
  updatePoliceRequest,
} from "../services/policeRequestService";

const STATUS_OPTIONS = [
  "submitted",
  "acknowledged",
  "assigned",
  "in-progress",
  "resolved",
  "cancelled",
];

function PoliceDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllPoliceRequests();

      setRequests(data.requests || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Police requests could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        !query ||
        request.title?.toLowerCase().includes(query) ||
        request.user?.fullName?.toLowerCase().includes(query) ||
        request.user?.email?.toLowerCase().includes(query) ||
        request.user?.phone?.includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, search, statusFilter]);

  const updateRequest = async (
    requestId,
    updateData
  ) => {
    try {
      setUpdatingId(requestId);

      const data = await updatePoliceRequest(
        requestId,
        updateData
      );

      setRequests((current) =>
        current.map((request) =>
          request.id === requestId
            ? data.request
            : request
        )
      );

      toast.success(data.message);
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Request could not be updated."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border border-blue-500/20 bg-slate-900 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-400">
            Police Operations
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Assistance request queue
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-slate-400">
            Review citizen assistance records, inspect location information,
            assign cases and update operational status.
          </p>
        </section>

        <section className="mt-8 grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <FaSearch className="absolute left-4 top-4 text-slate-500" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search citizen, email, phone or request"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none"
          >
            <option value="all">All statuses</option>

            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status.replaceAll("-", " ")}
              </option>
            ))}
          </select>
        </section>

        {loading ? (
          <div className="mt-8 flex min-h-80 items-center justify-center">
            <FaSpinner className="animate-spin text-5xl text-blue-400" />
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-950/20 p-6 text-red-300">
            {error}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-700 p-12 text-center text-slate-400">
            No requests match the current filters.
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {filteredRequests.map((request) => (
              <article
                key={request.id}
                className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row">
                  <div>
                    <div className="flex items-center gap-3">
                      <FaExclamationTriangle className="text-xl text-yellow-400" />

                      <h2 className="text-2xl font-bold">
                        {request.title}
                      </h2>
                    </div>

                    <p className="mt-3 max-w-3xl leading-7 text-slate-400">
                      {request.description}
                    </p>
                  </div>

                  <span className="h-fit rounded-full border border-slate-700 px-4 py-2 text-sm capitalize text-slate-300">
                    {request.priority} priority
                  </span>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <FaUser className="text-xl text-blue-400" />

                    <p className="mt-4 font-semibold">
                      {request.user?.fullName || "Unknown user"}
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      {request.user?.email}
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      {request.user?.phone}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <FaShieldAlt className="text-xl text-green-400" />

                    <p className="mt-4 font-semibold">
                      {request.selectedStation?.name ||
                        "Station not selected"}
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      {request.selectedStation?.address}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    {request.location?.mapLink ? (
                      <a
                        href={request.location.mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 font-semibold text-blue-400"
                      >
                        <FaDirections />
                        Open citizen location
                      </a>
                    ) : (
                      <p className="text-slate-500">
                        Location not available
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
                  <select
                    value={request.status}
                    onChange={(event) =>
                      updateRequest(request.id, {
                        status: event.target.value,
                      })
                    }
                    disabled={updatingId === request.id}
                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status.replaceAll("-", " ")}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() =>
                      updateRequest(request.id, {
                        assignToMe: true,
                      })
                    }
                    disabled={updatingId === request.id}
                    className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
                  >
                    {updatingId === request.id
                      ? "Updating..."
                      : "Assign to me"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PoliceDashboard;
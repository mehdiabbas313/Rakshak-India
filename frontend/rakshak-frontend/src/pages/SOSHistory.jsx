import { useEffect, useState } from "react";
import {
  FaBan,
  FaCheckCircle,
  FaDirections,
  FaExclamationTriangle,
  FaHistory,
  FaMapMarkerAlt,
  FaSpinner,
  FaUserFriends,
} from "react-icons/fa";
import toast from "react-hot-toast";

import {
  cancelEmergency,
  getEmergencyHistory,
  resolveEmergency,
} from "../services/emergencyService";

function SOSHistory() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEmergencyHistory();

      setEmergencies(data.emergencies || []);
    } catch (requestError) {
      console.error("SOS history error:", requestError);

      setError(
        requestError.response?.data?.message ||
          "Emergency history load nahi ho paayi."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleCancel = async (emergencyId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this SOS record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(emergencyId);

      const data = await cancelEmergency(emergencyId);

      setEmergencies((current) =>
        current.map((emergency) =>
          emergency.id === emergencyId
            ? data.emergency
            : emergency
        )
      );

      toast.success(data.message || "SOS cancelled.");
    } catch (requestError) {
      console.error("Cancel SOS error:", requestError);

      toast.error(
        requestError.response?.data?.message ||
          "SOS cancel nahi ho paya."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleResolve = async (emergencyId) => {
    try {
      setUpdatingId(emergencyId);

      const data = await resolveEmergency(emergencyId);

      setEmergencies((current) =>
        current.map((emergency) =>
          emergency.id === emergencyId
            ? data.emergency
            : emergency
        )
      );

      toast.success(data.message || "Emergency resolved.");
    } catch (requestError) {
      console.error("Resolve SOS error:", requestError);

      toast.error(
        requestError.response?.data?.message ||
          "Emergency resolve nahi ho paayi."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateValue) => {
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

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 to-red-950/30 p-8 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-red-500/10 p-4 text-red-400">
              <FaHistory className="text-3xl" />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-red-400">
                Emergency Records
              </p>

              <h1 className="mt-1 text-4xl font-bold">
                SOS History
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-3xl leading-7 text-slate-300">
            View emergency events saved to your Rakshak account, check their
            location and manage their current status.
          </p>
        </section>

        {loading ? (
          <div className="mt-8 flex min-h-80 items-center justify-center rounded-3xl border border-slate-800 bg-slate-900">
            <div className="text-center">
              <FaSpinner className="mx-auto animate-spin text-4xl text-blue-400" />

              <p className="mt-4 text-slate-400">
                Loading emergency history...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-950/30 p-6">
            <p className="font-semibold text-red-300">{error}</p>

            <button
              type="button"
              onClick={loadHistory}
              className="mt-4 rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : emergencies.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-12 text-center">
            <FaHistory className="mx-auto text-5xl text-slate-600" />

            <h2 className="mt-5 text-2xl font-bold">
              No SOS history found
            </h2>

            <p className="mt-3 text-slate-400">
              SOS events activated from the Emergency Dashboard will appear
              here.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {emergencies.map((emergency) => {
              const isUpdating = updatingId === emergency.id;
              const isActive = emergency.status === "activated";

              return (
                <article
                  key={emergency.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:p-8"
                >
                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-red-500/10 p-4 text-red-400">
                        <FaExclamationTriangle className="text-2xl" />
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold">
                          {emergency.type} Emergency
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                          Activated: {formatDate(emergency.activatedAt)}
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          Record ID: {emergency.id}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold capitalize ${getStatusClasses(
                        emergency.status
                      )}`}
                    >
                      {emergency.status}
                    </span>
                  </div>

                  <div className="mt-7 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                      <FaMapMarkerAlt className="text-2xl text-blue-400" />

                      <p className="mt-4 text-sm text-slate-500">
                        Location
                      </p>

                      <p className="mt-2 text-sm font-semibold text-white">
                        {emergency.location?.latitude},{" "}
                        {emergency.location?.longitude}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                      <FaUserFriends className="text-2xl text-purple-400" />

                      <p className="mt-4 text-sm text-slate-500">
                        Emergency Contacts
                      </p>

                      <p className="mt-2 text-2xl font-bold text-white">
                        {emergency.emergencyContactCount || 0}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                      <FaCheckCircle className="text-2xl text-green-400" />

                      <p className="mt-4 text-sm text-slate-500">
                        Police Workflow
                      </p>

                      <p className="mt-2 text-sm font-semibold text-white">
                        {emergency.nearestPoliceStation?.status ||
                          "Demo alert prepared"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-yellow-500/30 bg-yellow-950/20 p-4">
                    <p className="font-semibold text-yellow-200">
                      Demo dispatch status
                    </p>

                    <p className="mt-1 text-sm leading-6 text-yellow-100/70">
                      The SOS event is stored in MongoDB, but no official police
                      dispatch or automatic emergency message was sent.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={emergency.location?.mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-700"
                    >
                      <FaDirections />
                      Open Location
                    </a>

                    {isActive && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleResolve(emergency.id)}
                          disabled={isUpdating}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold transition hover:bg-green-700 disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaCheckCircle />
                          )}
                          Mark Resolved
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCancel(emergency.id)}
                          disabled={isUpdating}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-950/20 px-5 py-3 font-semibold text-red-300 transition hover:bg-red-950/40 disabled:opacity-50"
                        >
                          <FaBan />
                          Cancel SOS
                        </button>
                      </>
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

export default SOSHistory;
import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaHistory,
  FaMapMarkerAlt,
  FaRoute,
  FaSpinner,
  FaUserShield,
} from "react-icons/fa";

import { getWomenSafetyHistory } from "../services/womenSafetyService";

function WomenSafetyHistory() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getWomenSafetyHistory();

        setSessions(data.sessions || []);
      } catch (requestError) {
        console.error("Women Safety history error:", requestError);

        setError(
          requestError.response?.data?.message ||
            "Women Safety history load nahi ho paayi."
        );
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
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

  const getStatusClasses = (status) => {
    if (status === "completed") {
      return "border-green-500/30 bg-green-950/30 text-green-300";
    }

    if (status === "cancelled") {
      return "border-slate-600 bg-slate-800 text-slate-300";
    }

    return "border-pink-500/30 bg-pink-950/30 text-pink-300";
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border border-pink-500/20 bg-gradient-to-r from-slate-900 via-pink-950/20 to-slate-900 p-8 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-pink-500/10 p-4 text-pink-400">
              <FaHistory className="text-3xl" />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-pink-400">
                Personal Safety Records
              </p>

              <h1 className="mt-1 text-4xl font-bold">
                Women Safety History
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-3xl leading-7 text-slate-300">
            Review your previous Women Safety sessions, saved location,
            travelling-alone status, tracking state and session completion
            details.
          </p>
        </section>

        {loading ? (
          <div className="mt-8 flex min-h-80 items-center justify-center rounded-3xl border border-slate-800 bg-slate-900">
            <div className="text-center">
              <FaSpinner className="mx-auto animate-spin text-4xl text-pink-400" />

              <p className="mt-4 text-slate-400">
                Loading Women Safety history...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-950/30 p-6">
            <p className="font-semibold text-red-300">{error}</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-12 text-center">
            <FaHistory className="mx-auto text-5xl text-slate-600" />

            <h2 className="mt-5 text-2xl font-bold">
              No safety history found
            </h2>

            <p className="mt-3 text-slate-400">
              Women Safety sessions activated from the safety dashboard will
              appear here.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {sessions.map((session) => (
              <article
                key={session.id}
                className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:p-8"
              >
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-pink-500/10 p-4 text-pink-400">
                      <FaUserShield className="text-2xl" />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold">
                        Women Safety Session
                      </h2>

                      <p className="mt-2 text-sm text-slate-400">
                        Started: {formatDate(session.startedAt)}
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        Session ID: {session.id}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold capitalize ${getStatusClasses(
                      session.status
                    )}`}
                  >
                    {session.status}
                  </span>
                </div>

                <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <FaCheckCircle
                      className={`text-2xl ${
                        session.travellingAlone
                          ? "text-green-400"
                          : "text-slate-600"
                      }`}
                    />

                    <p className="mt-4 text-sm text-slate-500">
                      Travelling Alone
                    </p>

                    <p className="mt-2 font-semibold text-white">
                      {session.travellingAlone ? "Enabled" : "Disabled"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <FaRoute
                      className={`text-2xl ${
                        session.trackingActive
                          ? "text-green-400"
                          : "text-slate-600"
                      }`}
                    />

                    <p className="mt-4 text-sm text-slate-500">
                      Live Tracking
                    </p>

                    <p className="mt-2 font-semibold text-white">
                      {session.trackingActive ? "Active" : "Inactive"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <FaMapMarkerAlt className="text-2xl text-blue-400" />

                    <p className="mt-4 text-sm text-slate-500">
                      Saved Location
                    </p>

                    <p className="mt-2 text-sm font-semibold text-white">
                      {typeof session.currentLocation?.latitude === "number" &&
                      typeof session.currentLocation?.longitude === "number"
                        ? `${session.currentLocation.latitude}, ${session.currentLocation.longitude}`
                        : "Not available"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <FaCheckCircle className="text-2xl text-purple-400" />

                    <p className="mt-4 text-sm text-slate-500">
                      Emergency Contacts
                    </p>

                    <p className="mt-2 text-2xl font-bold text-white">
                      {session.emergencyContactCount || 0}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-sm text-slate-500">
                      Police Monitoring
                    </p>

                    <p className="mt-2 font-semibold text-white">
                      {session.policeMonitoringStatus ||
                        "Demo monitoring prepared"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-sm text-slate-500">
                      Session Ended
                    </p>

                    <p className="mt-2 font-semibold text-white">
                      {formatDate(session.endedAt)}
                    </p>
                  </div>
                </div>

                {session.currentLocation?.mapLink && (
                  <a
                    href={session.currentLocation.mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-700"
                  >
                    <FaMapMarkerAlt />
                    Open Saved Location
                  </a>
                )}

                <div className="mt-6 rounded-2xl border border-yellow-500/30 bg-yellow-950/20 p-4">
                  <div className="flex items-start gap-3">
                    <FaExclamationTriangle className="mt-1 shrink-0 text-yellow-400" />

                    <div>
                      <p className="font-semibold text-yellow-200">
                        Demo integration
                      </p>

                      <p className="mt-1 text-sm leading-6 text-yellow-100/70">
                        Safety session data is stored in MongoDB. Official
                        police monitoring, background tracking and automatic
                        alerts were not performed.
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WomenSafetyHistory;
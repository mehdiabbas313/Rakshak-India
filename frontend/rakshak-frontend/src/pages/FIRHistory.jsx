import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaFileAlt,
  FaMapMarkerAlt,
  FaSpinner,
  FaTrash,
} from "react-icons/fa";
import toast from "react-hot-toast";

import {
  deleteFIR,
  getFIRHistory,
} from "../services/firService";

function FIRHistory() {
  const [firs, setFirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const loadFIRHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getFIRHistory();

      setFirs(data.firs || []);
    } catch (requestError) {
      console.error("FIR history error:", requestError);

      setError(
        requestError.response?.data?.message ||
          "FIR history load nahi ho paayi."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFIRHistory();
  }, []);

  const removeDraft = async (firId) => {
    const confirmed = window.confirm(
      "Kya aap is FIR draft ko delete karna chahte hain?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(firId);

      const data = await deleteFIR(firId);

      setFirs((current) =>
        current.filter((fir) => fir.id !== firId)
      );

      toast.success(data.message || "FIR draft deleted.");
    } catch (requestError) {
      console.error("Delete FIR error:", requestError);

      toast.error(
        requestError.response?.data?.message ||
          "FIR draft delete nahi ho paaya."
      );
    } finally {
      setDeletingId(null);
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

  const formatIncidentDate = (dateValue) => {
    if (!dateValue) {
      return "Not available";
    }

    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
    }).format(new Date(dateValue));
  };

  const getStatusClasses = (status) => {
    if (status === "closed") {
      return "border-slate-600 bg-slate-800 text-slate-300";
    }

    if (status === "under-review") {
      return "border-yellow-500/30 bg-yellow-950/30 text-yellow-300";
    }

    if (status === "submitted") {
      return "border-green-500/30 bg-green-950/30 text-green-300";
    }

    return "border-blue-500/30 bg-blue-950/30 text-blue-300";
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 p-8 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-cyan-500/10 p-4 text-cyan-400">
              <FaFileAlt className="text-3xl" />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                Complaint Records
              </p>

              <h1 className="mt-1 text-4xl font-bold">
                FIR History
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-3xl leading-7 text-slate-300">
            View complaint drafts and submitted complaint records saved in your
            Rakshak account.
          </p>

          <div className="mt-6 rounded-2xl border border-yellow-500/30 bg-yellow-950/20 p-4">
            <p className="font-semibold text-yellow-200">
              Demo complaint system
            </p>

            <p className="mt-1 text-sm leading-6 text-yellow-100/70">
              These records are stored in Rakshak India. They are not official
              police FIR registrations.
            </p>
          </div>
        </section>

        {loading ? (
          <div className="mt-8 flex min-h-80 items-center justify-center rounded-3xl border border-slate-800 bg-slate-900">
            <div className="text-center">
              <FaSpinner className="mx-auto animate-spin text-4xl text-cyan-400" />

              <p className="mt-4 text-slate-400">
                Loading FIR history...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-950/30 p-6">
            <p className="font-semibold text-red-300">{error}</p>

            <button
              type="button"
              onClick={loadFIRHistory}
              className="mt-4 rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : firs.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-12 text-center">
            <FaFileAlt className="mx-auto text-5xl text-slate-600" />

            <h2 className="mt-5 text-2xl font-bold">
              No FIR records found
            </h2>

            <p className="mt-3 text-slate-400">
              FIR drafts and complaint records saved from the Online FIR page
              will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {firs.map((fir) => (
              <article
                key={fir.id}
                className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:p-8"
              >
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-cyan-500/10 p-4 text-cyan-400">
                      <FaFileAlt className="text-2xl" />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold">
                        {fir.complaintTitle}
                      </h2>

                      <p className="mt-2 break-all text-sm font-semibold text-cyan-300">
                        {fir.referenceNumber}
                      </p>

                      <p className="mt-2 text-sm text-slate-400">
                        Saved: {formatDate(fir.createdAt)}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold capitalize ${getStatusClasses(
                      fir.status
                    )}`}
                  >
                    {fir.status?.replace("-", " ")}
                  </span>
                </div>

                <div className="mt-7 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <FaFileAlt className="text-2xl text-cyan-400" />

                    <p className="mt-4 text-sm text-slate-500">
                      Complaint Type
                    </p>

                    <p className="mt-2 font-semibold text-white">
                      {fir.complaintType}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <FaCalendarAlt className="text-2xl text-blue-400" />

                    <p className="mt-4 text-sm text-slate-500">
                      Incident Date
                    </p>

                    <p className="mt-2 font-semibold text-white">
                      {formatIncidentDate(fir.incidentDate)}
                    </p>

                    {fir.incidentTime && (
                      <p className="mt-1 text-sm text-slate-400">
                        Time: {fir.incidentTime}
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <FaMapMarkerAlt className="text-2xl text-pink-400" />

                    <p className="mt-4 text-sm text-slate-500">
                      Incident Location
                    </p>

                    <p className="mt-2 font-semibold text-white">
                      {fir.incidentLocation}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-sm text-slate-500">
                    Complaint Description
                  </p>

                  <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-300">
                    {fir.description}
                  </p>
                </div>

                {(fir.suspectDetails || fir.witnessDetails) && (
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                      <p className="text-sm text-slate-500">
                        Suspect Details
                      </p>

                      <p className="mt-3 whitespace-pre-wrap text-slate-300">
                        {fir.suspectDetails || "Not provided"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                      <p className="text-sm text-slate-500">
                        Witness Details
                      </p>

                      <p className="mt-3 whitespace-pre-wrap text-slate-300">
                        {fir.witnessDetails || "Not provided"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-sm text-slate-500">
                      Police Station
                    </p>

                    <p className="mt-2 font-semibold text-white">
                      {fir.policeStation || "Not assigned"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-yellow-500/30 bg-yellow-950/20 p-5">
                    <p className="text-sm text-yellow-300">
                      Official Submission Status
                    </p>

                    <p className="mt-2 font-semibold capitalize text-yellow-100">
                      {fir.officialSubmissionStatus?.replaceAll("-", " ") ||
                        "Demo only"}
                    </p>
                  </div>
                </div>

                {fir.evidenceLinks?.length > 0 && (
                  <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-sm text-slate-500">
                      Evidence Links
                    </p>

                    <div className="mt-4 space-y-3">
                      {fir.evidenceLinks.map((link, index) => (
                        <a
                          key={`${link}-${index}`}
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 break-all text-sm font-semibold text-blue-400 hover:text-blue-300"
                        >
                          <FaExternalLinkAlt />
                          Evidence {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {fir.status === "draft" && (
                  <button
                    type="button"
                    onClick={() => removeDraft(fir.id)}
                    disabled={deletingId === fir.id}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-950/20 px-5 py-3 font-semibold text-red-300 transition hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === fir.id ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Deleting Draft...
                      </>
                    ) : (
                      <>
                        <FaTrash />
                        Delete Draft
                      </>
                    )}
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FIRHistory;
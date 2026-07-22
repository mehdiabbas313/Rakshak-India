import { useEffect, useMemo, useState } from "react";
import {
  FaAmbulance,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaDirections,
  FaExclamationTriangle,
  FaHistory,
  FaHospital,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaSearch,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import useGeolocation from "../hooks/useGeolocation";

import { getNearbyHospitals } from "../services/mapService";

import {
  cancelHospitalRequest,
  createHospitalRequest,
  getMyHospitalRequests,
} from "../services/hospitalService";

const ASSISTANCE_TYPES = [
  "Emergency",
  "Ambulance",
  "General Medical",
  "Women Healthcare",
  "Child Healthcare",
];

const initialFormData = {
  assistanceType: "General Medical",
  priority: "standard",
  patientName: "",
  description: "",
};

function Hospital() {
  const { user, isAuthenticated } = useAuth();

  const [hospitals, setHospitals] = useState([]);
  const [requests, setRequests] = useState([]);

  const [selectedHospital, setSelectedHospital] =
    useState(null);

  const [search, setSearch] = useState("");
  const [formData, setFormData] =
    useState(initialFormData);

  const [loadingHospitals, setLoadingHospitals] =
    useState(false);

  const [loadingRequests, setLoadingRequests] =
    useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [cancellingId, setCancellingId] =
    useState(null);

  const [hospitalError, setHospitalError] =
    useState("");

  const [requestError, setRequestError] =
    useState("");

  const {
    latitude,
    longitude,
    accuracy,
    loading: locationLoading,
    error: locationError,
  } = useGeolocation();

  const hasLocation =
    typeof latitude === "number" &&
    typeof longitude === "number";

  const displayName =
    user?.fullName ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "Patient";

  const loadHospitals = async () => {
    if (!hasLocation) {
      return;
    }

    try {
      setLoadingHospitals(true);
      setHospitalError("");

      const data = await Promise.race([
        getNearbyHospitals(
          latitude,
          longitude,
          15000
        ),

        new Promise((_, reject) => {
          window.setTimeout(() => {
            reject(
              new Error(
                "Hospital search request timed out."
              )
            );
          }, 15000);
        }),
      ]);

      const hospitalList = Array.isArray(data)
        ? data.slice(0, 15)
        : [];

      setHospitals(hospitalList);

      setSelectedHospital((current) => {
        if (
          current &&
          hospitalList.some(
            (hospital) =>
              hospital.id === current.id
          )
        ) {
          return current;
        }

        return hospitalList[0] || null;
      });

      if (hospitalList.length === 0) {
        setHospitalError(
          "No mapped hospital was found within the current search area."
        );
      }
    } catch (error) {
      console.error(
        "Nearby hospitals error:",
        error
      );

      setHospitals([]);
      setSelectedHospital(null);

      setHospitalError(
        error.response?.data?.message ||
          "Live hospital data is temporarily unavailable."
      );
    } finally {
      setLoadingHospitals(false);
    }
  };

  const loadRequestHistory = async () => {
    if (!isAuthenticated) {
      setRequests([]);
      return;
    }

    try {
      setLoadingRequests(true);
      setRequestError("");

      const data =
        await getMyHospitalRequests();

      setRequests(data.requests || []);
    } catch (error) {
      console.error(
        "Hospital history error:",
        error
      );

      setRequestError(
        error.response?.data?.message ||
          "Medical assistance history could not be loaded."
      );
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (hasLocation) {
      loadHospitals();
    }
  }, [latitude, longitude]);

  useEffect(() => {
    loadRequestHistory();
  }, [isAuthenticated]);

  const filteredHospitals = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return hospitals;
    }

    return hospitals.filter((hospital) => {
      return (
        hospital.name
          ?.toLowerCase()
          .includes(query) ||
        hospital.address
          ?.toLowerCase()
          .includes(query) ||
        hospital.operator
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [hospitals, search]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const submitMedicalRequest = async (
    event
  ) => {
    event.preventDefault();

    if (!isAuthenticated) {
      toast.error(
        "Medical assistance request save karne ke liye login required hai."
      );

      return;
    }

    if (!hasLocation) {
      toast.error(
        "Current location required hai."
      );

      return;
    }

    if (
      formData.patientName.trim().length < 2
    ) {
      toast.error(
        "Please enter the patient name."
      );

      return;
    }

    if (
      formData.description.trim().length < 20
    ) {
      toast.error(
        "Medical situation ko kam se kam 20 characters me describe karo."
      );

      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        assistanceType:
          formData.assistanceType,

        priority: formData.priority,

        patientName:
          formData.patientName.trim(),

        description:
          formData.description.trim(),

        location: {
          latitude,
          longitude,
        },

        hospital: selectedHospital
          ? {
              name: selectedHospital.name,
              latitude:
                selectedHospital.latitude,
              longitude:
                selectedHospital.longitude,
              address:
                selectedHospital.address,
            }
          : {
              name: "Hospital not selected",
              latitude: null,
              longitude: null,
              address: "",
            },
      };

      const data =
        await createHospitalRequest(payload);

      setRequests((current) => [
        data.request,
        ...current,
      ]);

      setFormData({
        ...initialFormData,
        patientName:
          user?.fullName || "",
      });

      toast.success(
        "Medical assistance request saved."
      );
    } catch (error) {
      console.error(
        "Medical request error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Medical assistance request could not be saved."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const cancelRequest = async (
    requestId
  ) => {
    const confirmed = window.confirm(
      "Cancel this medical assistance request?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(requestId);

      const data =
        await cancelHospitalRequest(
          requestId
        );

      setRequests((current) =>
        current.map((request) =>
          request._id === requestId ||
          request.id === requestId
            ? data.request
            : request
        )
      );

      toast.success(data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Medical request could not be cancelled."
      );
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not available";
    }

    return new Intl.DateTimeFormat(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    ).format(new Date(dateValue));
  };

  const getStatusClasses = (status) => {
    if (status === "completed") {
      return "border-green-500/30 bg-green-950/30 text-green-300";
    }

    if (status === "accepted") {
      return "border-blue-500/30 bg-blue-950/30 text-blue-300";
    }

    if (status === "reviewing") {
      return "border-yellow-500/30 bg-yellow-950/30 text-yellow-300";
    }

    if (status === "cancelled") {
      return "border-slate-600 bg-slate-800 text-slate-300";
    }

    return "border-cyan-500/30 bg-cyan-950/30 text-cyan-300";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 xl:grid-cols-[1fr_380px] xl:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-400">
                Medical Response Network
              </p>

              <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
                Medical assistance built around
                your location
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
                Find nearby hospitals, request
                medical support and maintain a
                secure history of assistance
                records from one interface.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-500">
                National ambulance
              </p>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold">
                    108
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Emergency ambulance service
                  </p>
                </div>

                <a
                  href="tel:108"
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 text-xl transition hover:bg-green-700"
                  aria-label="Call ambulance 108"
                >
                  <FaAmbulance />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="tel:108"
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold hover:bg-green-700"
            >
              <FaAmbulance />
              Ambulance 108
            </a>

            <a
              href="tel:112"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 font-semibold hover:bg-slate-900"
            >
              <FaPhoneAlt />
              Emergency 112
            </a>

            <a
              href="tel:104"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 font-semibold hover:bg-slate-900"
            >
              Health Helpline 104
            </a>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 p-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="text-2xl font-bold">
                    Nearby hospitals
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Hospitals are sorted by
                    distance from your detected
                    location.
                  </p>
                </div>

                <span className="w-fit rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-300">
                  {locationLoading
                    ? "Detecting location..."
                    : hasLocation
                      ? `Accuracy ±${Math.round(
                          accuracy || 0
                        )} m`
                      : "Location unavailable"}
                </span>
              </div>

              <div className="relative mt-5">
                <FaSearch className="absolute left-4 top-4 text-slate-500" />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Filter loaded hospitals by name or area"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 outline-none placeholder:text-slate-600 focus:border-green-500"
                />
              </div>
            </div>

            <div className="max-h-[720px] overflow-y-auto p-4 md:p-6">
              {locationLoading ||
              loadingHospitals ? (
                <div className="flex min-h-64 items-center justify-center">
                  <div className="text-center">
                    <FaSpinner className="mx-auto animate-spin text-4xl text-green-400" />

                    <p className="mt-4 text-slate-400">
                      Searching nearby
                      hospitals...
                    </p>
                  </div>
                </div>
              ) : locationError &&
                !hasLocation ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-6">
                  <FaExclamationTriangle className="text-3xl text-red-400" />

                  <p className="mt-4 text-red-300">
                    {locationError}
                  </p>
                </div>
              ) : hospitalError ? (
                <div className="rounded-2xl border border-yellow-500/30 bg-yellow-950/20 p-6">
                  <FaExclamationTriangle className="text-3xl text-yellow-400" />

                  <p className="mt-4 text-yellow-200">
                    {hospitalError}
                  </p>

                  <button
                    type="button"
                    onClick={loadHospitals}
                    className="mt-5 rounded-xl border border-yellow-400/40 px-5 py-3 font-semibold text-yellow-200 hover:bg-yellow-950/40"
                  >
                    Retry live hospital search
                  </button>
                </div>
              ) : filteredHospitals.length ===
                0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
                  No hospital matches the
                  current filter.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredHospitals.map(
                    (hospital) => {
                      const isSelected =
                        selectedHospital?.id ===
                        hospital.id;

                      return (
                        <article
                          key={hospital.id}
                          className={`rounded-2xl border p-5 transition ${
                            isSelected
                              ? "border-green-500 bg-green-950/20"
                              : "border-slate-800 bg-slate-950 hover:border-slate-600"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedHospital(
                                hospital
                              )
                            }
                            className="w-full text-left"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="text-lg font-semibold">
                                  {
                                    hospital.name
                                  }
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                  {
                                    hospital.address
                                  }
                                </p>
                              </div>

                              <span className="shrink-0 rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                                {
                                  hospital.distance
                                }
                              </span>
                            </div>

                            {isSelected && (
                              <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-green-300">
                                <FaCheckCircle />
                                Selected hospital
                              </p>
                            )}
                          </button>

                          <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <a
                              href={
                                hospital.phone
                                  ? `tel:${hospital.phone}`
                                  : "tel:108"
                              }
                              className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold hover:bg-green-700"
                            >
                              <FaPhoneAlt />
                              {hospital.phone
                                ? "Call hospital"
                                : "Call 108"}
                            </a>

                            <a
                              href={
                                hospital.directionsLink
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold hover:bg-slate-800"
                            >
                              <FaDirections />
                              Directions
                            </a>
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-slate-800 bg-slate-900 p-6 xl:sticky xl:top-24">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-500/10 p-3 text-green-400">
                <FaHospital className="text-2xl" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Secure assistance record
                </p>

                <h2 className="text-xl font-bold">
                  Request medical support
                </h2>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-yellow-500/30 bg-yellow-950/20 p-4">
              <p className="text-sm leading-6 text-yellow-100/80">
                This creates a Rakshak medical
                assistance record. It does not
                guarantee ambulance dispatch or
                hospital admission.
              </p>
            </div>

            {selectedHospital && (
              <div className="mt-5 rounded-xl border border-green-500/20 bg-green-950/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-green-400">
                  Selected hospital
                </p>

                <p className="mt-2 font-semibold">
                  {selectedHospital.name}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {selectedHospital.distance} away
                </p>
              </div>
            )}

            <form
              onSubmit={
                submitMedicalRequest
              }
              className="mt-6 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Assistance type
                </label>

                <select
                  name="assistanceType"
                  value={
                    formData.assistanceType
                  }
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-green-500"
                >
                  {ASSISTANCE_TYPES.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Priority
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-green-500"
                >
                  <option value="standard">
                    Standard
                  </option>
                  <option value="urgent">
                    Urgent
                  </option>
                  <option value="critical">
                    Critical
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Patient name
                </label>

                <input
                  name="patientName"
                  value={
                    formData.patientName
                  }
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="Enter patient name"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-green-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Medical situation
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  maxLength={1000}
                  rows={7}
                  placeholder="Describe symptoms, condition, urgency and assistance required."
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-green-500"
                />

                <p className="mt-2 text-right text-xs text-slate-500">
                  {
                    formData.description
                      .length
                  }
                  /1000
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Saving request...
                  </>
                ) : (
                  <>
                    Submit medical request
                    <FaArrowRight />
                  </>
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-slate-500">
              Signed in as {displayName}
            </p>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <FaHistory className="text-2xl text-green-400" />

              <div>
                <h2 className="text-2xl font-bold">
                  Medical request history
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Review assistance records and
                  their current status.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={loadRequestHistory}
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold hover:bg-slate-800"
            >
              Refresh history
            </button>
          </div>

          {!isAuthenticated ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
              Login to view your medical request
              history.
            </div>
          ) : loadingRequests ? (
            <div className="mt-6 flex min-h-40 items-center justify-center">
              <FaSpinner className="animate-spin text-3xl text-green-400" />
            </div>
          ) : requestError ? (
            <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-950/20 p-5 text-red-300">
              {requestError}
            </div>
          ) : requests.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
              No medical assistance requests
              found.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {requests.map((request) => {
                const requestId =
                  request._id || request.id;

                const canCancel = ![
                  "completed",
                  "cancelled",
                ].includes(request.status);

                return (
                  <article
                    key={requestId}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {
                            request.patientName
                          }
                        </h3>

                        <p className="mt-2 text-sm text-slate-400">
                          {
                            request.assistanceType
                          }
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">
                      {request.description}
                    </p>

                    <div className="mt-5 space-y-2 border-t border-slate-800 pt-4 text-sm text-slate-500">
                      <p className="flex items-center gap-2">
                        <FaClock />
                        {formatDate(
                          request.createdAt
                        )}
                      </p>

                      <p className="flex items-center gap-2">
                        <FaMapMarkerAlt />

                        {request.hospital?.name ||
                          "Hospital not selected"}
                      </p>
                    </div>

                    {canCancel && (
                      <button
                        type="button"
                        onClick={() =>
                          cancelRequest(
                            requestId
                          )
                        }
                        disabled={
                          cancellingId ===
                          requestId
                        }
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-950/30 disabled:opacity-50"
                      >
                        {cancellingId ===
                        requestId ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaTimes />
                        )}

                        Cancel request
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Hospital;
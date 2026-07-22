import { useEffect, useMemo, useState } from "react";
import {
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaDirections,
  FaExclamationTriangle,
  FaHistory,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaSearch,
  FaShieldAlt,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import useGeolocation from "../hooks/useGeolocation";

import { getNearbyPoliceStations } from "../services/mapService";

import {
  cancelPoliceRequest,
  createPoliceRequest,
  getMyPoliceRequests,
} from "../services/policeRequestService";

const REQUEST_TYPES = [
  {
    value: "general-assistance",
    label: "General police assistance",
  },
  {
    value: "theft",
    label: "Theft",
  },
  {
    value: "harassment",
    label: "Harassment",
  },
  {
    value: "cyber-crime",
    label: "Cyber crime",
  },
  {
    value: "missing-person",
    label: "Missing person",
  },
  {
    value: "traffic-incident",
    label: "Traffic incident",
  },
  {
    value: "suspicious-activity",
    label: "Suspicious activity",
  },
  {
    value: "other",
    label: "Other",
  },
];

const initialForm = {
  requestType: "general-assistance",
  priority: "standard",
  title: "",
  description: "",
  address: "",
};

const FALLBACK_STATIONS = [
  {
    id: "fallback-knowledge-park",
    name: "Knowledge Park Police Station",
    address: "Knowledge Park, Greater Noida, Uttar Pradesh",
    distance: "Nearby",
    distanceKm: 0,
    phone: "112",
    operator: "Uttar Pradesh Police",
    openingHours: "",
    latitude: null,
    longitude: null,
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Knowledge+Park+Police+Station+Greater+Noida",
    directionsLink:
      "https://www.google.com/maps/search/?api=1&query=Knowledge+Park+Police+Station+Greater+Noida",
  },
  {
    id: "fallback-beta-2",
    name: "Beta 2 Police Station",
    address: "Beta 2, Greater Noida, Uttar Pradesh",
    distance: "Nearby",
    distanceKm: 0,
    phone: "112",
    operator: "Uttar Pradesh Police",
    openingHours: "",
    latitude: null,
    longitude: null,
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Beta+2+Police+Station+Greater+Noida",
    directionsLink:
      "https://www.google.com/maps/search/?api=1&query=Beta+2+Police+Station+Greater+Noida",
  },
  {
    id: "fallback-kasna",
    name: "Kasna Police Station",
    address: "Kasna, Greater Noida, Uttar Pradesh",
    distance: "Nearby",
    distanceKm: 0,
    phone: "112",
    operator: "Uttar Pradesh Police",
    openingHours: "",
    latitude: null,
    longitude: null,
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Kasna+Police+Station+Greater+Noida",
    directionsLink:
      "https://www.google.com/maps/search/?api=1&query=Kasna+Police+Station+Greater+Noida",
  },
];

function Police() {
  const { user, isAuthenticated } = useAuth();

  const [stations, setStations] = useState([]);
  const [requests, setRequests] = useState([]);

  const [selectedStation, setSelectedStation] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState(initialForm);

  const [loadingStations, setLoadingStations] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const [stationError, setStationError] = useState("");
  const [requestError, setRequestError] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

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
    "Citizen";

  const useFallbackStations = (message) => {
    setStations(FALLBACK_STATIONS);
    setSelectedStation(FALLBACK_STATIONS[0]);
    setUsingFallback(true);
    setStationError(message);
  };

  const loadStations = async () => {
    if (!hasLocation) {
      return;
    }

    try {
      setLoadingStations(true);
      setStationError("");
      setUsingFallback(false);

      const data = await Promise.race([
        getNearbyPoliceStations(
          latitude,
          longitude,
          10000
        ),

        new Promise((_, reject) => {
          window.setTimeout(() => {
            reject(
              new Error(
                "Police station request timed out."
              )
            );
          }, 15000);
        }),
      ]);

      if (!Array.isArray(data) || data.length === 0) {
        useFallbackStations(
          "Live map data returned no stations. Nearby fallback stations are shown."
        );

        return;
      }

      const limitedStations = data.slice(0, 12);

      setStations(limitedStations);
      setSelectedStation((current) => {
        if (
          current &&
          limitedStations.some(
            (station) => station.id === current.id
          )
        ) {
          return current;
        }

        return limitedStations[0];
      });
    } catch (error) {
      console.error("Police stations error:", error);

      useFallbackStations(
        "Live map service is temporarily unavailable. Nearby fallback stations are shown."
      );
    } finally {
      setLoadingStations(false);
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

      const data = await getMyPoliceRequests();

      setRequests(data.requests || []);
    } catch (error) {
      console.error(
        "Police request history error:",
        error
      );

      setRequestError(
        error.response?.data?.message ||
          "Request history could not be loaded."
      );
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (hasLocation) {
      loadStations();
    }
  }, [latitude, longitude]);

  useEffect(() => {
    loadRequestHistory();
  }, [isAuthenticated]);

  const filteredStations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return stations;
    }

    return stations.filter((station) => {
      return (
        station.name?.toLowerCase().includes(query) ||
        station.address?.toLowerCase().includes(query) ||
        station.operator?.toLowerCase().includes(query)
      );
    });
  }, [stations, search]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const submitRequest = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      toast.error(
        "Police assistance request save karne ke liye login required hai."
      );

      return;
    }

    if (formData.title.trim().length < 5) {
      toast.error(
        "Please enter a clear request title."
      );

      return;
    }

    if (formData.description.trim().length < 20) {
      toast.error(
        "Please provide at least 20 characters of incident details."
      );

      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        requestType: formData.requestType,
        priority: formData.priority,
        title: formData.title.trim(),
        description: formData.description.trim(),
        address: formData.address.trim(),
      };

      if (hasLocation) {
        payload.latitude = latitude;
        payload.longitude = longitude;
      }

      if (selectedStation) {
        payload.selectedStation = {
          osmId: selectedStation.id,
          name: selectedStation.name,
          phone: selectedStation.phone,
          address: selectedStation.address,
          distance: selectedStation.distance,
        };
      }

      const data = await createPoliceRequest(payload);

      setRequests((current) => [
        data.request,
        ...current,
      ]);

      setFormData(initialForm);

      toast.success(
        "Police assistance request saved securely."
      );
    } catch (error) {
      console.error(
        "Police request submit error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Police assistance request could not be saved."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const cancelRequest = async (requestId) => {
    const confirmed = window.confirm(
      "Cancel this police assistance request?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(requestId);

      const data = await cancelPoliceRequest(
        requestId
      );

      setRequests((current) =>
        current.map((request) =>
          request.id === requestId
            ? data.request
            : request
        )
      );

      toast.success(data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Request could not be cancelled."
      );
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusClasses = (status) => {
    if (status === "resolved") {
      return "border-green-500/30 bg-green-950/30 text-green-300";
    }

    if (status === "cancelled") {
      return "border-slate-600 bg-slate-800 text-slate-300";
    }

    if (
      status === "assigned" ||
      status === "in-progress" ||
      status === "acknowledged"
    ) {
      return "border-blue-500/30 bg-blue-950/30 text-blue-300";
    }

    return "border-yellow-500/30 bg-yellow-950/30 text-yellow-300";
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

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 xl:grid-cols-[1fr_380px] xl:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-400">
                Public Safety Operations
              </p>

              <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
                Police assistance without the confusion
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
                Find nearby police stations, call emergency
                services, select a station and save a
                structured assistance request to your Rakshak
                account.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-500">
                National emergency
              </p>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold">
                    112
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Immediate danger or emergency
                  </p>
                </div>

                <a
                  href="tel:112"
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-xl transition hover:bg-red-700"
                  aria-label="Call emergency 112"
                >
                  <FaPhoneAlt />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="tel:112"
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold hover:bg-red-700"
            >
              <FaPhoneAlt />
              Emergency 112
            </a>

            <a
              href="tel:1091"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 font-semibold hover:bg-slate-900"
            >
              Women Helpline 1091
            </a>

            <a
              href="tel:1930"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 font-semibold hover:bg-slate-900"
            >
              Cyber Fraud 1930
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
                    Nearby police stations
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Sorted by distance from your current
                    location.
                  </p>
                </div>

                <div className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-300">
                  {locationLoading
                    ? "Locating..."
                    : hasLocation
                      ? `Accuracy ±${Math.round(
                          accuracy || 0
                        )} m`
                      : "Location unavailable"}
                </div>
              </div>

              <div className="relative mt-5">
                <FaSearch className="absolute left-4 top-4 text-slate-500" />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Filter loaded stations by name or area"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 outline-none placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="max-h-[720px] overflow-y-auto p-4 md:p-6">
              {locationLoading || loadingStations ? (
                <div className="flex min-h-64 items-center justify-center">
                  <div className="text-center">
                    <FaSpinner className="mx-auto animate-spin text-4xl text-blue-400" />

                    <p className="mt-4 text-slate-400">
                      Loading nearby stations...
                    </p>
                  </div>
                </div>
              ) : locationError && !hasLocation ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-6">
                  <FaExclamationTriangle className="text-3xl text-red-400" />

                  <p className="mt-4 font-semibold text-red-300">
                    {locationError}
                  </p>
                </div>
              ) : (
                <>
                  {stationError && (
                    <div
                      className={`mb-5 rounded-2xl border p-4 ${
                        usingFallback
                          ? "border-yellow-500/30 bg-yellow-950/20 text-yellow-200"
                          : "border-red-500/30 bg-red-950/20 text-red-300"
                      }`}
                    >
                      <p className="text-sm leading-6">
                        {stationError}
                      </p>

                      <button
                        type="button"
                        onClick={loadStations}
                        className="mt-3 rounded-lg border border-current px-4 py-2 text-sm font-semibold"
                      >
                        Retry live stations
                      </button>
                    </div>
                  )}

                  {filteredStations.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
                      No station matches your current filter.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredStations.map((station) => {
                        const isSelected =
                          selectedStation?.id ===
                          station.id;

                        return (
                          <article
                            key={station.id}
                            className={`rounded-2xl border p-5 transition ${
                              isSelected
                                ? "border-blue-500 bg-blue-950/20"
                                : "border-slate-800 bg-slate-950 hover:border-slate-600"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedStation(
                                  station
                                )
                              }
                              className="w-full text-left"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h3 className="text-lg font-semibold">
                                    {station.name}
                                  </h3>

                                  <p className="mt-2 text-sm leading-6 text-slate-400">
                                    {station.address}
                                  </p>
                                </div>

                                <span className="shrink-0 rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                                  {station.distance}
                                </span>
                              </div>

                              {isSelected && (
                                <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-blue-300">
                                  <FaCheckCircle />
                                  Selected for assistance
                                  request
                                </p>
                              )}
                            </button>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                              <a
                                href={
                                  station.phone
                                    ? `tel:${station.phone}`
                                    : "tel:112"
                                }
                                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold hover:bg-blue-700"
                              >
                                <FaPhoneAlt />
                                {station.phone &&
                                station.phone !== "112"
                                  ? "Call station"
                                  : "Call 112"}
                              </a>

                              <a
                                href={
                                  station.directionsLink
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
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-slate-800 bg-slate-900 p-6 xl:sticky xl:top-24">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                <FaShieldAlt className="text-2xl" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Secure account record
                </p>

                <h2 className="text-xl font-bold">
                  Request police assistance
                </h2>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-yellow-500/30 bg-yellow-950/20 p-4">
              <p className="text-sm leading-6 text-yellow-100/80">
                This creates a Rakshak assistance record.
                It does not register an official police
                complaint or dispatch officers.
              </p>
            </div>

            {selectedStation && (
              <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-950/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                  Selected station
                </p>

                <p className="mt-2 font-semibold">
                  {selectedStation.name}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {selectedStation.distance} away
                </p>
              </div>
            )}

            <form
              onSubmit={submitRequest}
              className="mt-6 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Assistance category
                </label>

                <select
                  name="requestType"
                  value={formData.requestType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                >
                  {REQUEST_TYPES.map((type) => (
                    <option
                      key={type.value}
                      value={type.value}
                    >
                      {type.label}
                    </option>
                  ))}
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
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
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
                  Request title
                </label>

                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={150}
                  placeholder="Briefly describe the situation"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Location or landmark
                </label>

                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  maxLength={300}
                  placeholder="Building, road or landmark"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Incident details
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={2000}
                  rows={6}
                  placeholder="Describe what happened, when it happened and what assistance is required."
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-blue-500"
                />

                <p className="mt-2 text-right text-xs text-slate-500">
                  {formData.description.length}/2000
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Saving request...
                  </>
                ) : (
                  <>
                    Submit assistance request
                    <FaArrowRight />
                  </>
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-xs leading-5 text-slate-500">
              Signed in as {displayName}
            </p>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <FaHistory className="text-2xl text-blue-400" />

              <div>
                <h2 className="text-2xl font-bold">
                  Assistance request history
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Account-specific records and status
                  updates.
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
              Login to view and manage your assistance
              history.
            </div>
          ) : loadingRequests ? (
            <div className="mt-6 flex min-h-40 items-center justify-center">
              <FaSpinner className="animate-spin text-3xl text-blue-400" />
            </div>
          ) : requestError ? (
            <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-950/20 p-5 text-red-300">
              {requestError}
            </div>
          ) : requests.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
              No police assistance requests have been
              saved.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {requests.map((request) => {
                const canCancel = ![
                  "resolved",
                  "cancelled",
                ].includes(request.status);

                return (
                  <article
                    key={request.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {request.title}
                        </h3>

                        <p className="mt-2 text-sm capitalize text-slate-400">
                          {request.requestType.replaceAll(
                            "-",
                            " "
                          )}
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                          request.status
                        )}`}
                      >
                        {request.status.replaceAll(
                          "-",
                          " "
                        )}
                      </span>
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">
                      {request.description}
                    </p>

                    <div className="mt-5 space-y-2 border-t border-slate-800 pt-4 text-sm text-slate-500">
                      <p className="flex items-center gap-2">
                        <FaClock />
                        {formatDate(request.createdAt)}
                      </p>

                      {request.selectedStation?.name && (
                        <p className="flex items-center gap-2">
                          <FaMapMarkerAlt />
                          {
                            request.selectedStation
                              .name
                          }
                        </p>
                      )}
                    </div>

                    {canCancel && (
                      <button
                        type="button"
                        onClick={() =>
                          cancelRequest(request.id)
                        }
                        disabled={
                          cancellingId === request.id
                        }
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-950/30 disabled:opacity-50"
                      >
                        {cancellingId === request.id ? (
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

export default Police;
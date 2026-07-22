import { useEffect, useState } from "react";
import {
  FaBell,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaShieldAlt,
  FaSpinner,
  FaUserFriends,
} from "react-icons/fa";
import toast from "react-hot-toast";

import useGeolocation from "../../hooks/useGeolocation";

import {
  endWomenSafetySession,
  getCurrentWomenSafetySession,
  startWomenSafetySession,
  updateWomenSafetySession,
} from "../../services/womenSafetyService";

function WomenSafetyPanel() {
  const [activeSession, setActiveSession] = useState(null);
  const [isSafetyModeActive, setIsSafetyModeActive] = useState(false);
  const [isTravellingAlone, setIsTravellingAlone] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  const [loadingSession, setLoadingSession] = useState(true);
  const [startingSession, setStartingSession] = useState(false);
  const [endingSession, setEndingSession] = useState(false);
  const [updatingSession, setUpdatingSession] = useState(false);

  const {
    latitude,
    longitude,
    loading: locationLoading,
    error: locationError,
  } = useGeolocation();

  const hasLocation =
    typeof latitude === "number" && typeof longitude === "number";

  useEffect(() => {
    const loadCurrentSession = async () => {
      try {
        setLoadingSession(true);

        const data = await getCurrentWomenSafetySession();

        if (data.session) {
          setActiveSession(data.session);
          setIsSafetyModeActive(true);
          setIsTravellingAlone(
            Boolean(data.session.travellingAlone)
          );
          setIsTracking(Boolean(data.session.trackingActive));
        }
      } catch (error) {
        console.error("Load Women Safety session error:", error);

        toast.error(
          error.response?.data?.message ||
            "Women Safety session load nahi ho paayi."
        );
      } finally {
        setLoadingSession(false);
      }
    };

    loadCurrentSession();
  }, []);

  const activateSafetyMode = async () => {
    if (startingSession || isSafetyModeActive) {
      return;
    }

    try {
      setStartingSession(true);

      const payload = {
        travellingAlone: isTravellingAlone,
        trackingActive: false,
      };

      if (hasLocation) {
        payload.latitude = latitude;
        payload.longitude = longitude;
      }

      const data = await startWomenSafetySession(payload);

      setActiveSession(data.session);
      setIsSafetyModeActive(true);
      setIsTracking(Boolean(data.session.trackingActive));

      toast.success("Women Safety Mode activated and saved.");
    } catch (error) {
      console.error("Activate Women Safety Mode error:", error);

      if (
        error.response?.status === 409 &&
        error.response?.data?.session
      ) {
        const existingSession = error.response.data.session;

        setActiveSession(existingSession);
        setIsSafetyModeActive(true);
        setIsTravellingAlone(
          Boolean(existingSession.travellingAlone)
        );
        setIsTracking(Boolean(existingSession.trackingActive));

        toast.success("Existing active safety session restored.");
        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Women Safety Mode activate nahi ho paya."
      );
    } finally {
      setStartingSession(false);
    }
  };

  const deactivateSafetyMode = async () => {
    if (!activeSession?.id || endingSession) {
      return;
    }

    try {
      setEndingSession(true);

      const data = await endWomenSafetySession(activeSession.id);

      setActiveSession(data.session);
      setIsSafetyModeActive(false);
      setIsTracking(false);

      toast.success("Women Safety session completed.");
    } catch (error) {
      console.error("Deactivate Women Safety Mode error:", error);

      toast.error(
        error.response?.data?.message ||
          "Women Safety session end nahi ho paayi."
      );
    } finally {
      setEndingSession(false);
    }
  };

  const handleTravellingAloneChange = async (event) => {
    const checked = event.target.checked;

    setIsTravellingAlone(checked);

    if (!isSafetyModeActive || !activeSession?.id) {
      return;
    }

    try {
      setUpdatingSession(true);

      const data = await updateWomenSafetySession(
        activeSession.id,
        {
          travellingAlone: checked,
        }
      );

      setActiveSession(data.session);

      toast.success(
        checked
          ? "Travelling-alone monitoring enabled."
          : "Travelling-alone monitoring disabled."
      );
    } catch (error) {
      console.error("Update travelling-alone status error:", error);

      setIsTravellingAlone((current) => !current);

      toast.error(
        error.response?.data?.message ||
          "Travelling-alone status update nahi ho paya."
      );
    } finally {
      setUpdatingSession(false);
    }
  };

  const toggleTracking = async () => {
    if (!isSafetyModeActive || !activeSession?.id) {
      toast.error("Activate Women Safety Mode first.");
      return;
    }

    const nextTrackingStatus = !isTracking;

    try {
      setUpdatingSession(true);

      const payload = {
        trackingActive: nextTrackingStatus,
      };

      if (hasLocation) {
        payload.latitude = latitude;
        payload.longitude = longitude;
      }

      const data = await updateWomenSafetySession(
        activeSession.id,
        payload
      );

      setActiveSession(data.session);
      setIsTracking(Boolean(data.session.trackingActive));

      toast.success(
        nextTrackingStatus
          ? "Live safety tracking started."
          : "Live safety tracking stopped."
      );
    } catch (error) {
      console.error("Toggle safety tracking error:", error);

      toast.error(
        error.response?.data?.message ||
          "Live tracking update nahi ho paayi."
      );
    } finally {
      setUpdatingSession(false);
    }
  };

  const prepareContactAlert = () => {
    if (!isSafetyModeActive) {
      toast.error("Activate Women Safety Mode first.");
      return;
    }

    const contactCount =
      activeSession?.emergencyContactCount || 0;

    if (contactCount === 0) {
      toast.error("No emergency contact is connected.");
      return;
    }

    toast.success(
      `Demo alert prepared for ${contactCount} emergency contact${
        contactCount === 1 ? "" : "s"
      }.`
    );
  };

  const startFakeCall = () => {
    toast.success("Demo fake call started.");
  };

  if (loadingSession) {
    return (
      <section className="flex min-h-96 items-center justify-center rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <div className="text-center">
          <FaSpinner className="mx-auto animate-spin text-4xl text-pink-400" />

          <p className="mt-4 text-slate-400">
            Loading Women Safety session...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:p-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-pink-500/10 p-4 text-pink-400">
            <FaShieldAlt className="text-3xl" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-pink-400">
              Safety Control
            </p>

            <h2 className="mt-1 text-3xl font-bold text-white">
              Protection Dashboard
            </h2>
          </div>
        </div>

        <span
          className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${
            isSafetyModeActive
              ? "border-green-500/30 bg-green-950/30 text-green-300"
              : "border-slate-700 bg-slate-950 text-slate-400"
          }`}
        >
          {isSafetyModeActive
            ? "Safety Mode Active"
            : "Safety Mode Inactive"}
        </span>
      </div>

      <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400">
        Activate a safety session, save current location, enable travel
        monitoring and manage trusted-contact readiness from your Rakshak
        account.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <div className="flex items-start gap-3">
          <FaMapMarkerAlt
            className={`mt-1 ${
              hasLocation ? "text-green-400" : "text-yellow-400"
            }`}
          />

          <div>
            <p className="font-semibold text-white">
              Current Location Status
            </p>

            <p className="mt-1 text-sm text-slate-400">
              {locationLoading
                ? "Detecting current location..."
                : hasLocation
                  ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                  : locationError ||
                    "Location unavailable. Safety mode can still start."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={
            isSafetyModeActive
              ? deactivateSafetyMode
              : activateSafetyMode
          }
          disabled={startingSession || endingSession}
          className={`flex items-center justify-center gap-2 rounded-2xl px-5 py-4 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
            isSafetyModeActive
              ? "bg-slate-700 hover:bg-slate-600"
              : "bg-pink-600 hover:bg-pink-700"
          }`}
        >
          {startingSession || endingSession ? (
            <>
              <FaSpinner className="animate-spin" />
              {startingSession
                ? "Activating Safety Mode..."
                : "Ending Safety Session..."}
            </>
          ) : isSafetyModeActive ? (
            "Deactivate Safety Mode"
          ) : (
            "Activate Safety Mode"
          )}
        </button>

        <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
          <span>
            <span className="block font-semibold text-white">
              Travelling Alone
            </span>

            <span className="mt-1 block text-sm text-slate-500">
              Enable additional safety monitoring
            </span>
          </span>

          <input
            type="checkbox"
            checked={isTravellingAlone}
            onChange={handleTravellingAloneChange}
            disabled={updatingSession}
            className="h-5 w-5 accent-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-2xl text-blue-400" />

            <h3 className="text-lg font-bold text-white">
              Live Safety Tracking
            </h3>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Save live-tracking status and the latest available location in your
            active safety session.
          </p>

          <button
            type="button"
            onClick={toggleTracking}
            disabled={updatingSession || !isSafetyModeActive}
            className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
              isTracking
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {updatingSession ? (
              <>
                <FaSpinner className="animate-spin" />
                Updating...
              </>
            ) : isTracking ? (
              "Stop Live Tracking"
            ) : (
              "Start Live Tracking"
            )}
          </button>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <div className="flex items-center gap-3">
            <FaUserFriends className="text-2xl text-purple-400" />

            <h3 className="text-lg font-bold text-white">
              Trusted Contacts
            </h3>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Prepare a demo notification for the contacts linked with this
            account.
          </p>

          <p className="mt-3 text-sm font-semibold text-purple-300">
            {activeSession?.emergencyContactCount || 0} contact
            {(activeSession?.emergencyContactCount || 0) === 1
              ? ""
              : "s"}{" "}
            connected
          </p>

          <button
            type="button"
            onClick={prepareContactAlert}
            className="mt-5 w-full rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            Prepare Demo Alert
          </button>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <div className="flex items-center gap-3">
            <FaPhoneAlt className="text-2xl text-green-400" />

            <h3 className="text-lg font-bold text-white">
              Fake Call
            </h3>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Start a demo incoming-call workflow for uncomfortable situations.
          </p>

          <button
            type="button"
            onClick={startFakeCall}
            className="mt-5 w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Start Demo Fake Call
          </button>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <div className="flex items-center gap-3">
            <FaBell className="text-2xl text-yellow-400" />

            <h3 className="text-lg font-bold text-white">
              Emergency Helpline
            </h3>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Call the national women helpline or national emergency service
            directly.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <a
              href="tel:1091"
              className="rounded-xl border border-pink-500/30 px-4 py-3 text-center font-semibold text-pink-300 transition hover:bg-pink-950/30"
            >
              Call 1091
            </a>

            <a
              href="tel:112"
              className="rounded-xl bg-red-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-red-700"
            >
              Call 112
            </a>
          </div>
        </article>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-5">
        <h3 className="text-lg font-bold text-white">
          Safety Readiness Status
        </h3>

        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <FaCheckCircle
              className={
                isSafetyModeActive
                  ? "text-green-400"
                  : "text-slate-600"
              }
            />
            Safety session stored in MongoDB
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-300">
            <FaCheckCircle
              className={
                isTracking ? "text-green-400" : "text-slate-600"
              }
            />
            Live tracking status active
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-300">
            <FaCheckCircle
              className={
                isTravellingAlone
                  ? "text-green-400"
                  : "text-slate-600"
              }
            />
            Travelling-alone monitoring enabled
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-300">
            <FaCheckCircle
              className={
                hasLocation ? "text-green-400" : "text-slate-600"
              }
            />
            Current location available
          </div>
        </div>
      </div>

      {activeSession?.id && isSafetyModeActive && (
        <div className="mt-6 rounded-2xl border border-pink-500/20 bg-pink-950/20 p-5">
          <p className="text-sm font-semibold uppercase tracking-wider text-pink-300">
            Active Session
          </p>

          <p className="mt-2 break-all text-sm text-slate-400">
            Session ID: {activeSession.id}
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Police workflow:{" "}
            {activeSession.policeMonitoringStatus ||
              "Demo monitoring prepared"}
          </p>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-yellow-500/30 bg-yellow-950/20 p-4">
        <p className="text-sm font-semibold text-yellow-200">
          Demo integration
        </p>

        <p className="mt-1 text-sm leading-6 text-yellow-100/70">
          Women Safety sessions and status are saved in MongoDB. Official police
          monitoring, background GPS tracking and automatic messages are not
          active yet.
        </p>
      </div>
    </section>
  );
}

export default WomenSafetyPanel;
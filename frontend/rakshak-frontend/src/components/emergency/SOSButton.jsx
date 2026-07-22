import { useCallback, useState } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaShieldAlt,
  FaSpinner,
} from "react-icons/fa";
import toast from "react-hot-toast";

import EmergencyModal from "./EmergencyModal";
import useGeolocation from "../../hooks/useGeolocation";
import { createEmergency } from "../../services/emergencyService";

function SOSButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [savedEmergency, setSavedEmergency] = useState(null);

  const { latitude, longitude, loading, error } = useGeolocation();

  const location =
    typeof latitude === "number" && typeof longitude === "number"
      ? { latitude, longitude }
      : null;

  const mapsLink = location
    ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
    : "";

  const openModal = () => {
    if (isActivated || isActivating) {
      return;
    }

    if (!location) {
      toast.error(
        "Current location available nahi hai. Location permission allow karo."
      );
      return;
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isActivating) {
      return;
    }

    setIsModalOpen(false);
  };

  const activateSOS = useCallback(async () => {
    if (isActivating || isActivated) {
      return;
    }

    if (!location) {
      setIsModalOpen(false);
      toast.error(
        "SOS record save karne ke liye current location required hai."
      );
      return;
    }

    try {
      setIsActivating(true);
      setIsModalOpen(false);

      const data = await createEmergency({
        type: "SOS",
        latitude: location.latitude,
        longitude: location.longitude,
        nearestPoliceStation: {
          name: "Nearest police station",
          status: "Demo alert prepared",
        },
        message: "Emergency assistance requested through Rakshak India.",
      });

      setSavedEmergency(data.emergency);
      setIsActivated(true);

      toast.success("SOS activated and saved securely.");
    } catch (activationError) {
      console.error("SOS activation error:", activationError);

      const message =
        activationError.response?.data?.message ||
        "SOS record save nahi ho paya. Please call 112.";

      toast.error(message);
    } finally {
      setIsActivating(false);
    }
  }, [isActivated, isActivating, location]);

  const copyEmergencyLocation = async () => {
    if (!mapsLink) {
      toast.error("Location available nahi hai.");
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(mapsLink);
      } else {
        const textArea = document.createElement("textarea");

        textArea.value = mapsLink;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";

        document.body.appendChild(textArea);
        textArea.select();

        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      toast.success("Emergency location copied.");
    } catch (copyError) {
      console.error("Copy location error:", copyError);
      toast.error("Location copy nahi ho paayi.");
    }
  };

  const resetSOS = () => {
    setIsActivated(false);
    setSavedEmergency(null);

    toast.success(
      "SOS panel reset ho gaya. Database history record safe rahega."
    );
  };

  return (
    <>
      <div className="w-full max-w-md text-center">
        {!isActivated ? (
          <>
            <button
              type="button"
              onClick={openModal}
              disabled={isActivating || loading}
              className="group relative mx-auto flex h-44 w-44 items-center justify-center rounded-full border-8 border-red-500/20 bg-red-600 text-white shadow-2xl shadow-red-950/60 transition hover:scale-105 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Activate emergency SOS"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-red-500/20" />

              <span className="relative flex flex-col items-center">
                {isActivating ? (
                  <FaSpinner className="animate-spin text-4xl" />
                ) : (
                  <FaExclamationTriangle className="text-4xl" />
                )}

                <span className="mt-2 text-3xl font-black tracking-wider">
                  SOS
                </span>

                <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-red-100">
                  Emergency
                </span>
              </span>
            </button>

            <p className="mt-5 text-sm leading-6 text-slate-400">
              Press the SOS button to start a 5-second emergency confirmation.
            </p>

            {loading && (
              <p className="mt-3 text-sm text-yellow-400">
                Detecting your location...
              </p>
            )}

            {!loading && location && (
              <p className="mt-3 text-sm text-green-400">
                Location is ready. SOS record can be saved securely.
              </p>
            )}

            {!loading && error && (
              <p className="mt-3 text-sm text-red-400">
                Location unavailable. Browser permission allow karo.
              </p>
            )}

            {isActivating && (
              <p className="mt-4 text-sm text-yellow-400">
                Saving SOS event to your Rakshak account...
              </p>
            )}
          </>
        ) : (
          <div className="rounded-3xl border border-red-500/40 bg-red-950/20 p-6 text-left">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 text-white">
                <FaShieldAlt className="text-3xl" />
              </div>

              <h3 className="mt-4 text-2xl font-bold text-white">
                SOS Activated
              </h3>

              <p className="mt-2 text-sm text-red-200">
                Emergency event has been securely saved to your account.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4">
                <FaCheckCircle className="mt-1 shrink-0 text-green-400" />

                <div>
                  <p className="font-semibold text-white">Location captured</p>

                  <p className="mt-1 text-sm text-slate-400">
                    {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4">
                <FaCheckCircle className="mt-1 shrink-0 text-green-400" />

                <div>
                  <p className="font-semibold text-white">
                    Emergency history saved
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Record ID: {savedEmergency?.id || "Saved"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4">
                <FaCheckCircle className="mt-1 shrink-0 text-green-400" />

                <div>
                  <p className="font-semibold text-white">
                    Emergency contacts counted
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {savedEmergency?.emergencyContactCount ?? 0} trusted contact
                    {savedEmergency?.emergencyContactCount === 1 ? "" : "s"}{" "}
                    connected to this account.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4">
                <FaCheckCircle className="mt-1 shrink-0 text-green-400" />

                <div>
                  <p className="font-semibold text-white">
                    Nearest police station identified
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {savedEmergency?.nearestPoliceStation?.status ||
                      "Demo alert prepared"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-yellow-500/30 bg-yellow-950/20 p-4">
                <FaExclamationTriangle className="mt-1 shrink-0 text-yellow-400" />

                <div>
                  <p className="font-semibold text-yellow-200">Demo dispatch</p>

                  <p className="mt-1 text-sm text-yellow-100/70">
                    SOS history database me save hui hai, lekin official police
                    dispatch ya automatic message abhi send nahi hua.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={copyEmergencyLocation}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                <FaMapMarkerAlt />
                Copy Emergency Location
              </button>

              <a
                href="tel:112"
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                <FaPhoneAlt />
                Call Emergency 112
              </a>

              <button
                type="button"
                onClick={resetSOS}
                className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                Reset SOS Panel
              </button>
            </div>
          </div>
        )}
      </div>

      <EmergencyModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={activateSOS}
        location={location}
        locationLoading={loading}
      />
    </>
  );
}

export default SOSButton;
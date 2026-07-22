import { useEffect, useState } from "react";
import {
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTimes,
} from "react-icons/fa";

function EmergencyModal({
  isOpen,
  onClose,
  onConfirm,
  location,
  locationLoading,
}) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      return;
    }

    const timer = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && countdown === 0) {
      onConfirm();
    }
  }, [countdown, isOpen, onConfirm]);

  if (!isOpen) {
    return null;
  }

  const locationReady =
    typeof location?.latitude === "number" &&
    typeof location?.longitude === "number";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-red-500/40 bg-slate-950 shadow-2xl shadow-red-950/50">
        <div className="border-b border-red-500/20 bg-red-950/40 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-900/40">
                <FaExclamationTriangle className="text-2xl" />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-red-300">
                  Emergency confirmation
                </p>

                <h2
                  id="emergency-modal-title"
                  className="mt-1 text-2xl font-bold text-white"
                >
                  Activate SOS?
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-3 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              aria-label="Cancel emergency"
            >
              <FaTimes />
            </button>
          </div>

          <p className="mt-5 leading-7 text-slate-300">
            Emergency alert automatically activate hone wala hai. Galti se
            button press hua hai to turant cancel karein.
          </p>
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-8 border-red-500/20 bg-red-600/10">
              <span className="text-6xl font-black text-red-400">
                {countdown}
              </span>
            </div>

            <p className="mt-4 text-center text-sm text-slate-400">
              SOS will activate automatically in {countdown} second
              {countdown === 1 ? "" : "s"}.
            </p>
          </div>

          <div className="mt-7 space-y-3">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <FaMapMarkerAlt className="shrink-0 text-blue-400" />

              <div>
                <p className="font-semibold text-white">Current location</p>

                <p className="mt-1 text-sm text-slate-400">
                  {locationLoading
                    ? "Detecting your location..."
                    : locationReady
                      ? `${location.latitude.toFixed(
                          6
                        )}, ${location.longitude.toFixed(6)}`
                      : "Location is currently unavailable"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <FaPhoneAlt className="shrink-0 text-green-400" />

              <div>
                <p className="font-semibold text-white">
                  Emergency assistance
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  The emergency event will be recorded securely. Calling and
                  messaging integrations will be added separately.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Cancel SOS
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
            >
              Activate Now
            </button>
          </div>

          <a
            href="tel:112"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/40 px-5 py-3 font-semibold text-red-300 transition hover:bg-red-950/40"
          >
            <FaPhoneAlt />
            Call National Emergency 112
          </a>
        </div>
      </div>
    </div>
  );
}

export default EmergencyModal;
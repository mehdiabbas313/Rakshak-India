import {
  FaCopy,
  FaCrosshairs,
  FaExternalLinkAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";

import useGeolocation from "../../hooks/useGeolocation";
import LocationMap from "./LocationMap";

function LiveLocation() {
  const { latitude, longitude, loading, error } = useGeolocation();

  const hasLocation =
    typeof latitude === "number" && typeof longitude === "number";

  const location = hasLocation
    ? {
        latitude,
        longitude,
      }
    : null;

  const googleMapsLink = hasLocation
    ? `https://www.google.com/maps?q=${latitude},${longitude}`
    : "";

  const fallbackCopy = (text) => {
    const textArea = document.createElement("textarea");

    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "-9999px";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const copied = document.execCommand("copy");

    document.body.removeChild(textArea);

    if (!copied) {
      throw new Error("Fallback copy failed");
    }
  };

  const copyLocation = async () => {
    if (!hasLocation) {
      toast.error("Location abhi available nahi hai.");
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(googleMapsLink);
      } else {
        fallbackCopy(googleMapsLink);
      }

      toast.success("Location link copied successfully.");
    } catch (error) {
      console.error("Copy error:", error);

      try {
        fallbackCopy(googleMapsLink);
        toast.success("Location link copied successfully.");
      } catch (fallbackError) {
        console.error("Fallback copy error:", fallbackError);
        toast.error("Location link copy nahi ho paayi.");
      }
    }
  };

  const openInMaps = () => {
    if (!hasLocation) {
      toast.error("Location abhi available nahi hai.");
      return;
    }

    window.open(googleMapsLink, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:p-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
              <FaMapMarkerAlt className="text-2xl" />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                Live GPS
              </p>

              <h2 className="mt-1 text-2xl font-bold text-white">
                Current Location
              </h2>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
            Your current location is detected through your browser and can be
            shared securely during an emergency.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              hasLocation
                ? "bg-green-400"
                : loading
                  ? "animate-pulse bg-yellow-400"
                  : "bg-red-400"
            }`}
          />

          <span className="text-slate-300">
            {hasLocation
              ? "Location ready"
              : loading
                ? "Detecting location"
                : "Location unavailable"}
          </span>
        </div>
      </div>

      {loading && (
        <div className="mt-8 flex min-h-48 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950">
          <div className="text-center">
            <FaCrosshairs className="mx-auto animate-spin text-3xl text-blue-400" />

            <p className="mt-4 text-slate-300">
              Detecting your current location...
            </p>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="mt-8 rounded-2xl border border-red-500/40 bg-red-950/40 p-5">
          <h3 className="font-semibold text-red-300">
            Unable to access location
          </h3>

          <p className="mt-2 text-sm text-red-200">{error}</p>

          <p className="mt-3 text-sm text-slate-400">
            Address bar ke paas location permission ko Allow karke page refresh
            karo.
          </p>
        </div>
      )}

      {!loading && hasLocation && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-400">Latitude</p>

              <p className="mt-2 break-all text-lg font-semibold text-white">
                {latitude.toFixed(6)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-400">Longitude</p>

              <p className="mt-2 break-all text-lg font-semibold text-white">
                {longitude.toFixed(6)}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={copyLocation}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              <FaCopy />
              Copy Location Link
            </button>

            <button
              type="button"
              onClick={openInMaps}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              <FaExternalLinkAlt />
              Open in Maps
            </button>
          </div>

          <div className="mt-6">
            <LocationMap location={location} />
          </div>
        </>
      )}
    </section>
  );
}

export default LiveLocation;
import { useEffect, useState } from "react";
import {
  FaBell,
  FaDirections,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRedo,
  FaShieldAlt,
  FaSpinner,
} from "react-icons/fa";
import toast from "react-hot-toast";

import useGeolocation from "../../hooks/useGeolocation";
import { getNearbyPoliceStations } from "../../services/mapService";

function NearbyPolice() {
  const [stations, setStations] = useState([]);
  const [loadingStations, setLoadingStations] = useState(false);
  const [stationError, setStationError] = useState("");

  const {
    latitude,
    longitude,
    loading: locationLoading,
    error: locationError,
  } = useGeolocation();

  const hasLocation =
    typeof latitude === "number" && typeof longitude === "number";

  const loadStations = async () => {
    if (!hasLocation) {
      return;
    }

    try {
      setLoadingStations(true);
      setStationError("");

      const data = await getNearbyPoliceStations(
        latitude,
        longitude
      );

      setStations(data.slice(0, 5));
    } catch (error) {
      console.error("Nearby police error:", error);

      setStationError(
        "Nearby police stations load nahi ho paaye. Please try again."
      );
    } finally {
      setLoadingStations(false);
    }
  };

  useEffect(() => {
    loadStations();
  }, [latitude, longitude]);

  const sendDemoAlert = (stationName) => {
    toast.success(`Demo alert prepared for ${stationName}.`);
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
            <FaShieldAlt className="text-2xl" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Police Assistance
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              Nearby Police Stations
            </h2>
          </div>
        </div>

        <span className="rounded-full border border-green-500/30 bg-green-950/30 px-3 py-1 text-xs font-semibold text-green-300">
          Live Data
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-400">
        Police stations are searched near your current GPS location using
        OpenStreetMap data.
      </p>

      {locationLoading && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 text-slate-400">
          <FaSpinner className="animate-spin text-blue-400" />
          Detecting current location...
        </div>
      )}

      {!locationLoading && locationError && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-300">
          {locationError}
        </div>
      )}

      {loadingStations && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 text-slate-400">
          <FaSpinner className="animate-spin text-blue-400" />
          Searching nearby police stations...
        </div>
      )}

      {!loadingStations && stationError && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-950/30 p-4">
          <p className="text-sm text-red-300">{stationError}</p>

          <button
            type="button"
            onClick={loadStations}
            className="mt-4 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
          >
            <FaRedo />
            Try Again
          </button>
        </div>
      )}

      {!loadingStations &&
        !stationError &&
        hasLocation &&
        stations.length === 0 && (
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-400">
            No mapped police station was found within the current search
            radius.
          </div>
        )}

      <div className="mt-6 space-y-4">
        {stations.map((station) => (
          <article
            key={station.id}
            className="rounded-2xl border border-slate-800 bg-slate-950 p-5 transition hover:border-blue-500/60"
          >
            <h3 className="text-lg font-bold text-white">
              {station.name}
            </h3>

            <div className="mt-4 flex items-start gap-2 text-sm text-slate-400">
              <FaMapMarkerAlt className="mt-1 shrink-0 text-blue-400" />

              <div>
                <p>{station.distance} away</p>
                <p className="mt-1">{station.address}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
              <FaPhoneAlt className="text-green-400" />
              <span>{station.phone || "Phone not available"}</span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {station.phone ? (
                <a
                  href={`tel:${station.phone}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  <FaPhoneAlt />
                  Call Station
                </a>
              ) : (
                <a
                  href="tel:112"
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  <FaPhoneAlt />
                  Call 112
                </a>
              )}

              <a
                href={station.directionsLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                <FaDirections />
                Directions
              </a>
            </div>

            <button
              type="button"
              onClick={() => sendDemoAlert(station.name)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-yellow-500/30 bg-yellow-950/20 px-4 py-3 font-semibold text-yellow-200 transition hover:bg-yellow-950/40"
            >
              <FaBell />
              Prepare Demo Alert
            </button>
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-yellow-500/30 bg-yellow-950/20 p-4">
        <p className="text-sm font-semibold text-yellow-200">
          Demo dispatch
        </p>

        <p className="mt-1 text-sm leading-6 text-yellow-100/70">
          Station data is live, but Prepare Demo Alert does not notify police.
        </p>
      </div>
    </section>
  );
}

export default NearbyPolice;
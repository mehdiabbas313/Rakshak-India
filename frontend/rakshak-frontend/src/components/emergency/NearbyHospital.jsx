import { useEffect, useState } from "react";
import {
  FaDirections,
  FaHospital,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRedo,
  FaSpinner,
} from "react-icons/fa";

import useGeolocation from "../../hooks/useGeolocation";
import { getNearbyHospitals } from "../../services/mapService";

function NearbyHospital() {
  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [hospitalError, setHospitalError] = useState("");

  const {
    latitude,
    longitude,
    loading: locationLoading,
    error: locationError,
  } = useGeolocation();

  const hasLocation =
    typeof latitude === "number" && typeof longitude === "number";

  const loadHospitals = async () => {
    if (!hasLocation) {
      return;
    }

    try {
      setLoadingHospitals(true);
      setHospitalError("");

      const data = await getNearbyHospitals(
        latitude,
        longitude
      );

      setHospitals(data.slice(0, 5));
    } catch (error) {
      console.error("Nearby hospitals error:", error);

      setHospitalError(
        "Nearby hospitals load nahi ho paaye. Please try again."
      );
    } finally {
      setLoadingHospitals(false);
    }
  };

  useEffect(() => {
    loadHospitals();
  }, [latitude, longitude]);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-green-500/10 p-3 text-green-400">
            <FaHospital className="text-2xl" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-green-400">
              Medical Assistance
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              Nearby Hospitals
            </h2>
          </div>
        </div>

        <span className="rounded-full border border-green-500/30 bg-green-950/30 px-3 py-1 text-xs font-semibold text-green-300">
          Live Data
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-400">
        Hospitals are searched near your current GPS location using
        OpenStreetMap data.
      </p>

      {locationLoading && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 text-slate-400">
          <FaSpinner className="animate-spin text-green-400" />
          Detecting current location...
        </div>
      )}

      {!locationLoading && locationError && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-300">
          {locationError}
        </div>
      )}

      {loadingHospitals && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 text-slate-400">
          <FaSpinner className="animate-spin text-green-400" />
          Searching nearby hospitals...
        </div>
      )}

      {!loadingHospitals && hospitalError && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-950/30 p-4">
          <p className="text-sm text-red-300">{hospitalError}</p>

          <button
            type="button"
            onClick={loadHospitals}
            className="mt-4 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
          >
            <FaRedo />
            Try Again
          </button>
        </div>
      )}

      {!loadingHospitals &&
        !hospitalError &&
        hasLocation &&
        hospitals.length === 0 && (
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-400">
            No mapped hospital was found within the current search radius.
          </div>
        )}

      <div className="mt-6 space-y-4">
        {hospitals.map((hospital) => (
          <article
            key={hospital.id}
            className="rounded-2xl border border-slate-800 bg-slate-950 p-5 transition hover:border-green-500/60"
          >
            <h3 className="text-lg font-bold text-white">
              {hospital.name}
            </h3>

            <div className="mt-4 flex items-start gap-2 text-sm text-slate-400">
              <FaMapMarkerAlt className="mt-1 shrink-0 text-green-400" />

              <div>
                <p>{hospital.distance} away</p>
                <p className="mt-1">{hospital.address}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
              <FaPhoneAlt className="text-green-400" />
              <span>{hospital.phone || "Phone not available"}</span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {hospital.phone ? (
                <a
                  href={`tel:${hospital.phone}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  <FaPhoneAlt />
                  Call Hospital
                </a>
              ) : (
                <a
                  href="tel:108"
                  className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  <FaPhoneAlt />
                  Call Ambulance 108
                </a>
              )}

              <a
                href={hospital.directionsLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                <FaDirections />
                Directions
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default NearbyHospital;
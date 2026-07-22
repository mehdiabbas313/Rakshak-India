import { useState } from "react";
import {
  FaCheckCircle,
  FaDirections,
  FaExclamationTriangle,
  FaMapMarkedAlt,
  FaRoute,
} from "react-icons/fa";
import toast from "react-hot-toast";

function SafeRoute() {
  const [routeMonitoring, setRouteMonitoring] = useState(false);
  const [destination, setDestination] = useState("");
  const [routeStatus, setRouteStatus] = useState("Not started");

  const startRouteMonitoring = () => {
    if (!destination.trim()) {
      toast.error("Please enter a destination first.");
      return;
    }

    setRouteMonitoring(true);
    setRouteStatus("Monitoring active");
    toast.success("Demo safe-route monitoring started.");
  };

  const stopRouteMonitoring = () => {
    setRouteMonitoring(false);
    setRouteStatus("Monitoring stopped");
    toast.success("Demo safe-route monitoring stopped.");
  };

  const simulateDeviation = () => {
    if (!routeMonitoring) {
      toast.error("Start route monitoring first.");
      return;
    }

    setRouteStatus("Route deviation detected");
    toast.error("Demo route deviation detected.");
  };

  const openDirections = () => {
    if (!destination.trim()) {
      toast.error("Please enter a destination first.");
      return;
    }

    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      destination.trim()
    )}`;

    window.open(directionsUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
          <FaRoute className="text-2xl" />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Travel Protection
          </p>

          <h2 className="mt-1 text-2xl font-bold text-white">
            Safe Route Monitor
          </h2>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-400">
        Enter a destination and simulate route monitoring during travel.
      </p>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Destination
        </label>

        <input
          type="text"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          placeholder="Example: Pari Chowk, Greater Noida"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
        />
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Route status</p>

            <p
              className={`mt-1 font-semibold ${
                routeStatus === "Route deviation detected"
                  ? "text-red-400"
                  : routeMonitoring
                    ? "text-green-400"
                    : "text-slate-300"
              }`}
            >
              {routeStatus}
            </p>
          </div>

          {routeStatus === "Route deviation detected" ? (
            <FaExclamationTriangle className="text-2xl text-red-400" />
          ) : (
            <FaCheckCircle
              className={`text-2xl ${
                routeMonitoring ? "text-green-400" : "text-slate-600"
              }`}
            />
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {!routeMonitoring ? (
          <button
            type="button"
            onClick={startRouteMonitoring}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <FaMapMarkedAlt />
            Start Route Monitoring
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRouteMonitoring}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-700 px-5 py-3 font-semibold text-white transition hover:bg-slate-600"
          >
            Stop Route Monitoring
          </button>
        )}

        <button
          type="button"
          onClick={openDirections}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
        >
          <FaDirections />
          Open Directions
        </button>

        <button
          type="button"
          onClick={simulateDeviation}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-yellow-500/30 bg-yellow-950/20 px-5 py-3 font-semibold text-yellow-200 transition hover:bg-yellow-950/40"
        >
          <FaExclamationTriangle />
          Simulate Route Deviation
        </button>
      </div>

      <div className="mt-5 rounded-xl border border-yellow-500/30 bg-yellow-950/20 p-4">
        <p className="text-sm font-semibold text-yellow-200">
          Demo mode
        </p>

        <p className="mt-1 text-sm leading-6 text-yellow-100/70">
          Route monitoring and deviation detection are simulated. No background
          tracking or official alert is active.
        </p>
      </div>
    </section>
  );
}

export default SafeRoute;
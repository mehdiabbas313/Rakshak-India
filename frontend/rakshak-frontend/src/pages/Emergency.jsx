import EmergencyDashboard from "../components/emergency/EmergencyDashboard";

function Emergency() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">

        <h1 className="mb-3 text-center text-5xl font-bold">
          🚨 Emergency Dashboard
        </h1>

        <p className="mb-10 text-center text-slate-400">
          Get immediate access to emergency services, live location, nearby
          police stations, hospitals and emergency support.
        </p>

        <EmergencyDashboard />

      </div>
    </div>
  );
}

export default Emergency;
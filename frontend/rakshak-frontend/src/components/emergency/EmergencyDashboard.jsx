import SOSButton from "./SOSButton";
import LiveLocation from "./LiveLocation";
import NearbyHospital from "./NearbyHospital";
import NearbyPolice from "./NearbyPolice";
import EmergencyContacts from "./EmergencyContacts";

function EmergencyDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6">
          <section className="rounded-2xl border border-red-500/20 bg-slate-900 p-6 shadow-xl">
            <h2 className="mb-5 text-2xl font-bold text-white">
              Emergency SOS
            </h2>

            <div className="flex justify-center">
              <SOSButton />
            </div>

            <p className="mt-5 text-center text-sm text-slate-400">
              Press the SOS button only during a real emergency.
            </p>
          </section>

          <EmergencyContacts />

          <NearbyPolice />

          <NearbyHospital />
        </div>

        <div className="lg:col-span-2">
          <LiveLocation />
        </div>
      </div>
    </div>
  );
}

export default EmergencyDashboard;
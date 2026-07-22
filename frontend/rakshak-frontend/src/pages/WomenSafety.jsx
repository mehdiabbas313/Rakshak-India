import WomenSafetyPanel from "../components/women/WomenSafetyPanel";
import SafeRoute from "../components/women/SafeRoute";
import VoiceSOS from "../components/women/VoiceSOS";

function WomenSafety() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-pink-500/20 bg-gradient-to-r from-slate-900 via-pink-950/20 to-slate-900 p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-pink-400">
            Personal Safety
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Women Safety Mode
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-slate-300">
            Activate live safety monitoring, voice-triggered SOS, trusted
            contact readiness, route monitoring and emergency assistance from
            one secure dashboard.
          </p>

          <div className="mt-6 rounded-2xl border border-yellow-500/30 bg-yellow-950/20 p-4">
            <p className="font-semibold text-yellow-200">Demo mode</p>

            <p className="mt-1 text-sm leading-6 text-yellow-100/70">
              This module currently simulates safety workflows. No official
              police alert or automatic emergency message is sent.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <WomenSafetyPanel />
          </div>

          <div className="space-y-8">
            <VoiceSOS />
            <SafeRoute />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WomenSafety;
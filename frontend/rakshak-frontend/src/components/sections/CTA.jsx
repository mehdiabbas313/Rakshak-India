import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="bg-slate-950 px-6 py-20">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center shadow-xl">
        <h2 className="text-4xl font-bold text-white">
          Need Emergency Help?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
          Get instant access to SOS, nearby hospitals, police stations,
          legal assistance, and AI-powered emergency guidance.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/emergency"
            className="rounded-xl bg-red-600 px-8 py-4 font-semibold text-white hover:bg-red-700"
          >
            Emergency SOS
          </Link>

          <Link
            to="/register"
            className="rounded-xl border border-slate-600 px-8 py-4 font-semibold text-white hover:bg-slate-800"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTA;
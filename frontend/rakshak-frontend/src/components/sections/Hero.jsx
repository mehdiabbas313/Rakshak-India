import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-slate-950 px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="mb-6 font-bold uppercase tracking-widest text-blue-400">
          AI Powered Public Safety
        </p>

        <h1 className="max-w-3xl text-5xl font-bold leading-tight md:text-7xl">
          Emergency Response Made Faster.
        </h1>

        <p className="mt-8 max-w-2xl text-xl text-slate-300">
          AI-Powered Emergency Response & Public Safety Platform
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            to="/emergency"
            className="rounded-xl bg-red-600 px-8 py-4 font-semibold text-white hover:bg-red-700"
          >
            Emergency SOS
          </Link>

          <Link
            to="/police"
            className="rounded-xl border border-slate-600 px-8 py-4 font-semibold text-white hover:bg-slate-800"
          >
            Explore Platform
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
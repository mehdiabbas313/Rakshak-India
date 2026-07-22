import { Link } from "react-router-dom";
import {
  FaBalanceScale,
  FaFileAlt,
  FaFireExtinguisher,
  FaHistory,
  FaHospital,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaShieldAlt,
  FaUserFriends,
  FaVenus,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const displayName =
    user?.fullName ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "Rakshak User";

  const cards = [
    {
      title: "Emergency SOS",
      description:
        "Activate an emergency alert and securely record your current location.",
      icon: <FaShieldAlt className="text-3xl text-red-400" />,
      link: "/emergency",
      button: "Open SOS",
    },
    {
      title: "SOS History",
      description:
        "View saved emergency records, locations and their current status.",
      icon: <FaHistory className="text-3xl text-rose-400" />,
      link: "/sos-history",
      button: "View History",
    },
    {
      title: "Women Safety",
      description:
        "Access safe-route monitoring, voice SOS and personal safety tools.",
      icon: <FaVenus className="text-3xl text-pink-400" />,
      link: "/women-safety",
      button: "Open Safety Mode",
    },
    {
  title: "Women Safety History",
  description:
    "View previous safety sessions, saved locations and monitoring status.",
  icon: <FaHistory className="text-3xl text-pink-300" />,
  link: "/women-safety-history",
  button: "View Safety History",
},
    {
      title: "Nearby Police",
      description:
        "Find police assistance, nearby stations and emergency helplines.",
      icon: <FaShieldAlt className="text-3xl text-blue-400" />,
      link: "/police",
      button: "Find Police",
    },
    {
      title: "Nearby Hospitals",
      description:
        "Access hospitals, ambulance information and medical support.",
      icon: <FaHospital className="text-3xl text-green-400" />,
      link: "/hospital",
      button: "Find Hospital",
    },
    {
      title: "Fire Services",
      description:
        "Access fire emergency assistance and important contact numbers.",
      icon: <FaFireExtinguisher className="text-3xl text-orange-400" />,
      link: "/emergency",
      button: "Fire Help",
    },
    {
      title: "Online FIR",
      description:
        "Prepare a structured digital complaint draft with supporting details.",
      icon: <FaFileAlt className="text-3xl text-cyan-400" />,
      link: "/fir",
      button: "Prepare FIR",
    },
    {
      title: "FIR History",
      description:
        "View saved complaint drafts, FIR references and complaint records.",
      icon: <FaHistory className="text-3xl text-cyan-300" />,
      link: "/fir-history",
      button: "View FIR History",
    },
    {
      title: "Legal Help",
      description:
        "Access legal rights, guidance and emergency legal resources.",
      icon: <FaBalanceScale className="text-3xl text-yellow-400" />,
      link: "/lawyer",
      button: "Get Legal Help",
    },
    {
      title: "Live Location",
      description:
        "View, copy and securely share your current location during emergencies.",
      icon: <FaMapMarkerAlt className="text-3xl text-pink-400" />,
      link: "/emergency",
      button: "Share Location",
    },
    {
      title: "Emergency Contacts",
      description:
        "Add and manage trusted contacts stored securely in your account.",
      icon: <FaUserFriends className="text-3xl text-purple-400" />,
      link: "/emergency",
      button: "Manage Contacts",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 to-blue-950 p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Rakshak Safety Dashboard
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Welcome, {displayName}
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            Access emergency services, live location, safety tools and trusted
            support from one secure dashboard.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/emergency"
              className="rounded-xl bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-700"
            >
              Activate Emergency SOS
            </Link>

            <Link
              to="/sos-history"
              className="rounded-xl border border-red-500/40 bg-red-950/20 px-6 py-3 font-semibold text-red-200 transition hover:bg-red-950/40"
            >
              View SOS History
            </Link>

            <Link
              to="/profile"
              className="rounded-xl border border-slate-600 px-6 py-3 font-semibold transition hover:bg-slate-800"
            >
              View Profile
            </Link>
          </div>
        </section>

        <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <article
              key={card.title}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-blue-500"
            >
              <div className="mb-5">{card.icon}</div>

              <h2 className="text-xl font-bold">{card.title}</h2>

              <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">
                {card.description}
              </p>

              <Link
                to={card.link}
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 font-semibold transition hover:bg-blue-600"
              >
                <FaPhoneAlt className="text-sm" />
                {card.button}
              </Link>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
            <h2 className="text-2xl font-bold">Safety Overview</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">Emergency Services</p>

                <p className="mt-2 text-3xl font-bold text-green-400">
                  Active
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">Location Access</p>

                <p className="mt-2 text-3xl font-bold text-blue-400">
                  Ready
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">Safety Profile</p>

                <p className="mt-2 text-3xl font-bold text-yellow-400">
                  Connected
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-yellow-500/30 bg-yellow-950/20 p-5">
              <p className="font-semibold text-yellow-200">
                Emergency integration status
              </p>

              <p className="mt-2 text-sm leading-6 text-yellow-100/70">
                SOS records and trusted contacts are stored in MongoDB.
                Official police dispatch and automatic messaging remain in demo
                mode until approved external integrations are connected.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">Quick Numbers</h2>

            <div className="mt-6 space-y-4">
              <a
                href="tel:112"
                className="flex items-center justify-between rounded-xl bg-slate-800 p-4 transition hover:bg-blue-600"
              >
                <span>National Emergency</span>
                <strong>112</strong>
              </a>

              <a
                href="tel:108"
                className="flex items-center justify-between rounded-xl bg-slate-800 p-4 transition hover:bg-green-600"
              >
                <span>Ambulance</span>
                <strong>108</strong>
              </a>

              <a
                href="tel:101"
                className="flex items-center justify-between rounded-xl bg-slate-800 p-4 transition hover:bg-orange-600"
              >
                <span>Fire Brigade</span>
                <strong>101</strong>
              </a>

              <a
                href="tel:1930"
                className="flex items-center justify-between rounded-xl bg-slate-800 p-4 transition hover:bg-purple-600"
              >
                <span>Cyber Crime</span>
                <strong>1930</strong>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
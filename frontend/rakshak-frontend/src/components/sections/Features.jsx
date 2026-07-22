import { useNavigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaMapMarkedAlt,
  FaFemale,
  FaFileAlt,
  FaHospital,
  FaRobot,
} from "react-icons/fa";

function Features() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaShieldAlt className="text-4xl text-blue-400" />,
      title: "Emergency SOS",
      description: "Instantly alert police, hospitals, and trusted contacts.",
      path: "/emergency",
    },
    {
      icon: <FaMapMarkedAlt className="text-4xl text-blue-400" />,
      title: "Live Location",
      description: "Share your live location securely during emergencies.",
      path: "/emergency",
    },
    {
      icon: <FaFemale className="text-4xl text-blue-400" />,
      title: "Women's Safety",
      description: "Advanced protection features designed for safer travel.",
      path: "/women-safety",
    },
    {
      icon: <FaFileAlt className="text-4xl text-blue-400" />,
      title: "e-FIR Support",
      description: "Quickly prepare digital complaint drafts with guidance.",
      path: "/fir",
    },
    {
      icon: <FaHospital className="text-4xl text-blue-400" />,
      title: "Nearby Services",
      description: "Locate hospitals, police stations and emergency services.",
      path: "/police",
    },
    {
      icon: <FaRobot className="text-4xl text-blue-400" />,
      title: "AI Assistant",
      description: "Get intelligent emergency guidance powered by AI.",
      path: "/ai-assistant",
    },
  ];

  return (
    <section className="bg-slate-950 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-4 text-center text-4xl font-bold text-white">
          Platform Features
        </h2>

        <p className="mx-auto mb-14 max-w-2xl text-center text-slate-400">
          Rakshak India combines AI, real-time location sharing, emergency
          services, and public safety into one intelligent platform.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              onClick={() => navigate(feature.path)}
              className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-blue-500/20"
            >
              <div className="mb-4">{feature.icon}</div>

              <h3 className="mb-3 text-xl font-semibold text-white">
                {feature.title}
              </h3>

              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
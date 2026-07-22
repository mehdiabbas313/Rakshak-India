import { useState } from "react";
import {
  FaGavel,
  FaBalanceScale,
  FaFileSignature,
  FaPhoneAlt,
  FaUserTie,
  FaPaperPlane,
  FaShieldAlt,
  FaCheckCircle,
  FaTimes,
  FaArrowRight,
} from "react-icons/fa";

import { createLawyerRequest } from "../services/lawyerService";

function Lawyers() {
  const services = [
    {
      id: "rights",
      title: "Know Your Rights",
      description:
        "Police, arrest, workplace aur daily-life situations me apne legal rights samjho.",
      icon: <FaBalanceScale className="text-3xl text-yellow-400" />,
      iconBackground: "bg-yellow-500/10",
      buttonText: "View Your Rights",
      details: [
        "Arrest hone par police ko arrest ka reason batana zaroori hai.",
        "Aapko apne family member ya trusted person ko arrest ki information dene ka adhikar hai.",
        "Aapko lawyer se legal advice lene ka adhikar hai.",
        "Aap police complaint ya FIR ki free copy maang sakte hain.",
        "Police kisi bhi person ke saath illegal violence ya torture nahi kar sakti.",
        "Mahila ki search sirf female police officer dwara ki jaani chahiye.",
        "Police station me complaint accept na ho to senior police officer ko complaint bheji ja sakti hai.",
      ],
    },
    {
      id: "efir",
      title: "e-FIR Guidance",
      description:
        "Online FIR file karne ke liye simple step-by-step legal guidance hasil karo.",
      icon: <FaFileSignature className="text-3xl text-green-400" />,
      iconBackground: "bg-green-500/10",
      buttonText: "Open e-FIR Guide",
      details: [
        "Apne state police ke official citizen portal par jao.",
        "Citizen account create karo ya existing account se login karo.",
        "Complaint, Lost Report ya e-FIR option select karo.",
        "Incident ki date, time aur exact location enter karo.",
        "Incident ka complete aur clear description likho.",
        "Available photo, document, video ya other evidence upload karo.",
        "Submit karne ke baad complaint reference number save karo.",
        "Reference number ke through complaint status track karo.",
      ],
    },
    {
      id: "advice",
      title: "Free Legal Advice",
      description:
        "Verified legal aid aur suitable legal assistance resources tak pahucho.",
      icon: <FaGavel className="text-3xl text-blue-400" />,
      iconBackground: "bg-blue-500/10",
      buttonText: "Get Legal Advice",
      details: [
        "Neeche diya Legal Help Request Form fill karo.",
        "Apni legal problem ka correct issue type select karo.",
        "Problem ko clear aur short words me explain karo.",
        "Correct phone number aur email address enter karo.",
        "Request backend API ke through database me save hogi.",
        "Emergency legal help ke liye 15100 par directly call karo.",
      ],
    },
    {
      id: "helpline",
      title: "Emergency Helpline",
      description:
        "Urgent legal assistance ke liye National Legal Services helpline par call karo.",
      number: "15100",
      icon: <FaPhoneAlt className="text-3xl text-red-400" />,
      iconBackground: "bg-red-500/10",
    },
  ];

  const issueTypes = [
    "Criminal Law",
    "Family Law",
    "Property Law",
    "Cyber Crime",
    "Women Safety",
    "Corporate Law",
    "Consumer Complaint",
    "Workplace Issue",
    "Other",
  ];

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    specialization: "",
    message: "",
  });

  const [activeService, setActiveService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (successMessage) {
      setSuccessMessage("");
    }

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const scrollToLegalForm = () => {
    setActiveService(null);

    setTimeout(() => {
      document.getElementById("legal-help-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!formData.fullName.trim()) {
      setErrorMessage("Please apna full name enter karo.");
      return;
    }

    if (!formData.phone.trim()) {
      setErrorMessage("Please apna phone number enter karo.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      setErrorMessage("Please valid 10-digit phone number enter karo.");
      return;
    }

    if (!formData.specialization) {
      setErrorMessage("Please legal issue type select karo.");
      return;
    }

    if (!formData.message.trim()) {
      setErrorMessage("Please apni legal problem explain karo.");
      return;
    }

    try {
      setLoading(true);

      const response = await createLawyerRequest({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        specialization: formData.specialization,
        message: formData.message.trim(),
      });

      setSuccessMessage(
        response?.message ||
          "Aapki legal help request successfully submit ho gayi."
      );

      setFormData({
        fullName: "",
        phone: "",
        email: "",
        specialization: "",
        message: "",
      });
    } catch (error) {
      console.error("Legal help request error:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Request submit nahi hui. Backend aur MongoDB connection check karo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
              <FaGavel className="text-3xl text-blue-400" />
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
              Rakshak India Legal Support
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Legal Assistance When You Need It
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              Legal rights, e-FIR guidance, emergency helpline aur professional
              legal help request — sab ek secure platform par.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300">
                <FaShieldAlt className="text-blue-400" />
                Secure Request
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300">
                <FaCheckCircle className="text-green-400" />
                Simple Process
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300">
                <FaUserTie className="text-yellow-400" />
                Legal Support
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        {/* Available Services */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            Available Services
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Legal support services
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-slate-400">
            Apni requirement ke according legal guidance, assistance aur
            emergency helpline access karo.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {services.map((item) => (
              <article
                key={item.id}
                className="group flex min-h-[300px] flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-950/20"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.iconBackground}`}
                >
                  {item.icon}
                </div>

                <h3 className="mt-6 text-xl font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-slate-400">
                  {item.description}
                </p>

                {item.number ? (
                  <a
                    href={`tel:${item.number}`}
                    className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-500"
                  >
                    <FaPhoneAlt />
                    Call {item.number}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveService(item)}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-3 text-sm font-bold text-blue-300 transition hover:border-blue-400 hover:bg-blue-600 hover:text-white"
                  >
                    {item.buttonText}
                    <FaArrowRight className="text-xs" />
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Legal Request Section */}
        <section className="mt-16 grid overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/20 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Left Information Panel */}
          <div className="border-b border-slate-800 bg-slate-900 p-8 text-white sm:p-10 lg:border-b-0 lg:border-r">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
              <FaUserTie className="text-2xl text-blue-400" />
            </div>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Request Assistance
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Request Legal Help
            </h2>

            <p className="mt-4 leading-8 text-slate-400">
              Apni legal problem ki basic information submit karo. Request
              frontend se backend API ke through MongoDB database me save hogi.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "Criminal law assistance",
                "Family aur property disputes",
                "Cybercrime related complaint",
                "Women safety legal support",
                "Consumer aur workplace issues",
                "Corporate aur other legal matters",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-300"
                >
                  <FaCheckCircle className="shrink-0 text-green-400" />
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5">
              <p className="text-sm font-semibold text-yellow-300">
                Emergency legal assistance
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Urgent situation me National Legal Services helpline number
                15100 par directly contact karo.
              </p>

              <a
                href="tel:15100"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-400"
              >
                <FaPhoneAlt />
                Call 15100
              </a>
            </div>
          </div>

          {/* Legal Help Form */}
          <form
            id="legal-help-form"
            onSubmit={handleSubmit}
            className="scroll-mt-24 bg-slate-900 p-8 sm:p-10"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Legal Help Form
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              Tell us about your issue
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              Star (*) wale fields required hain. Sahi contact information
              enter karo.
            </p>

            {successMessage && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-4 text-sm text-green-300"
              >
                <FaCheckCircle className="mt-0.5 shrink-0 text-lg" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-4 text-sm text-red-300"
              >
                {errorMessage}
              </div>
            )}

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  Full Name *
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  Phone Number *
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength="10"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter 10-digit number"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="specialization"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  Legal Issue Type *
                </label>

                <select
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="">Select legal issue</option>

                  {issueTypes.map((issue) => (
                    <option key={issue} value={issue}>
                      {issue}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Problem Description *
              </label>

              <textarea
                id="message"
                name="message"
                rows="6"
                maxLength="1000"
                value={formData.message}
                onChange={handleChange}
                placeholder="Apni legal problem briefly explain karo..."
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />

              <p className="mt-2 text-right text-xs text-slate-500">
                {formData.message.length}/1000
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950/60 p-4">
              <p className="text-xs leading-6 text-slate-400">
                Form submit karne par aapki information legal assistance request
                process karne ke liye backend database me save hogi.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaPaperPlane />

              {loading
                ? "Request Submitting..."
                : "Submit Legal Help Request"}
            </button>
          </form>
        </section>
      </div>

      {/* Service Details Popup */}
      {activeService && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-sm"
          onClick={() => setActiveService(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-popup-title"
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-black/50 sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveService(null)}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-300 transition hover:border-red-500 hover:bg-red-500 hover:text-white"
              aria-label="Close service details"
            >
              <FaTimes />
            </button>

            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl ${activeService.iconBackground}`}
            >
              {activeService.icon}
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              Rakshak India Legal Support
            </p>

            <h2
              id="service-popup-title"
              className="mt-3 pr-12 text-3xl font-bold text-white"
            >
              {activeService.title}
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              {activeService.description}
            </p>

            <div className="mt-7 space-y-3">
              {activeService.details?.map((detail, index) => (
                <div
                  key={`${activeService.id}-${index}`}
                  className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-950/70 p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-sm font-bold text-blue-400">
                    {index + 1}
                  </div>

                  <p className="text-sm leading-7 text-slate-300">
                    {detail}
                  </p>
                </div>
              ))}
            </div>

            {activeService.id === "advice" && (
              <button
                type="button"
                onClick={scrollToLegalForm}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white transition hover:bg-blue-500"
              >
                Go to Legal Help Form
                <FaArrowRight />
              </button>
            )}

            {activeService.id === "efir" && (
              <button
                type="button"
                onClick={() => setActiveService(null)}
                className="mt-7 w-full rounded-xl border border-green-500/40 bg-green-500/10 px-5 py-3.5 font-bold text-green-300 transition hover:bg-green-600 hover:text-white"
              >
                Understood
              </button>
            )}

            {activeService.id === "rights" && (
              <button
                type="button"
                onClick={() => setActiveService(null)}
                className="mt-7 w-full rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-5 py-3.5 font-bold text-yellow-300 transition hover:bg-yellow-500 hover:text-slate-950"
              >
                I Understand My Rights
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default Lawyers;
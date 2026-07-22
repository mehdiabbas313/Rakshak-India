import { useState } from "react";
import {
  FaExclamationTriangle,
  FaFileAlt,
  FaMapMarkerAlt,
  FaSave,
  FaSpinner,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { createFIR } from "../services/firService";

const initialFormData = {
  complaintType: "",
  incidentDate: "",
  incidentTime: "",
  incidentLocation: "",
  complaintTitle: "",
  description: "",
  suspectDetails: "",
  witnessDetails: "",
  evidenceLink: "",
};

function FIR() {
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [savedFIR, setSavedFIR] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const saveFIR = async (status) => {
    if (
      !formData.complaintType ||
      !formData.incidentDate ||
      !formData.incidentLocation.trim() ||
      !formData.complaintTitle.trim() ||
      !formData.description.trim()
    ) {
      toast.error("Please fill all required complaint details.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        complaintType: formData.complaintType,
        incidentDate: formData.incidentDate,
        incidentTime: formData.incidentTime,
        incidentLocation: formData.incidentLocation,
        complaintTitle: formData.complaintTitle,
        description: formData.description,
        suspectDetails: formData.suspectDetails,
        witnessDetails: formData.witnessDetails,
        evidenceLinks: formData.evidenceLink.trim()
          ? [formData.evidenceLink.trim()]
          : [],
        status,
      };

      const data = await createFIR(payload);

      setSavedFIR(data.fir);
      setFormData(initialFormData);

      toast.success(data.message);
    } catch (error) {
      console.error("FIR save error:", error);

      toast.error(
        error.response?.data?.message ||
          "FIR complaint save nahi ho paayi."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveFIR("submitted");
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 to-blue-950 p-8 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-cyan-500/10 p-4 text-cyan-400">
              <FaFileAlt className="text-3xl" />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                Digital Complaint Assistance
              </p>

              <h1 className="mt-1 text-4xl font-bold">
                Online FIR Assistance
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-3xl leading-7 text-slate-300">
            Prepare and securely save complaint details in your Rakshak
            account.
          </p>

          <div className="mt-6 rounded-2xl border border-yellow-500/30 bg-yellow-950/20 p-4">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="mt-1 text-yellow-400" />

              <div>
                <p className="font-semibold text-yellow-200">
                  Important notice
                </p>

                <p className="mt-1 text-sm leading-6 text-yellow-100/70">
                  This form does not register an official police FIR. It stores
                  complaint information in Rakshak India for demonstration and
                  assistance purposes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {savedFIR && (
          <section className="mt-8 rounded-2xl border border-green-500/30 bg-green-950/20 p-6">
            <p className="font-semibold text-green-300">
              Complaint saved successfully
            </p>

            <p className="mt-2 text-sm text-slate-300">
              Reference Number:
            </p>

            <p className="mt-1 break-all text-xl font-bold text-white">
              {savedFIR.referenceNumber}
            </p>
          </section>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:p-8"
        >
          <h2 className="text-2xl font-bold">Complaint Details</h2>

          <div className="mt-7 grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Complaint Type *
              </label>

              <select
                name="complaintType"
                value={formData.complaintType}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              >
                <option value="">Select complaint type</option>
                <option value="Theft">Theft</option>
                <option value="Cyber Crime">Cyber Crime</option>
                <option value="Harassment">Harassment</option>
                <option value="Missing Person">Missing Person</option>
                <option value="Fraud">Fraud</option>
                <option value="Violence">Violence</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Complaint Title *
              </label>

              <input
                type="text"
                name="complaintTitle"
                value={formData.complaintTitle}
                onChange={handleChange}
                maxLength={150}
                placeholder="Short title of complaint"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Incident Date *
              </label>

              <input
                type="date"
                name="incidentDate"
                value={formData.incidentDate}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Incident Time
              </label>

              <input
                type="time"
                name="incidentTime"
                value={formData.incidentTime}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Incident Location *
            </label>

            <div className="relative">
              <FaMapMarkerAlt className="absolute left-4 top-4 text-cyan-400" />

              <input
                type="text"
                name="incidentLocation"
                value={formData.incidentLocation}
                onChange={handleChange}
                maxLength={250}
                placeholder="Enter incident location"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Complaint Description *
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={7}
              maxLength={3000}
              placeholder="Describe the incident clearly and in detail..."
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
            />

            <p className="mt-2 text-right text-xs text-slate-500">
              {formData.description.length}/3000
            </p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Suspect Details
              </label>

              <textarea
                name="suspectDetails"
                value={formData.suspectDetails}
                onChange={handleChange}
                rows={5}
                maxLength={1000}
                placeholder="Name, appearance or known details"
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Witness Details
              </label>

              <textarea
                name="witnessDetails"
                value={formData.witnessDetails}
                onChange={handleChange}
                rows={5}
                maxLength={1000}
                placeholder="Witness information if available"
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Evidence Link
            </label>

            <input
              type="url"
              name="evidenceLink"
              value={formData.evidenceLink}
              onChange={handleChange}
              placeholder="Google Drive or other evidence link"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
            />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => saveFIR("draft")}
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-600 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              <FaSave />
              Save Draft
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Saving Complaint...
                </>
              ) : (
                <>
                  <FaFileAlt />
                  Save Complaint
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FIR;
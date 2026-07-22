import { useEffect, useMemo, useState } from "react";
import {
  FaPhoneAlt,
  FaPlus,
  FaSpinner,
  FaTrash,
  FaUserFriends,
  FaWhatsapp,
} from "react-icons/fa";
import toast from "react-hot-toast";

import {
  addEmergencyContact,
  deleteEmergencyContact,
  getEmergencyContacts,
} from "../../services/emergencyContactService";

function EmergencyContacts() {
  const [contacts, setContacts] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    relationship: "",
    isPrimary: false,
  });

  const [formError, setFormError] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [addingContact, setAddingContact] = useState(false);
  const [deletingContactId, setDeletingContactId] = useState(null);

  const contactCount = contacts.length;

  const normalizedPhone = useMemo(() => {
    return formData.phone.replace(/\D/g, "");
  }, [formData.phone]);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        setLoadingContacts(true);

        const data = await getEmergencyContacts();

        setContacts(data.contacts || []);
      } catch (error) {
        console.error("Load emergency contacts error:", error);

        const message =
          error.response?.data?.message ||
          "Emergency contacts load nahi ho paye.";

        toast.error(message);
      } finally {
        setLoadingContacts(false);
      }
    };

    loadContacts();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setFormError("");
  };

  const addContact = async (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const relationship = formData.relationship.trim();

    if (!name || !normalizedPhone) {
      setFormError("Name and phone number are required.");
      return;
    }

    if (normalizedPhone.length < 10 || normalizedPhone.length > 15) {
      setFormError("Please enter a valid phone number.");
      return;
    }

    if (contactCount >= 5) {
      setFormError("You can add a maximum of 5 emergency contacts.");
      return;
    }

    const alreadyExists = contacts.some(
      (contact) => contact.phone === normalizedPhone
    );

    if (alreadyExists) {
      setFormError("This phone number is already added.");
      return;
    }

    try {
      setAddingContact(true);
      setFormError("");

      const data = await addEmergencyContact({
        name,
        phone: normalizedPhone,
        relationship: relationship || "Trusted Contact",
        isPrimary: formData.isPrimary,
      });

      const newContact = data.contact;

      setContacts((current) => {
        if (newContact.isPrimary) {
          return [
            newContact,
            ...current.map((contact) => ({
              ...contact,
              isPrimary: false,
            })),
          ];
        }

        return [newContact, ...current];
      });

      setFormData({
        name: "",
        phone: "",
        relationship: "",
        isPrimary: false,
      });

      toast.success("Emergency contact saved successfully.");
    } catch (error) {
      console.error("Add emergency contact error:", error);

      const message =
        error.response?.data?.message ||
        "Emergency contact add nahi ho paya.";

      setFormError(message);
      toast.error(message);
    } finally {
      setAddingContact(false);
    }
  };

  const removeContact = async (contactId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this emergency contact?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingContactId(contactId);

      const data = await deleteEmergencyContact(contactId);

      setContacts((current) =>
        current.filter((contact) => contact._id !== contactId)
      );

      toast.success(data.message || "Emergency contact removed.");
    } catch (error) {
      console.error("Delete emergency contact error:", error);

      const message =
        error.response?.data?.message ||
        "Emergency contact delete nahi ho paya.";

      toast.error(message);
    } finally {
      setDeletingContactId(null);
    }
  };

  const notifyContactsDemo = () => {
    if (contacts.length === 0) {
      toast.error("Please add an emergency contact first.");
      return;
    }

    toast.success(
      `Demo notification prepared for ${contacts.length} contact${
        contacts.length === 1 ? "" : "s"
      }.`
    );
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-purple-500/10 p-3 text-purple-400">
            <FaUserFriends className="text-2xl" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-purple-400">
              Trusted Network
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              Emergency Contacts
            </h2>
          </div>
        </div>

        <span className="w-fit rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-semibold text-slate-300">
          {contactCount}/5 Added
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-400">
        Add trusted people who can be contacted during an emergency. Your
        contacts are securely saved in your Rakshak account.
      </p>

      <form onSubmit={addContact} className="mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Contact Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Example: Mother"
            maxLength={80}
            disabled={addingContact}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Phone Number
          </label>

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Example: 9876543210"
            disabled={addingContact}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Relationship
          </label>

          <input
            type="text"
            name="relationship"
            value={formData.relationship}
            onChange={handleChange}
            placeholder="Example: Mother, Father, Brother"
            maxLength={50}
            disabled={addingContact}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-700 bg-slate-950 p-4">
          <div>
            <p className="font-medium text-white">Primary Contact</p>

            <p className="mt-1 text-sm text-slate-500">
              Mark this person as your main emergency contact.
            </p>
          </div>

          <input
            type="checkbox"
            name="isPrimary"
            checked={formData.isPrimary}
            onChange={handleChange}
            disabled={addingContact}
            className="h-5 w-5 accent-purple-600"
          />
        </label>

        {formError && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/30 p-3 text-sm text-red-300">
            {formError}
          </div>
        )}

        <button
          type="submit"
          disabled={contactCount >= 5 || addingContact}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {addingContact ? (
            <>
              <FaSpinner className="animate-spin" />
              Saving Contact...
            </>
          ) : (
            <>
              <FaPlus />
              {contactCount >= 5
                ? "Maximum 5 Contacts"
                : "Add Emergency Contact"}
            </>
          )}
        </button>
      </form>

      <div className="mt-7 space-y-3">
        {loadingContacts ? (
          <div className="flex min-h-36 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950">
            <div className="text-center">
              <FaSpinner className="mx-auto animate-spin text-2xl text-purple-400" />

              <p className="mt-3 text-sm text-slate-400">
                Loading emergency contacts...
              </p>
            </div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-6 text-center">
            <p className="font-medium text-slate-300">
              No emergency contacts added
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Add at least one trusted contact for the SOS workflow.
            </p>
          </div>
        ) : (
          contacts.map((contact) => (
            <article
              key={contact._id}
              className={`rounded-2xl border bg-slate-950 p-4 ${
                contact.isPrimary
                  ? "border-purple-500/50"
                  : "border-slate-800"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-white">{contact.name}</h3>

                    {contact.isPrimary && (
                      <span className="rounded-full border border-purple-500/30 bg-purple-950/30 px-2 py-1 text-xs font-semibold text-purple-300">
                        Primary
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {contact.relationship}
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                    <FaPhoneAlt className="text-green-400" />
                    {contact.phone}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeContact(contact._id)}
                  disabled={deletingContactId === contact._id}
                  className="rounded-xl border border-red-500/20 p-3 text-red-400 transition hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Remove ${contact.name}`}
                >
                  {deletingContactId === contact._id ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaTrash />
                  )}
                </button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <FaPhoneAlt />
                  Call
                </a>

                <a
                  href={`https://wa.me/${contact.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-green-500/20 px-4 py-2.5 text-sm font-semibold text-green-300 transition hover:bg-green-950/30"
                >
                  <FaWhatsapp />
                  WhatsApp
                </a>
              </div>
            </article>
          ))
        )}
      </div>

      <button
        type="button"
        onClick={notifyContactsDemo}
        disabled={loadingContacts}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-yellow-500/30 bg-yellow-950/20 px-5 py-3 font-semibold text-yellow-200 transition hover:bg-yellow-950/40 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Prepare Demo Notification
      </button>

      <div className="mt-4 rounded-xl border border-yellow-500/30 bg-yellow-950/20 p-4">
        <p className="text-sm font-semibold text-yellow-200">
          Messaging demo mode
        </p>

        <p className="mt-1 text-sm leading-6 text-yellow-100/70">
          Contacts are now saved in MongoDB. Automatic SMS or WhatsApp messages
          are not sent yet.
        </p>
      </div>
    </section>
  );
}

export default EmergencyContacts;
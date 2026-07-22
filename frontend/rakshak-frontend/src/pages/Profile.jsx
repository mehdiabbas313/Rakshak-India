import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaAddressCard,
  FaEdit,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaSave,
  FaSpinner,
  FaTimes,
  FaTint,
  FaUserCircle,
  FaUserFriends,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { getEmergencyContacts } from "../services/emergencyContactService";
import {
  getUserProfile,
  updateUserProfile,
} from "../services/userService";

const BLOOD_GROUPS = [
  "Not Added",
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

function Profile() {
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState(user);
  const [primaryContact, setPrimaryContact] = useState(null);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingContact, setLoadingContact] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  const [profileError, setProfileError] = useState("");
  const [contactError, setContactError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    bloodGroup: "Not Added",
    address: "",
    medicalConditions: "",
  });

  const displayName =
    profile?.fullName ||
    profile?.name ||
    profile?.email?.split("@")[0] ||
    "Rakshak User";

  const email = profile?.email || "Not available";
  const phone = profile?.phone || "Not available";
  const bloodGroup = profile?.bloodGroup || "Not Added";
  const address = profile?.address || "Not Added";
  const medicalConditions =
    profile?.medicalConditions || "Not Added";

  const getInitials = (name) => {
    if (!name?.trim()) {
      return "U";
    }

    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }

    return `${words[0][0]}${
      words[words.length - 1][0]
    }`.toUpperCase();
  };

  const initials = getInitials(displayName);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        setProfileError("");

        const data = await getUserProfile();
        const loadedUser = data.user;

        setProfile(loadedUser);
        updateUser(loadedUser);

        setFormData({
          fullName: loadedUser.fullName || "",
          phone: loadedUser.phone || "",
          bloodGroup: loadedUser.bloodGroup || "Not Added",
          address: loadedUser.address || "",
          medicalConditions:
            loadedUser.medicalConditions || "",
        });
      } catch (error) {
        console.error("Load profile error:", error);

        setProfileError(
          error.response?.data?.message ||
            "Profile load nahi ho paayi."
        );
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    const loadPrimaryContact = async () => {
      try {
        setLoadingContact(true);
        setContactError("");

        const data = await getEmergencyContacts();
        const contacts = data.contacts || [];

        const selectedContact =
          contacts.find((contact) => contact.isPrimary) ||
          contacts[0] ||
          null;

        setPrimaryContact(selectedContact);
      } catch (error) {
        console.error(
          "Load emergency contact error:",
          error
        );

        setContactError(
          error.response?.data?.message ||
            "Emergency contact load nahi ho paya."
        );
      } finally {
        setLoadingContact(false);
      }
    };

    loadPrimaryContact();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const startEditing = () => {
    setFormData({
      fullName: profile?.fullName || "",
      phone: profile?.phone || "",
      bloodGroup: profile?.bloodGroup || "Not Added",
      address: profile?.address || "",
      medicalConditions:
        profile?.medicalConditions || "",
    });

    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    const cleanName = formData.fullName.trim();
    const cleanPhone = formData.phone.replace(/\D/g, "");

    if (cleanName.length < 2) {
      toast.error("Please enter a valid full name.");
      return;
    }

    if (
      cleanPhone.length < 10 ||
      cleanPhone.length > 15
    ) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    try {
      setSavingProfile(true);

      const data = await updateUserProfile({
        fullName: cleanName,
        phone: cleanPhone,
        bloodGroup: formData.bloodGroup,
        address: formData.address.trim(),
        medicalConditions:
          formData.medicalConditions.trim(),
      });

      setProfile(data.user);
      updateUser(data.user);
      setIsEditing(false);

      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Update profile error:", error);

      toast.error(
        error.response?.data?.message ||
          "Profile update nahi ho paayi."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <FaSpinner className="mx-auto animate-spin text-4xl text-blue-400" />

          <p className="mt-4 text-slate-400">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        {profileError && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-950/30 p-4 text-red-300">
            {profileError}
          </div>
        )}

        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 px-6 py-12 text-center">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-4 border-blue-400/30 bg-blue-600 text-3xl font-bold text-white shadow-xl">
              {initials}
            </div>

            <h1 className="mt-5 text-4xl font-bold">
              {displayName}
            </h1>

            <p className="mt-2 text-slate-300">
              Rakshak India User
            </p>

            {!isEditing && (
              <button
                type="button"
                onClick={startEditing}
                className="mx-auto mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700"
              >
                <FaEdit />
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form
              onSubmit={saveProfile}
              className="p-6 md:p-8"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    maxLength={80}
                    disabled={savingProfile}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-blue-500 disabled:opacity-60"
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
                    disabled={savingProfile}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-blue-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Blood Group
                  </label>

                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    disabled={savingProfile}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-blue-500 disabled:opacity-60"
                  >
                    {BLOOD_GROUPS.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    maxLength={250}
                    disabled={savingProfile}
                    placeholder="Enter your address"
                    className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-60"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Medical Conditions
                  </label>

                  <textarea
                    name="medicalConditions"
                    value={formData.medicalConditions}
                    onChange={handleChange}
                    rows={4}
                    maxLength={500}
                    disabled={savingProfile}
                    placeholder="Example: Diabetes, allergy, asthma or leave empty"
                    className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={savingProfile}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-6 py-3 font-semibold transition hover:bg-slate-800 disabled:opacity-60"
                >
                  <FaTimes />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingProfile ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving Profile...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
                <article className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-2xl text-blue-400" />

                    <div className="min-w-0">
                      <p className="text-sm text-slate-500">
                        Email
                      </p>

                      <p className="mt-1 break-all font-semibold text-white">
                        {email}
                      </p>
                    </div>
                  </div>
                </article>

                <article className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                  <div className="flex items-center gap-3">
                    <FaPhoneAlt className="text-2xl text-green-400" />

                    <div>
                      <p className="text-sm text-slate-500">
                        Phone
                      </p>

                      <p className="mt-1 font-semibold text-white">
                        {phone}
                      </p>
                    </div>
                  </div>
                </article>

                <article className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                  <div className="flex items-center gap-3">
                    <FaTint className="text-2xl text-red-400" />

                    <div>
                      <p className="text-sm text-slate-500">
                        Blood Group
                      </p>

                      <p className="mt-1 font-semibold text-white">
                        {bloodGroup}
                      </p>
                    </div>
                  </div>
                </article>

                <article className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                  <div className="flex items-start gap-3">
                    <FaUserFriends className="mt-1 text-2xl text-yellow-400" />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-500">
                        Primary Emergency Contact
                      </p>

                      {loadingContact ? (
                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                          <FaSpinner className="animate-spin" />
                          Loading contact...
                        </div>
                      ) : contactError ? (
                        <div className="mt-3">
                          <p className="text-sm text-red-400">
                            {contactError}
                          </p>

                          <Link
                            to="/emergency"
                            className="mt-3 inline-block text-sm font-semibold text-blue-400 hover:text-blue-300"
                          >
                            Open Emergency Dashboard
                          </Link>
                        </div>
                      ) : primaryContact ? (
                        <div className="mt-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-white">
                              {primaryContact.name}
                            </p>

                            {primaryContact.isPrimary && (
                              <span className="rounded-full border border-purple-500/30 bg-purple-950/30 px-2 py-1 text-xs font-semibold text-purple-300">
                                Primary
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-sm text-slate-400">
                            {primaryContact.relationship}
                          </p>

                          <p className="mt-2 text-sm font-medium text-green-300">
                            {primaryContact.phone}
                          </p>

                          <Link
                            to="/emergency"
                            className="mt-3 inline-block text-sm font-semibold text-blue-400 hover:text-blue-300"
                          >
                            Manage Contacts
                          </Link>
                        </div>
                      ) : (
                        <div className="mt-2">
                          <p className="font-semibold text-white">
                            Not Added
                          </p>

                          <Link
                            to="/emergency"
                            className="mt-3 inline-block text-sm font-semibold text-blue-400 hover:text-blue-300"
                          >
                            Add Emergency Contact
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </article>

                <article className="rounded-2xl border border-slate-800 bg-slate-950 p-6 md:col-span-2">
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="mt-1 text-2xl text-purple-400" />

                    <div>
                      <p className="text-sm text-slate-500">
                        Address
                      </p>

                      <p className="mt-1 whitespace-pre-wrap font-semibold text-white">
                        {address}
                      </p>
                    </div>
                  </div>
                </article>

                <article className="rounded-2xl border border-slate-800 bg-slate-950 p-6 md:col-span-2">
                  <div className="flex items-start gap-3">
                    <FaAddressCard className="mt-1 text-2xl text-orange-400" />

                    <div>
                      <p className="text-sm text-slate-500">
                        Medical Conditions
                      </p>

                      <p className="mt-1 whitespace-pre-wrap font-semibold text-white">
                        {medicalConditions}
                      </p>
                    </div>
                  </div>
                </article>
              </div>

              <div className="border-t border-slate-800 p-6 md:p-8">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                  <FaUserCircle className="text-3xl text-blue-400" />

                  <div>
                    <h2 className="font-bold text-white">
                      Account Information
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Your profile information is securely stored in your
                      Rakshak account.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Profile;
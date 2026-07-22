import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register: createAccount } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      setServerError("");

      await createAccount({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.replace(/\D/g, ""),
        password: formData.password,
      });

      toast.success("Account created successfully.");
      navigate("/profile", { replace: true });
    } catch (error) {
      console.error("Registration error:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";

      setServerError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl md:grid-cols-2">
        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-bold">Create account</h2>

          <p className="mt-2 text-slate-400">
            Join Rakshak and set up your emergency safety profile.
          </p>

          {serverError && (
            <div className="mt-5 rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-300">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                {...register("fullName", {
                  required: "Full name is required.",
                  minLength: {
                    value: 2,
                    message: "Full name must contain at least 2 characters.",
                  },
                  maxLength: {
                    value: 80,
                    message: "Full name is too long.",
                  },
                })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />

              {errors.fullName && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email Address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email", {
                  required: "Email address is required.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address.",
                  },
                })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />

              {errors.email && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Phone Number
              </label>

              <input
                type="tel"
                placeholder="9876543210"
                autoComplete="tel"
                {...register("phone", {
                  required: "Phone number is required.",
                  validate: (value) => {
                    const phone = value.replace(/\D/g, "");

                    return (
                      (phone.length >= 10 && phone.length <= 15) ||
                      "Enter a valid phone number."
                    );
                  },
                })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />

              {errors.phone && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>

              <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950 focus-within:border-blue-500">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  {...register("password", {
                    required: "Password is required.",
                    minLength: {
                      value: 6,
                      message: "Password must contain at least 6 characters.",
                    },
                  })}
                  className="w-full bg-transparent px-4 py-3 outline-none placeholder:text-slate-600"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="px-4 text-slate-400 transition hover:text-white"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {errors.password && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <button
            type="button"
            disabled
            title="Google authentication will be added later"
            className="mt-5 flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-slate-700 py-3 font-semibold text-slate-500 opacity-70"
          >
            <FaGoogle />
            Continue with Google
          </button>

          <p className="mt-6 text-center text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="hidden bg-gradient-to-br from-slate-950 to-blue-600 p-12 md:block">
          <h1 className="text-5xl font-bold leading-tight">
            Build your safety profile
          </h1>

          <p className="mt-6 leading-7 text-slate-200">
            Save emergency details, trusted contacts and location settings for
            faster response during critical situations.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
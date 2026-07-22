import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError("");

      await login(data);

      navigate("/dashboard");
    } catch (error) {
      setServerError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl md:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-blue-600 to-slate-950 p-12 md:block">
          <h1 className="text-5xl font-bold leading-tight">
            Welcome back to Rakshak
          </h1>

          <p className="mt-6 text-slate-200">
            Access emergency tools, trusted contacts, live location, and public
            safety services from one secure dashboard.
          </p>
        </div>

        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-bold">Sign in</h2>

          <p className="mt-2 text-slate-400">
            Continue to your Rakshak account.
          </p>

          {serverError && (
            <div className="mt-5 rounded-xl border border-red-500 bg-red-950 p-4 text-red-300">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Email
              </label>

              <input
                type="email"
                {...register("email")}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Password
              </label>

              <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950 focus-within:border-blue-500">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  required
                  className="w-full bg-transparent px-4 py-3 outline-none"
                  placeholder="Enter password"
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
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-400">
                <input type="checkbox" {...register("remember")} />
                Remember me
              </label>

              <button type="button" className="text-blue-400 hover:text-blue-300">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <button
            type="button"
            className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 py-3 font-semibold transition hover:bg-slate-800"
          >
            <FaGoogle />
            Continue with Google
          </button>

          <p className="mt-6 text-center text-slate-400">
            New to Rakshak?{" "}
            <Link to="/register" className="text-blue-400 hover:text-blue-300">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
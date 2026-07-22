import { useEffect, useMemo, useState } from "react";
import {
  FaSearch,
  FaSpinner,
  FaUserShield,
  FaUsers,
} from "react-icons/fa";
import toast from "react-hot-toast";

import {
  getAllUsers,
  updateUserRole,
} from "../services/adminService";

const ROLE_OPTIONS = ["user", "police", "hospital", "admin"];

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllUsers();

      setUsers(data.users || []);
    } catch (requestError) {
      console.error("Admin users error:", requestError);

      setError(
        requestError.response?.data?.message ||
          "Users load nahi ho paaye."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !cleanSearch ||
        user.fullName?.toLowerCase().includes(cleanSearch) ||
        user.email?.toLowerCase().includes(cleanSearch) ||
        user.phone?.toLowerCase().includes(cleanSearch);

      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingId(userId);

      const data = await updateUserRole(userId, newRole);

      setUsers((current) =>
        current.map((user) =>
          user.id === userId ? data.user : user
        )
      );

      toast.success(data.message || "User role updated.");
    } catch (requestError) {
      console.error("Update user role error:", requestError);

      toast.error(
        requestError.response?.data?.message ||
          "User role update nahi ho paaya."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not available";
    }

    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateValue));
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border border-blue-500/20 bg-gradient-to-r from-slate-900 via-blue-950/30 to-slate-900 p-8 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-blue-500/10 p-4 text-blue-400">
              <FaUsers className="text-3xl" />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                Administration
              </p>

              <h1 className="mt-1 text-4xl font-bold">
                Manage Users
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-3xl leading-7 text-slate-300">
            View registered users, search accounts and assign user, police,
            hospital or admin roles.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <div className="relative">
              <FaSearch className="absolute left-4 top-4 text-slate-500" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email or phone"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </section>

        {loading ? (
          <div className="mt-8 flex min-h-80 items-center justify-center rounded-3xl border border-slate-800 bg-slate-900">
            <div className="text-center">
              <FaSpinner className="mx-auto animate-spin text-4xl text-blue-400" />

              <p className="mt-4 text-slate-400">
                Loading users...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-950/30 p-6">
            <p className="font-semibold text-red-300">{error}</p>

            <button
              type="button"
              onClick={loadUsers}
              className="mt-4 rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-12 text-center">
            <FaUsers className="mx-auto text-5xl text-slate-600" />

            <h2 className="mt-5 text-2xl font-bold">
              No users found
            </h2>

            <p className="mt-3 text-slate-400">
              Search ya role filter change karke dekho.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5">
            {filteredUsers.map((user) => {
              const isUpdating = updatingId === user.id;

              return (
                <article
                  key={user.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
                >
                  <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                        <FaUserShield className="text-2xl" />
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-white">
                          {user.fullName || "Unnamed User"}
                        </h2>

                        <p className="mt-1 break-all text-sm text-slate-400">
                          {user.email}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {user.phone || "Phone not available"}
                        </p>

                        <p className="mt-3 text-xs text-slate-600">
                          Joined: {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="w-full lg:w-64">
                      <label className="mb-2 block text-sm font-medium text-slate-400">
                        Account Role
                      </label>

                      <select
                        value={user.role || "user"}
                        onChange={(event) =>
                          handleRoleChange(
                            user.id,
                            event.target.value
                          )
                        }
                        disabled={isUpdating}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {ROLE_OPTIONS.map((role) => (
                          <option key={role} value={role}>
                            {role.charAt(0).toUpperCase() +
                              role.slice(1)}
                          </option>
                        ))}
                      </select>

                      {isUpdating && (
                        <p className="mt-2 flex items-center gap-2 text-sm text-blue-400">
                          <FaSpinner className="animate-spin" />
                          Updating role...
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;
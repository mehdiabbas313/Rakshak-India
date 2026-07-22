import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaShieldAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

import ThemeToggle from "../../theme/ThemeToggle";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Emergency",
      path: "/emergency",
    },
    {
      name: "Women Safety",
      path: "/women-safety",
    },
    {
      name: "Police",
      path: "/police",
    },
    {
      name: "Hospitals",
      path: "/hospital",
    },
    {
      name: "Legal Help",
      path: "/lawyer",
    },
  ];

  const getNavLinkClass = ({ isActive }) => {
    return `rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
      isActive
        ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
        : "text-slate-700 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
    }`;
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-[1000] border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/95">
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <NavLink
          to="/"
          onClick={closeMobileMenu}
          className="flex shrink-0 items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/30">
            <FaShieldAlt className="text-lg" />
          </span>

          <div>
            <p className="text-lg font-bold leading-tight text-slate-950 dark:text-white">
              Rakshak
            </p>

            <p className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-600 sm:block dark:text-blue-400">
              Public Safety
            </p>
          </div>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navigationLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={getNavLinkClass}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />

          <NavLink
            to="/login"
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-400"
          >
            <FaSignInAlt />
            Sign In
          </NavLink>

          <NavLink
            to="/register"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            <FaUserPlus />
            Create Account
          </NavLink>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileMenuOpen((previousValue) => !previousValue)}
            aria-label={
              mobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-400"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg lg:hidden dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto max-w-7xl space-y-2">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <div className="grid grid-cols-2 gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
              <NavLink
                to="/login"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <FaSignInAlt />
                Sign In
              </NavLink>

              <NavLink
                to="/register"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                <FaUserPlus />
                Register
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
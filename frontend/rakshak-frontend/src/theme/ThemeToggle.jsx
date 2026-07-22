import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "./ThemeContext";

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark ? "Switch to light theme" : "Switch to dark theme"
      }
      title={
        isDark ? "Switch to light theme" : "Switch to dark theme"
      }
      className="relative inline-flex h-10 w-[76px] shrink-0 items-center rounded-full border border-slate-300 bg-slate-100 p-1 shadow-sm transition-colors duration-300 hover:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-500"
    >
      <span
        className={`absolute left-1 top-1 h-8 w-8 rounded-full bg-white shadow-md transition-transform duration-300 dark:bg-slate-700 ${
          isDark ? "translate-x-8" : "translate-x-0"
        }`}
      />

      <span
        className={`relative z-10 flex h-8 w-8 items-center justify-center transition-colors ${
          isDark ? "text-slate-500" : "text-amber-500"
        }`}
      >
        <FaSun />
      </span>

      <span
        className={`relative z-10 flex h-8 w-8 items-center justify-center transition-colors ${
          isDark ? "text-blue-300" : "text-slate-400"
        }`}
      >
        <FaMoon />
      </span>
    </button>
  );
}

export default ThemeToggle;
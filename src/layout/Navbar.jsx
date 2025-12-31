import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import DarkModeToggle from "../components/DarkModeToggle";

export default function Navbar({ sidebarOpen, onToggleSidebar }) {
  return (
    <header
      className="relative h-14 flex items-center px-4 transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-navbar)",
        color: "var(--text-primary)"
      }}
    >
      <div className="flex items-center flex-1">
        {/* Sidebar toggle */}
        <button
          onClick={onToggleSidebar}
          className="
            absolute left-0 top-1/2 -translate-y-1/2
            h-8 w-8
            rounded-r-full
            flex items-center justify-center
            transition
            hover:bg-black/5
          "
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <HiChevronLeft className="w-4 h-4" />
          ) : (
            <HiChevronRight
              className={`w-4 h-4 transition-transform ${
                sidebarOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        {/* Navbar title */}
        <span className="ml-8 font-semibold">
          My App
        </span>
      </div>

      {/* Dark mode toggle */}
      <DarkModeToggle />
    </header>
  );
}

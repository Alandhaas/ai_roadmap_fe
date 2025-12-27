import { useEffect, useState } from "react";
import { HiMoon, HiSun } from "react-icons/hi2";

export default function DarkModeToggle({
  className = "",
  size = 20
}) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);

    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      className={`p-2 rounded hover:bg-black/5 transition ${className}`}
      aria-label="Toggle dark mode"
    >
      {dark ? (
        <HiSun size={size} className="text-yellow-400" />
      ) : (
        <HiMoon size={size} className="text-gray-600" />
      )}
    </button>
  );
}

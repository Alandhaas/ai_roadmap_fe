import { NavLink } from "react-router-dom";
import { useState } from "react";
import { menu, bottomMenu } from "../navigation/menu";

function MenuLink({ to, label, onNavigate }) {
  return (
    <NavLink
      to={to}
      end
      onClick={onNavigate}
      className={({ isActive }) =>
        `
        block px-3 py-2 rounded text-sm font-medium transition
        ${isActive
          ? "bg-blue-200 text-blue-800"
          : "hover:bg-blue-100"}
        `
      }
    >
      {label}
    </NavLink>
  );
}

function MenuSection({ section, items, onNavigate }) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full px-3 py-2 text-xs font-semibold uppercase flex justify-between items-center opacity-70 hover:opacity-100 transition"
      >
        {section}
        <span>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="ml-3 space-y-1">
          {items.map(item => (
            <MenuLink
              key={item.path}
              to={item.path}
              label={item.label}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}

      {/* Section separator */}
      <div
        className="my-3 border-t"
        style={{ borderColor: "var(--border-subtle)" }}
      />
    </div>
  );
}

export default function Sidebar({ open, onNavigate }) {
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          min-h-screen flex flex-col
          shadow-[1px_0_4px_rgba(0,0,0,0.06)]
          overflow-hidden
          transition-all duration-300
          ${open ? "w-64" : "w-0"}
        `}
        style={{
          backgroundColor: "var(--bg-sidebar)",
          borderRight: "1px solid var(--border-subtle)",
          color: "var(--text-primary)"
        }}
      >
        {/* Header */}
        <div
          className="p-4 font-semibold"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          Dashboard
        </div>

        {/* Main navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {menu.map(section => (
            <MenuSection
              key={section.section}
              section={section.section}
              items={section.items}
              onNavigate={onNavigate}
            />
          ))}
        </nav>

        {/* Bottom pinned actions */}
        <div
          className="p-4 space-y-1"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          {bottomMenu.map(item =>
            item.label === "Logout" ? (
              <button
                key={item.label}
                onClick={() => setLogoutOpen(true)}
                className="
                  w-full text-left px-3 py-2 rounded text-sm font-medium
                  text-red-600 hover:bg-red-50 transition
                "
              >
                Logout
              </button>
            ) : (
              <MenuLink
                key={item.path}
                to={item.path}
                label={item.label}
                onNavigate={onNavigate}
              />
            )
          )}
        </div>
      </aside>

      {/* Logout confirmation (INLINE MODAL) */}
      {logoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setLogoutOpen(false)}
          />

          {/* Modal */}
          <div
            className="relative rounded-lg shadow-lg w-full max-w-sm p-6 z-10"
            style={{
              backgroundColor: "var(--bg-main)",
              color: "var(--text-primary)"
            }}
          >
            <h2 className="text-lg font-semibold mb-4">
              Confirm logout
            </h2>

            <p className="mb-6 opacity-80">
              Are you sure you want to log out?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setLogoutOpen(false)}
                className="
                  px-4 py-2 rounded border transition
                  hover:bg-black/5
                "
                style={{ borderColor: "var(--border-subtle)" }}
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setLogoutOpen(false);
                  console.log("Logged out");
                }}
                className="
                  px-4 py-2 rounded bg-red-600 text-white
                  hover:bg-red-700 transition
                "
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

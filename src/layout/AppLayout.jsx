import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AppLayout({ children }) {
   const [sidebarOpen, setSidebarOpen] = useState(true);

   return (
      <div
         className="min-h-screen flex transition-colors duration-300"
         style={{ backgroundColor: "var(--bg-main)", color: "var(--text-primary)" }}>
         {/* Sidebar */}
         <div
            className={`
          fixed md:static z-20 h-full
          transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-0"}
        `}>
            <Sidebar
               open={sidebarOpen}
               onNavigate={() => {
                  if (window.innerWidth < 768) {
                     setSidebarOpen(false);
                  }
               }}
            />
         </div>

         {/* Mobile overlay (ONLY on small screens) */}
         {sidebarOpen && (
            <div
               onClick={() => setSidebarOpen(false)}
               className="fixed inset-0 bg-black/20 z-10 md:hidden"
            />
         )}

         {/* Main content */}
         <div className="flex-1 flex flex-col relative">
            <Navbar
               sidebarOpen={sidebarOpen}
               onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            />

            <main className="flex-1 p-6 transition-all duration-300">{children}</main>
         </div>
      </div>
   );
}

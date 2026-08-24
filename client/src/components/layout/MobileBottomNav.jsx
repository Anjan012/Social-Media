import { NavLink } from "react-router-dom";
import { Home, Search, Bell, Mail, User } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/explore", icon: Search, label: "Explore" },
  { to: "/notifications", icon: Bell, label: "Alerts" },
  { to: "/messages", icon: Mail, label: "Messages" },
  { to: "/profile", icon: User, label: "Profile" },
];

export const MobileBottomNav = () => (
  <nav
    className="fixed bottom-0 left-0 z-20 flex w-full items-center justify-around border-t border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95 lg:hidden"
    style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
  >
    {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
      <NavLink
        key={to}
        to={to}
        end={to === "/"}
        className={({ isActive }) =>
          `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] ${
            isActive
              ? "text-red-500"
              : "text-gray-500 dark:text-gray-400"
          }`
        }
      >
        <Icon className="h-6 w-6" />
        <span>{label}</span>
      </NavLink>
    ))}
  </nav>
);
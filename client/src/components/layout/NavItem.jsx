import { NavLink } from "react-router-dom";

export const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-4 rounded-lg px-3 py-2.5 text-base transition-colors ${
        isActive
          ? "bg-gray-100 font-semibold text-gray-900 dark:bg-gray-800 dark:text-white"
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      }`
    }
  >
    <Icon className="h-6 w-6" />
    <span>{label}</span>
  </NavLink>
);
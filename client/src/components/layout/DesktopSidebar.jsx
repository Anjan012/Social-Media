import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  ListChecks,
  User,
} from "lucide-react";
import { NavItem } from "./NavItem";

const NAV_ITEMS = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/explore", icon: Search, label: "Explore" },
  { to: "/notifications", icon: Bell, label: "Notifications" },
  { to: "/messages", icon: Mail, label: "Messages" },
  { to: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
  { to: "/lists", icon: ListChecks, label: "Lists" },
  { to: "/profile", icon: User, label: "Profile" },
];

export const DesktopSidebar = () => (
  <aside className="hidden shrink-0 lg:block lg:w-64">
    <nav className="sticky top-20 flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <NavItem key={item.to} {...item} />
      ))}
    </nav>
  </aside>
);
import { Navbar } from "../ui/shared/Navbar";
import { DesktopSidebar } from "./DesktopSidebar";
import { RightSidebar } from "./RightSidebar";
import { MobileBottomNav } from "./MobileBottomNav";

/**
 * Single source of truth for the app shell. Every page renders its content
 * as `children` and gets the nav chrome for free - mobile-first:
 * - mobile: Navbar on top, MobileBottomNav fixed at the bottom
 * - lg+: DesktopSidebar appears on the left
 * - xl+: RightSidebar appears on the right
 */
export const AppLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
    <Navbar />

    <div className="mx-auto flex max-w-7xl gap-6 px-3 pb-20 pt-2 sm:px-6 lg:gap-8 lg:px-8 lg:pb-8 lg:pt-6">
      <DesktopSidebar />

      <main className="min-w-0 flex-1">{children}</main>

      <RightSidebar />
    </div>

    <MobileBottomNav />
  </div>
);
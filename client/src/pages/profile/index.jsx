import React from "react";
import { Navbar } from "../../components/ui/shared/Navbar";

import { ProfileSection } from "./profile-page/ProfileSection";
import { ProfileTab } from "./profile-page/ProfileTab";
import { PostBox } from "../shared/Postbox";
import { ProfilePost } from "./profile-page/ProfilePost";

export function Profile() {
 
  return (
    <>
      <Navbar />
      <div className="w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        {/* Cover area */}
        <div className="h-32 sm:h-48 md:h-56 bg-linear-to-r from-red-400/20 to-purple-500/20 relative" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProfileSection />
          <ProfileTab />
          <PostBox  />
          <ProfilePost />
        </div>
      </div >
    </>
  );
}
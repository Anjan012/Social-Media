import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link as LinkIcon, MapPin, Users } from "lucide-react";
import { Navbar } from "../components/ui/shared/Navbar";

export function Profile({
  username = "Anjan khadka ",
  displayName = "@Anjan_012",
  bio = "Capturing moments | Nightlife enthusiast 🌃 | DM for collabs",
  avatarUrl = "https://github.com/shadcn.png",
  postsCount = 35,
  followersCount = 50000,
  followingCount = 905,
  isFollowing = false,
  website,
  location,
}) {
  return (
    <>
    <Navbar />
    <div className="w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      {/* Cover area */}
      <div className="h-32 sm:h-48 md:h-56 bg-gradient-to-r from-red-400/20 to-purple-500/20 relative" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Avatar + main content overlapping cover */}
        <div className="relative -mt-16 sm:-mt-20 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:gap-6">
            {/* Large avatar */}
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-white dark:border-gray-900 shadow-xl">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback className="text-4xl bg-red-500 text-white">
                  {displayName?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Info section */}
            <div className="flex-1 mt-4 sm:mt-0 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {displayName}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                {username}
              </p>

              {/* Stats */}
              <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {postsCount.toLocaleString()}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">Posts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {followersCount.toLocaleString()}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">Followers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {followingCount.toLocaleString()}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">Following</span>
                </div>
              </div>

              {/* Bio */}
              {bio && (
                <p className="mt-3 text-gray-700 dark:text-gray-300 max-w-xl mx-auto sm:mx-0">
                  {bio}
                </p>
              )}

              {/* Location & website */}
              <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                {location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{location}</span>
                  </div>
                )}
                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:underline"
                  >
                    <LinkIcon className="h-4 w-4" />
                    <span>Website</span>
                  </a>
                )}
              </div>

              {/* Buttons */}
              <div className="mt-5 flex flex-wrap justify-center sm:justify-start gap-3">
                <Button
                  className={`min-w-[120px] ${
                    isFollowing
                      ? "bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>

                <Button variant="outline" className="min-w-[120px]">
                  Message
                </Button>

                <Button variant="ghost" size="icon">
                  <Users className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Tabs */}
        <div className="flex justify-center sm:justify-start gap-8 text-sm font-medium">
          <button className="pb-4 border-b-2 border-red-500 text-red-500">
            Posts
          </button>
          <button className="pb-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            Stories
          </button>
          <button className="pb-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            Photos
          </button>
          <button className="pb-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            Tagged
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
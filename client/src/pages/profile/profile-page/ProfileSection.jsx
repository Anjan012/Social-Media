import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Link as LinkIcon, MapPin, Users } from "lucide-react";
import { useParams } from "react-router-dom";


export const ProfileSection = ({ displayName = "@Anjan_012",
    avatarUrl = "default_profile.jpg",
    postsCount = 35,
    isFollowing = false,
}) => {

    const {id} = useParams();
    const [user, setUser] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const PROFILE_URL = `/api/user/profile/${id}`;

        const getProfile = async () => {
            const response = await axios.get(PROFILE_URL, { withCredentials: true });
            setUser(response.data.user);
        };

        getProfile();

    }, []);

    const isOwnProfile = true;

    return (
        <div className="relative -mt-16 sm:-mt-20 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6 lg:gap-6">
                {/* Large avatar */}
                <div className="shrink-0 mx-auto sm:mx-0">
                    <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 lg:mt-12 border-white dark:border-gray-900 shadow-xl">
                        <AvatarImage src={avatarUrl} alt={displayName} />
                        <AvatarFallback className="text-4xl bg-red-500 text-white">
                            {displayName?.[0] || "?"}
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* Info section */}
                <div className="flex-1 mt-4 sm:mt-20 text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {user.username}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                        {user.fullname}
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
                                {user.followers?.length || 0}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">Followers</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-900 dark:text-white">
                                {user.following?.length || 0}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">Following</span>
                        </div>
                    </div>

                    {/* Bio */}
                    {user.bio && (
                        <p className="mt-3 text-gray-700 dark:text-gray-300 max-w-xl mx-auto sm:mx-0">
                            {user.bio}
                        </p>
                    )}

                    {/* Location & website */}
                    <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                        {user.location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{user.location}</span>
                            </div>
                        )}
                        {user.website && (
                            <a
                                href={user.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:underline"
                            >
                                <LinkIcon className="h-4 w-4" />
                                <span>{user.website}</span>
                            </a>
                        )}
                    </div>

                    <div className="mt-5 flex flex-wrap justify-center sm:justify-start gap-3">
                        <Button
                            className={`min-w-30 ${isFollowing
                                ? "bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                                : "bg-red-500 hover:bg-red-600 text-white"
                                }`}
                        >
                            {isFollowing ? "Following" : "Follow"}
                        </Button>

                        <Button variant="outline" className="min-w-30">
                            Message
                        </Button>

                        <Button variant="ghost" size="icon">
                            <Users className="h-5 w-5" />
                        </Button>

                        {isOwnProfile && (
                            <Button
                                variant="outline"
                                className="min-w-35 border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700"
                                onClick={() => navigate("/profile/update")} // or open modal / go to edit page
                            >
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
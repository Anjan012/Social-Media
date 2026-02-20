
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Link as LinkIcon, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export const ProfileSection = ({
    avatarUrl = "default_profile.jpg",
    profileData,
    user
}) => {

    const [isFollowing, setIsFollowing] = useState(profileData.isFollowing);
    const [followerCount, setFollowerCount] = useState(user.followers?.length || 0)

    useEffect(() => {
        setIsFollowing(profileData.isFollowing);
        setFollowerCount(user.followers?.length || 0);
    }, [profileData.isFollowing, user.followers]);

    const navigate = useNavigate();

    const handleFollow = async (id) => {
        try {
            const URL = `/api/v1/users/${id}/follow`;

            const res = await axios.post(
                URL,
                {},
                { withCredentials: true }
            );

            if (res.status === 200) {
                toast(res.data.message);
                setIsFollowing((prev)=> !prev);
                setFollowerCount((prev) => isFollowing ? prev - 1 : prev + 1);
            }

        } catch (error) {
            console.log(error);
        }
    };


    return (
        <>

            {
                profileData.isOwnProfile ? (
                    <div className="relative -mt-16 sm:-mt-20 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6 lg:gap-6">
                            {/* Large avatar */}
                            <div className="shrink-0 mx-auto sm:mx-0">
                                <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 lg:mt-12 border-white dark:border-gray-900 shadow-xl">
                                    <AvatarImage src={avatarUrl} alt="user" />
                                    <AvatarFallback className="text-4xl bg-red-500 text-white font-bold">
                                        {
                                            user.username?.[0].toUpperCase()
                                        }
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
                                            {profileData.posts?.length || 0}
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

                                    {profileData.isOwnProfile && (
                                        <Button
                                            variant="outline"
                                            className="min-w-35 border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700"
                                            onClick={() => navigate(`/profile/${user._id}/update`)} // or open modal / go to edit page
                                        >
                                            Edit Profile
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) :
                    (
                        <div className="relative -mt-16 sm:-mt-20 pb-6">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6 lg:gap-6">
                                {/* Large avatar */}
                                <div className="shrink-0 mx-auto sm:mx-0">
                                    <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 lg:mt-12 border-white dark:border-gray-900 shadow-xl">
                                        <AvatarImage src={avatarUrl} alt="user" />
                                        <AvatarFallback className="text-4xl bg-red-500 text-white">
                                            {
                                                user.username?.[0].toUpperCase()
                                            }
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
                                                {profileData.posts?.length}
                                            </span>
                                            <span className="text-gray-500 dark:text-gray-400">Posts</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                {followerCount}
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
                                            onClick={() => { handleFollow(user._id) }}
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

                                    </div>
                                </div>
                            </div>
                        </div>
                    )
            }

        </>



    )
}
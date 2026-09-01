
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../../../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/dialog";
import { Link as LinkIcon, MapPin, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export const ProfileSection = ({
    profileData,
    user,
}) => {

    const [isFollowing, setIsFollowing] = useState(Boolean(profileData?.isFollowing));
    const [followerCount, setFollowerCount] = useState(Number(profileData?.followersCount || 0));
    const [followingCount, setFollowingCount] = useState(Number(profileData?.followingCount || 0));
    const [followDialog, setFollowDialog] = useState({
        open: false,
        type: "followers",
        items: [],
        loading: false,
    });

    const navigate = useNavigate();

    useEffect(() => {
        setIsFollowing(Boolean(profileData?.isFollowing));
        setFollowerCount(Number(profileData?.followersCount || 0));
        setFollowingCount(Number(profileData?.followingCount || 0));
    }, [profileData?.isFollowing, profileData?.followersCount, profileData?.followingCount]);

    const refreshFollowCounts = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/api/v1/users/${id}/follow-counts`, {
                withCredentials: true,
            });

            const counts = response?.data?.data || {};
            setFollowerCount(Number(counts.followersCount || 0));
            setFollowingCount(Number(counts.followingCount || 0));
        } catch (error) {
            console.error("Failed to refresh follow counts:", error);
        }
    };

    const fetchFollowList = async (type) => {
        if (!user?._id) return;

        setFollowDialog({
            open: true,
            type,
            items: [],
            loading: true,
        });

        try {
            const response = await axios.get(`${API_URL}/api/v1/users/${user._id}/${type}`, {
                withCredentials: true,
            });

            const items = response?.data?.data?.items || [];
            setFollowDialog({
                open: true,
                type,
                items,
                loading: false,
            });
        } catch (error) {
            console.error(`Failed to fetch ${type}:`, error);
            setFollowDialog({
                open: true,
                type,
                items: [],
                loading: false,
            });
        }
    };

    const handleFollow = async (id) => {
        try {
            const URL = `${API_URL}/api/v1/users/${id}/follow`;

            const res = await axios.post(
                URL,
                {},
                { withCredentials: true }
            );

            if (res.status === 200) {
                toast(res.data.message);
                const nextFollowingState = !isFollowing;
                setIsFollowing(nextFollowingState);
                await refreshFollowCounts(id);
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
                                    <AvatarImage src={user.profilePicture} alt="user" />
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
                                    <button
                                        type="button"
                                        onClick={() => fetchFollowList("followers")}
                                        className="flex items-center gap-1.5 hover:opacity-80 focus:outline-none cursor-pointer"
                                    >
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {followerCount}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400">Followers</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => fetchFollowList("following")}
                                        className="flex items-center gap-1.5 hover:opacity-80 focus:outline-none cursor-pointer"
                                    >
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {followingCount}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400">Following</span>
                                    </button>
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
                                        <AvatarImage src={user.profilePicture} alt="user" />
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
                                        <button
                                            type="button"
                                            onClick={() => fetchFollowList("followers")}
                                            className="flex items-center gap-1.5 hover:opacity-80 focus:outline-none cursor-pointer"
                                        >
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                {followerCount}
                                            </span>
                                            <span className="text-gray-500 dark:text-gray-400">Followers</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => fetchFollowList("following")}
                                            className="flex items-center gap-1.5 hover:opacity-80 focus:outline-none cursor-pointer"
                                        >
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                {followingCount}
                                            </span>
                                            <span className="text-gray-500 dark:text-gray-400">Following</span>
                                        </button>
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

            <Dialog
                open={followDialog.open}
                onOpenChange={(nextOpen) =>
                    setFollowDialog((prev) => ({
                        ...prev,
                        open: nextOpen,
                    }))
                }
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="capitalize">
                            {followDialog.type === "followers" ? "Followers" : "Following"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
                        {followDialog.loading ? (
                            <div className="py-8 text-center text-sm text-gray-500">Loading...</div>
                        ) : followDialog.items.length === 0 ? (
                            <div className="py-8 text-center text-sm text-gray-500">
                                No {followDialog.type === "followers" ? "followers" : "following users"} yet.
                            </div>
                        ) : (
                            followDialog.items.map((item) => {
                                const followUser = followDialog.type === "followers"
                                    ? item?.followerUserId
                                    : item?.followingUserId;

                                if (!followUser) return null;

                                return (
                                    <Link
                                        key={followUser._id || item._id}
                                        type="button"
                                        onClick={() => {
                                            setFollowDialog((prev) => ({ ...prev, open: false }));
                                            navigate(`/profile/${followUser._id}`);
                                        }}
                                        className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 text-left transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
                                    >
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={followUser.profilePicture || ""} alt={followUser.username} />
                                            <AvatarFallback className="bg-red-500 text-white">
                                                {followUser.username?.[0]?.toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-gray-900 dark:text-white">
                                                {followUser.username}
                                            </p>
                                            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                                {followUser.fullname || "@" + followUser.username}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
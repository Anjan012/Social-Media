import { Skeleton } from "@/components/ui/skeleton";

export const ProfilePostSkeleton = ({ count = 2 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="
                        bg-white dark:bg-gray-900
                        rounded-xl
                        shadow-sm
                        border border-gray-200 dark:border-gray-800
                        overflow-hidden
                        my-4
                    "
                >
                    {/* Post Header */}
                    <div className="flex items-center justify-between px-4 pt-4 pb-2">
                        <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <Skeleton className="h-10 w-10 rounded-full" />

                            {/* User info */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-28 rounded" />
                                <Skeleton className="h-3 w-40 rounded" />
                            </div>
                        </div>

                        {/* Menu button */}
                        <Skeleton className="h-9 w-9 rounded-full" />
                    </div>

                    {/* Post Content */}
                    <div className="px-4 pb-3 space-y-2">
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-4/5 rounded" />
                    </div>

                    {/* Post Image */}
                    <Skeleton className="w-full h-72 sm:h-96 rounded-none" />

                    {/* Post Actions */}
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            px-4
                            py-3
                            border-t
                            border-gray-200
                            dark:border-gray-800
                        "
                    >
                        <div className="flex items-center gap-8">
                            {/* Like */}
                            <div className="flex items-center gap-1.5">
                                <Skeleton className="h-6 w-6 rounded-full" />
                                <Skeleton className="h-4 w-6 rounded" />
                            </div>

                            {/* Comment */}
                            <div className="flex items-center gap-1.5">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-4 w-6 rounded" />
                            </div>

                            {/* Share */}
                            <div className="flex items-center gap-1.5">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-4 w-6 rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

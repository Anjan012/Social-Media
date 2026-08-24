import { Skeleton } from "@/components/ui/skeleton";

export const ProfileSectionSkeleton = () => {
    return (
        <div className="relative -mt-16 sm:-mt-20 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6 lg:gap-6">

                {/* Avatar */}
                <div className="shrink-0 mx-auto sm:mx-0">
                    <Skeleton
                        className="
                            w-32 h-32
                            sm:w-40 sm:h-40
                            rounded-full
                            border-4
                            lg:mt-12
                            border-white dark:border-gray-900
                        "
                    />
                </div>

                {/* Profile information */}
                <div className="flex-1 mt-4 sm:mt-20 w-full text-center sm:text-left">

                    {/* Username */}
                    <Skeleton
                        className="
                            h-8
                            w-40
                            mx-auto
                            sm:mx-0
                            rounded-md
                        "
                    />

                    {/* Full name */}
                    <Skeleton
                        className="
                            h-5
                            w-32
                            mt-2
                            mx-auto
                            sm:mx-0
                            rounded-md
                        "
                    />

                    {/* Stats */}
                    <div
                        className="
                            mt-4
                            flex
                            flex-wrap
                            justify-center
                            sm:justify-start
                            gap-x-6
                            gap-y-2
                        "
                    >
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-8 rounded" />
                            <Skeleton className="h-4 w-12 rounded" />
                        </div>

                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-8 rounded" />
                            <Skeleton className="h-4 w-16 rounded" />
                        </div>

                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-8 rounded" />
                            <Skeleton className="h-4 w-16 rounded" />
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="mt-4 space-y-2 max-w-xl mx-auto sm:mx-0">
                        <Skeleton className="h-4 w-full max-w-xl rounded" />
                        <Skeleton className="h-4 w-4/5 max-w-md rounded" />
                    </div>

                    {/* Location + Website */}
                    <div
                        className="
                            mt-3
                            flex
                            flex-wrap
                            justify-center
                            sm:justify-start
                            gap-x-5
                            gap-y-2
                        "
                    >
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-4 w-24 rounded" />
                        </div>

                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-32 rounded" />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div
                        className="
                            mt-5
                            flex
                            flex-wrap
                            justify-center
                            sm:justify-start
                            gap-3
                        "
                    >
                        <Skeleton className="h-10 w-32 rounded-md" />
                        <Skeleton className="h-10 w-32 rounded-md" />
                        <Skeleton className="h-10 w-10 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
};
